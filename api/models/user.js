import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    nombre: { type: String, require: true },
    apellido: { type: String, require: true },
    edad: { type: String, require: true },
    telefono: { type: String, require: true },
    reserves: [{ type: Object }],
    admin: {type: Boolean, require: true},
});

export const usermodel = mongoose.model('users', userSchema);

//TODO: CONSTRUIR FORMATO DE OBJETO PARA RESERVAS DE USUARIO ==>> ASSIII?? 
// reserves: [
//     {
//         court: futbol,
//         day: lunes,
//         time: [xxxx - xxxxx]
//     }
// ]