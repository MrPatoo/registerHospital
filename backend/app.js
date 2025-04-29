import express from "express"
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())

//cookies
app.use (cookieParser());

//endpoints






export default app;