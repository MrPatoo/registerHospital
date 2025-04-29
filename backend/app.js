import express from "express"
import cookieParser from "cookie-parser";

//routes
import registerDoctors from "./src/routes/registerDoctors.js"
import passwordRecovery from "./src/routes/passwordRecovery.js";

const app = express();

app.use(express.json())

//cookies
app.use (cookieParser());

//endpoints
app.use("/api/registerDoctors", registerDoctors);
app.use("/api/passwordRecovery", passwordRecovery);







export default app;