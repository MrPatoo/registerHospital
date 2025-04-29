import express from "express";
import registerDoctorsCtrl from "../controllers/registerDoctorsCtrl.js";

const router = express.Router();

router.route("/").post(registerDoctorsCtrl.register)

export default router;