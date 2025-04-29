import express from "express"
import cookieParser from "cookie-parser";

//routes
import registerDoctors from "./src/routes/registerDoctors.js"

const app = express();

app.use(express.json())

//cookies
app.use (cookieParser());

//endpoints
app.use("/api/registerDoctors", registerDoctors);






export default app;