import jsonwebtoken from "jsonwebtoken"; //Token
import bcryptjs from "bcryptjs"; //Encriptar

import DoctorsModel from "../models/Doctors.js";

import { config } from "../config.js";
import { sendMail, HTMLRecoveryEmail } from "../utils/MailPasswordRecovery.js";
import { verify } from "crypto";

//1- Creo un array de funciones
const passwordRecoveryController = {};

//ENVIAR CODIGO--------------------------------------------------------------------------------------
passwordRecoveryController.requestCode = async (req, res) => {
  const { email } = req.body;

  try {
    let userFound;
    let userType;

    userFound = await DoctorsModel.findOne({ email });
    if (userFound) {
      userType = "doctor";
    }


    if (!userFound) {
      return res.json({ message: "Doctor not found" });
    }

    // Generar un código aleatorio
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    //Crear un token que guarde todo
    const token = jsonwebtoken.sign(
      //1-¿que voy a guardar?
      { email, code, userType, verfied: false },
      //2-secret key
      config.JWT.secret,
      //3-¿cuando expira?
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", token, { maxAge: 20 * 60 * 1000 });

    // ULTIMO PASO, enviar el correo
    await sendMail(
      email,
      "Password recovery code", //Asunto
      `Your verification code is: ${code}`, //Texto
      HTMLRecoveryEmail(code) //
    );

    res.json({ message: "Verification code send" });
  } catch (error) {
    res.error({message: "error: "+error})
  }
};


//VERIFICAR CODIGO----------------------------------------------------------------------------------------
passwordRecoveryController.verfiedCode = async(req, res)=>{
    //pedir codigo
    const {code} = req.body;

    try {
        //extraer el token de las cookies
        const token = req.cookies.tokenRecoveryCode;
        
        //decpdificar el token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        //verificar si el token es el mismoque esta guardado
        if(decoded.code !== code){
            return res.json({message: "Invalid Code"})
        }

        //generamos un nuevo token
        const newToken = jsonwebtoken.sign(
            {
                //lo que vamos a guardar
                email: decoded.email,
                code: decoded.code,
                userType: decoded.userType,
                verify: true
            },

            //secreto
            config.JWT.secret,

            //expira
            {expiresIn: "20m"}

        )

        res.cookie("tokenRecoveryCode", newToken, {maxAge:20*60*1000})

        res.json({message: "Code verified successfully"})



    } catch (error) {
        console.log("error: "+ error)
    }

}

//CAMBIAR LA CONTRASEÑA--------------------------------------------------------------------------------
passwordRecoveryController.newPassword = async(req, res)=>{
    const {newPassword} = req.body;
    try {
        //extraer el token de las cookies
        const token = req.cookies.tokenRecoveryCode;

        //desglozar lo que tiene el codigo adentro ----- espera el token y el secreto
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        //accedemos a la variable verified para ver qu valor tiene
        if(!decoded.verify){
            return res.json({message: "Code no verified"})
        }

        //extraer el correo y tipo de usuario
        const {email, userType} = decoded;

        let user;
  

        //buscamos al usuario dependiendo del userType
        if(userType === "doctor"){
            user = await DoctorsModel.findOne ({email})
        //encriptar la contraseña
        const hashPassword = await bcryptjs.hash(newPassword, 10)

        //actualizar la contraseña
        let updateUser;
        if(userType === "doctor"){
            updateUser= await DoctorsModel.findOneAndUpdate(
                {email},
                {password: hashPassword}, 
                {new: true}
            )
        }

        res.clearCookie("tokenRecoveryCode");
        res.json({message: "Password updated successfully"});
    }
    } catch (error) {
        console.log("error: "+ error)
    }

}


export default passwordRecoveryController;