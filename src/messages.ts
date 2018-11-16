import { Lang } from "./lang";

type LangMap = { [lang in Lang]: string };
type MessageMap = { [key in keyof typeof messages]: LangMap };

const messages = {
  "error.required.manifest": {
    en: "Please specify manifest file",
    ja: "マニフェストファイルを指定してください"
  },
  "question.domain": {
    en: "Input your kintone's domain (example.cybozu.com):",
    ja: "kintoneのドメインを入力してください (example.cybozu.com):"
  },
  "question.username": {
    en: "Input your username:",
    ja: "ログイン名を入力してください:"
  },
  "question.password": {
    en: "Input your password:",
    ja: "パスワードを入力してください:"
  },
  "start.uploading": {
    en: "Start uploading customize files",
    ja: "カスタマイズのアップロードを開始します"
  },
  "upload.file": {
    en: "JavaScript/CSS files have been uploaded!",
    ja: "JavaScript/CSS ファイルをアップロードしました!"
  },
  "error.upload.file": {
    en: "Failed to upload JavaScript/CSS files",
    ja: "JavaScript/CSS ファイルのアップロードに失敗しました"
  },
  "has.uploaded": {
    en: "has been uploaded!",
    ja: "をアップロードしました!"
  },
  "update.file": {
    en: "Customize setting has been updated!",
    ja: "JavaScript/CSS カスタマイズの設定を変更しました!"
  },
  "error.update.file": {
    en: "Failed to update customize setting",
    ja: "JavaScript/CSS カスタマイズの設定の変更に失敗しました"
  },
  "has.deployed": {
    en: "Setting has been deployed!",
    ja: "運用環境に反映しました!"
  },
  "error.authentication": {
    en:
      "Failed to authenticate. Please confirm your username, password, and domain",
    ja: "認証に失敗しました。ログイン名、パスワード、ドメインを確認してください"
  },
  "error.deploy": {
    en: "Failed to deploy setting",
    ja: "運用環境への反映に失敗しました"
  },
  "wait.deploy": {
    en: "Wait for deploying completed...",
    ja: "運用環境への反映の完了を待っています..."
  },
  "watch.file": {
    en: "Watching for file changes...",
    ja: "ファイルの変更を監視しています..."
  },
  "error.then.retry": {
    en: "An error occured, retry",
    ja: "エラーが発生しました。リトライします"
  }
};

/**
 * Returns a message for the passed lang and key
 * @param lang
 * @param key
 */
export function getMessage(lang: keyof LangMap, key: keyof MessageMap): string {
  return messages[key][lang];
}

/**
 * Returns a function bound lang to getMessage
 * @param lang
 */
export function getBoundMessage(
  lang: keyof LangMap
): (key: keyof MessageMap) => string {
  return getMessage.bind(null, lang);
}
