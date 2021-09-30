# Appwrite + ReactJS = ❤

This example is to showcase [Appwrite's JS API](https://github.com/appwrite/sdk-for-js) with [React](https://reactjs.org/) by creating a Google drive clone using Appwrite Auth, database, Storage and realtime.

## Getting Started

To get started we will need to generate the collections. Start by making a new project in the Appwrite console. Now you will have to create an API key that the migration script is gonna use you can do this under the "API KEYS" tab on your appwrite console. Now go into the "appwrite_setup" folder in this project and copy the `.env.example` file and rename it to `.env`, then you have to fill in all the options otherwise the migration script won't run. Once you did that you will have to install the packages so the script can run:
```
yarn install
```
Now you try running the script by using the following command:
```
node migrate.js
```
This will return 2 collection ID's save these somewhere and remember which ID belongs to what collection.
Now go back to the main folder and copy the `.env.example` again, now name it `.env.local` you will again have to fill in all the options including the 2 ID's you got from running the script. Now you will again have to install all the packages using:
```
yarn install
```
Once you did that you're all good to go. Now you can start the app by running the following command:
```
yarn start
```