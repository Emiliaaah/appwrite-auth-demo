import { Appwrite } from "appwrite"

const app = new Appwrite()

app
.setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
.setProject(process.env.REACT_APP_APPWRITE_PROJECT)

export default app