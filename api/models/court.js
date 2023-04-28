import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    unavailableDates: {
        Lunes: [{ type: Object }],
        Martes: [{ type: Object }],
        Miercoles: [{ type: Object }],
        Jueves: [{ type: Object }],
        Viernes: [{ type: Object }],
        Sabado: [{ type: Object }],
        Domingo: [{ type: Object }],
    }
});

export const usermodel = mongoose.model('courts', userSchema);