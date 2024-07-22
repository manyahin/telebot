## Debug

run API endpoints locally

```bash
# run redis container before
$ docker run -it --name redis -v 6379:6379 redis
# start sam local api
$ sam local start-api -n local-lambda-env.json
```

## Deploy to Lambda

use sam deploy

    sam build && sam deploy

this is old method

```bash
# before
# https://console.aws.amazon.com/iam
$ aws configure

# Mac
$ zip -r function.zip .

# Win
# install 7Zip and update PATH
$ 7z a -tzip function.zip .

$ aws lambda update-function-code --function-name BotWizardCreatorBot --zip-file fileb://function.zip
```

Require to set WebHook after first deploy to AWS

TODO: fire this hook automatically after the deploy with param of HttpAPI url

# AWS tips

Delete stack

    aws cloudformation delete-stack --stack-name Telebot
