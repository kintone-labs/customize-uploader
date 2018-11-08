import chokidar from "chokidar";
import fs from "fs";

import CustomizeFileStatus from "./CustomizeFileStatus";
import KintoneApiClient, {
  AuthenticationError,
  CustomizeManifest,
  FileCustomizeSetting
} from "./KintoneApiClient";
import { Lang } from "./lang";
import { getBoundMessage } from "./messages";
import { isUrlString, wait } from "./util";

export interface Option {
  watch?: string;
  lang: Lang;
  proxy: string;
  guestSpaceId: number;
}

export interface Status {
  retryCount: number;
  updateBody: CustomizeManifest | null;
  updated: boolean;
}

const MAX_RETRY_COUNT = 3;

export async function upload(
  kintoneApiClient: KintoneApiClient,
  manifest: CustomizeManifest,
  status: {
    retryCount: number;
    updateBody: CustomizeManifest | null;
    updated: boolean;
  },
  options: Option,
  customizeFileStatus?: CustomizeFileStatus
): Promise<CustomizeFileStatus> {
  const m = getBoundMessage(options.lang);
  const appId = manifest.app;
  let { retryCount, updateBody, updated } = status;

  try {
    if (!updateBody) {
      console.log(m("M_StartUploading"));
      try {
        const [desktopJS, desktopCSS, mobileJS] = await Promise.all(
          [
            {
              files: manifest.desktop.js,
              type: "text/javascript",
              target: "desktop"
            },
            {
              files: manifest.desktop.css,
              type: "text/css",
              target: "desktop"
            },
            {
              files: manifest.mobile.js,
              type: "text/javascript",
              target: "desktop"
            }
          ].map(({ files, type, target }) =>
            Promise.all(
              files.map((file: string, index: number) => {
                if (
                  customizeFileStatus &&
                  customizeFileStatus.canSkipUpload()
                ) {
                  const reuseCustomizeSetting: FileCustomizeSetting = {
                    type: "FILE",
                    file: {
                      fileKey: customizeFileStatus.getFileKey(
                        target,
                        type,
                        index
                      )
                    }
                  };
                  return Promise.resolve(reuseCustomizeSetting);
                }
                return kintoneApiClient
                  .prepareCustomizeFile(file, type)
                  .then(result => {
                    if (result.type === "FILE") {
                      console.log(`${file} ` + m("M_Uploaded"));
                    }
                    return result;
                  });
              })
            )
          )
        );
        updateBody = Object.assign({}, manifest, {
          desktop: {
            js: desktopJS,
            css: desktopCSS
          },
          mobile: {
            js: mobileJS
          }
        });
        console.log(m("M_FileUploaded"));
      } catch (e) {
        console.log(m("E_FileUploaded"));
        throw e;
      }
    }

    if (!updated) {
      try {
        await kintoneApiClient.updateCustomizeSetting(updateBody);
        console.log(m("M_Updated"));
        updated = true;
      } catch (e) {
        console.log(m("E_Updated"));
        throw e;
      }
    }

    try {
      await kintoneApiClient.deploySetting(appId);
      await kintoneApiClient.waitFinishingDeploy(appId, () =>
        console.log(m("M_Deploying"))
      );
      console.log(m("M_Deployed"));
    } catch (e) {
      console.log(m("E_Deployed"));
      throw e;
    }
  } catch (e) {
    const isAuthenticationError = e instanceof AuthenticationError;
    retryCount++;
    if (isAuthenticationError) {
      throw new Error(m("E_Authentication"));
    } else if (retryCount < MAX_RETRY_COUNT) {
      await wait(1000);
      console.log(m("E_Retry"));
      await upload(
        kintoneApiClient,
        manifest,
        { retryCount, updateBody, updated },
        options,
        customizeFileStatus
      );
    } else {
      throw e;
    }
  }
  if (!updateBody) {
    throw new Error("updateBody must exist");
  }
  return new CustomizeFileStatus(manifest);
}

export const run = async (
  domain: string,
  username: string,
  password: string,
  basicAuthUsername: string | null,
  basicAuthPassword: string | null,
  manifestFile: string,
  options: Option
): Promise<void> => {
  const m = getBoundMessage(options.lang);

  const manifest: CustomizeManifest = JSON.parse(
    fs.readFileSync(manifestFile, "utf8")
  );
  const status = {
    retryCount: 0,
    updateBody: null,
    updated: false
  };

  const files = manifest.desktop.js
    .concat(manifest.desktop.css, manifest.mobile.js)
    .filter((fileOrPath: string) => !isUrlString(fileOrPath));

  const kintoneApiClient = new KintoneApiClient(
    username,
    password,
    basicAuthUsername,
    basicAuthPassword,
    domain,
    options
  );
  const customizeFileStatus = await upload(
    kintoneApiClient,
    manifest,
    status,
    options
  );

  if (options.watch) {
    const watcher = chokidar.watch(files, {
      // Avoid that multiple change events were fired depending on which OS or text editors you are using with
      // Note that there would be higher possibility to get errors if you set smaller value of 'stabilityThreshold'
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
      }
    });
    let customizeSetting = await kintoneApiClient.getCustomizeSetting(
      manifest.app
    );
    customizeFileStatus.setFileKey(customizeSetting);
    console.log(m("M_Watching"));
    watcher.on("change", async () => {
      await upload(
        kintoneApiClient,
        manifest,
        status,
        options,
        customizeFileStatus
      );
      customizeSetting = await kintoneApiClient.getCustomizeSetting(
        manifest.app
      );
      customizeFileStatus.setFileKey(customizeSetting);
    });
  }
};
