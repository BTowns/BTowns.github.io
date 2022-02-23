# TakeHomeInterview

Quick start guide:

Assuming you already have node installed, nav to your desired folder and open CLI

```
npx create-react-app takehome
cd takehome
npm install octokit
```

download all js and css files from this repo, place them into the folder generated from the last step named "src" (overwrite any existing), and then run

```
npm start
```


The search functions work without generating an auth token, however you will be limited in how many searches you can perform in a time window.  A link to generate your auth token is provided on the app page, as well as here: https://github.com/settings/tokens/new?scopes=read:user
