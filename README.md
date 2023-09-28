# CFMan-UI

[![build](https://github.com/morkid/cfmanui/actions/workflows/build.yaml/badge.svg)](https://github.com/morkid/cfmanui/actions/workflows/build.yaml)
[![test](https://github.com/morkid/cfmanui/actions/workflows/test.yaml/badge.svg)](https://github.com/morkid/cfmanui/actions/workflows/test.yaml)

Cloudflare Manager UI (CFMan-UI) is a simple administration site to manage your cloudflare dns records.  

Features:  
- List all Zones
- List all DNS Records
- Purge Zone Cache
- Create DNS Record
- Edit DNS Record
- Delete DNS Record

Supported DNS record types:
- A
- AAAA
- CNAME
- TXT
- MX

## Before you begin
You need Cloudflare API Token to connecting CFMan-UI dashboard and Cloudflare API.  

Create an API Token on cloudflare dashboard with the following steps:
1. Sign in to Cloudflare dashboard
2. Go to profile menu
3. Click on API Tokens
4. Create a token *(Not API Keys)*
5. Create new Custom Token
6. Fill the token name
7. Add 3 permissions: 
   | Resource | Access     | Action |
   |----------|------------|--------|
   | Zone     | Zone       | Read   |
   | Zone     | Cache Puge | Purge  |
   | Zone     | DNS        | Edit   |
8. Continue and keep the Token

## Starting CFMan-UI using yarn

Create a file with name `.env.local` and place it on the root project with content like the following example:
```bash
VITE_API_AUTH_TOKEN="CLOUDFLARE_API_TOKEN_HERE"
```


Install all dependencies using `yarn`:
```bash
yarn install
```

Start CFMan-UI:
```bash
yarn start
```

## Start CFMan-UI using docker

Start CFMan-UI container

```bash
docker run \
   -it \
   -p 3000:3000 \
   -e CLOUDFLARE_API_AUTHTOKEN=CLOUDFLARE_API_TOKEN_HERE \
   morkid/cfmanui
```


## DISCLAIMER:

Welcome to this open-source project repository. We would like to remind you that the use or interaction with the code, scripts, or files here is entirely at your own risk. We, as contributors to the project, are not responsible for data loss, damage, or any other issues that may arise from the use of materials from this repository.

We recommend you take appropriate precautions, regularly back up your data, and test the code before using it in a production environment. We strive to provide quality code but cannot guarantee its accuracy, reliability, or suitability for any specific purpose.

By accessing or using materials from this repository, you agree that you understand and accept these terms. If you do not agree with these terms, please discontinue using this repository.

Thank you for your participation in this project.

## LICENSE
Published under the [MIT License](./LICENSE).
