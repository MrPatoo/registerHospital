import DoctorsModel from "../models/Doctors.js"    
import bcryptjs from "bcryptjs" //para encriptar
import  Jsonwebtoken  from "jsonwebtoken"; //para generar token
import { config } from "../config.js";


const registerDoctorsCtrl ={};

registerDoctorsCtrl.register = async (req, res) =>{
    const {name, especialty, email, password} = req.body
    
    try{
        //verificamos si el empleado ya existe
        const existDoctor=await DoctorsModel.findOne({email})
        
        if(existDoctor){
            return res.json({message: "El empleado ya existe"})
        }

        
        //encriptar
        const passwordHash = await bcryptjs.hash(password, 10)

        //guardamos el empleado nuevo                                para encriptar
        const newDoctor = new DoctorsModel({name, especialty, email, password: passwordHash})
        await newDoctor.save();


        //-->TOKEN<-------------------------------------------------------------------------------------
        
        Jsonwebtoken.sign(
            //1-que voy a guardar
            {id: newEmployee._id},

            //2-secreto
            config.JWT.secret,

            //3-cuando expira
            {expiresIn: config.JWT.expiresIn},

            //4-funcion flecha que espera el error o el token
            (error, token) =>{
                if(error) console.log(error)
                    res.cookie("authToken", token)
                    res.json({message: "Empleado registrado :D"})
            }

        )

    }catch(error){
        console.log(error);
    }
}

export default registerDoctorsCtrl;