/*
fields:
    name, especialty, email, password
 */

import { Schema, model } from "mongoose";

const doctorsSchema = new Schema({
    name:{
        type: String,
        require: true
    },

    especialty:{
        type: String,
        require: true
    },

    //email unico
    email:{
        type: String,
        require: true,
        unique: true,
        match:[
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}$/,
            "Por favor ingrese un correo electronico valido", //validar el correo email
        ],
    },

    password:{
        type: String,
        require: true,
        minlenght: 6 //para poner un minimo de caracteres
    },
},{
    //tabla auditoria PRO
    timestamps: true,
    strict: false
})

export default model("Doctors", doctorsSchema);






