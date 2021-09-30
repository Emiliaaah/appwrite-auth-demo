require("dotenv").config();

// TODO: What if group exists and I add project? Will it be added?
// TODO: Add deleting support?

const sdk = require("node-appwrite");

let client = new sdk.Client();

client
  .setEndpoint(process.env.APPWRITE_API_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const database = new sdk.Database(client);
async function migrate() {
  let folderCollection = await database.createCollection("Folders", ["*"], ["*"], [
    {
      label: "name",
      key: "name",
      type: "text",
      default: null,
      required: true,
      array: false
    },
    {
      label: "parentId",
      key: "parentId",
      type: "text",
      default: null,
      required: false,
      array: false
    },
    {
      label: "userId",
      key: "userId",
      type: "text",
      default: null,
      required: true,
      array: false
    },
    {
      label: "path",
      key: "path",
      type: "wildcard",
      default: null,
      required: false,
      array: true
    },
    {
      label: "createdAt",
      key: "createdAt",
      type: "text",
      default: null,
      required: true,
      array: false
    }
  ])

  let filesCollection = await database.createCollection("Files", ["*"], ["*"], [
    {
      label: "fileId",
      key: "fileId",
      type: "text",
      default: null,
      required: true,
      array: false
    },
    {
      label: "previewUrl",
      key: "previewUrl",
      type: "text",
      default: null,
      required: false,
      array: false
    },
    {
      label: "downloadUrl",
      key: "downloadUrl",
      type: "text",
      default: null,
      required: true,
      array: false
    },
    {
      label: "viewUrl",
      key: "viewUrl",
      type: "text",
      default: null,
      required: true,
      array: false
    },
    {
      label: "name",
      key: "name",
      type: "text",
      default: null,
      required: true,
      array: false
    },
    {
      label: "folderId",
      key: "folderId",
      type: "text",
      default: null,
      required: false,
      array: false
    },
    {
      label: "userId",
      key: "userId",
      type: "text",
      default: null,
      required: true,
      array: false
    },
    {
      label: "public",
      key: "public",
      type: "boolean",
      default: false,
      required: true,
      array: false
    }
  ])

  console.log(`Folder Collection ID: ${folderCollection.$id}`)
  console.log(`Files Collection ID: ${filesCollection.$id}`)
}
migrate()