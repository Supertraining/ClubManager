import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    nombre: { type: String, require: true },
    apellido: { type: String, require: true },
    edad: { type: String, require: true },
    telefono: { type: String, require: true },
    admin: {type: Boolean, require: true},
});

export const usermodel = mongoose.model('users', userSchema);