# kintone-customize-uploader
A kintone customize uploader using [request-promise](https://github.com/request/request-promise)

## Usage
```
% npm install kintone-customize-uploader
% ./node_modules/.bin/kintone-customize-uploader
--domain ${yourDomain} \
--username ${yourLoginName} \
--password ${yourPassword} \
${manifestFile}
```

or

```
% npm install -g kintone-customize-uploader
% kintone-customize-uploader \
--domain ${yourDomain} \
--username ${yourLoginName} \
--password ${yourPassword} \
${manifestFile}
```

If you want to upload the customize files automatically when a file is updated, you can use `--watch` option.

```
% kintone-customize-uploader \
--domain ${yourDomain} \
--username ${yourLoginName} \
--password ${yourPassword} \
--watch \
${manifestFile}
```

## Options
```
  Usage
    $ kintone-customize-uploader <manifestFile>
  Options
    --domain Domain of your kintone
    --username Login username
    --password User's password
    --proxy Proxy server
    --watch Watch the changes of customize files and re-run
    --waiting-dialog-ms A ms for waiting show a input dialog
    --lang Using language (en or ja)
    --guest-space-id Guest space ID for uploading files
    You can set the values through environment variables
    domain: KINTONE_DOMAIN
    username: KINTONE_USERNAME
    password: KINTONE_PASSWORD
    proxy: HTTPS_PROXY or HTTP_PROXY
```

If you omit the options, you can input the options interactively.
```
% kintone-customize-uploader manifest.json
? Input your username: hoge
? Input your password: [hidden]
? Input your domain: example.com
```

## manifest.json
```json
{
    "app": "1",
    "scope": "ALL",
    "desktop": {
        "js": [
            "https://js.cybozu.com/jquery/3.3.1/jquery.min.js",
            "sample/customize.js"
        ],
        "css": [
            "sample/51-modern-default.css"
        ]
    },
    "mobile": {
        "js": [
            "https://js.cybozu.com/jquery/3.3.1/jquery.min.js"
        ]
    }
}
```
- `app` : The app id where to upload customize files to (`"APP_ID"`)
- `scope`: The scope to apply your customization (`"ALL"` || `"ADMIN"` || `"NONE"`)
- `desktop`: The customize files applied in PC view  (`"js": []` || `"css": []`)
- `mobile`: The customize files applied in mobile view (`"js": []`)

## LICENSE
MIT License