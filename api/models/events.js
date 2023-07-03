import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  
  evento: { type: String, require: true },
  nombre: { type: String, require: true },
  apellido: { type: String, require: true },
  telefono: { type: String, require: true },
  adultos: { type: Number, require: true },
  menores: { type: Number, require: true },
  date: { type: String, require: true },
  horaInicia: { type: String, require: true },
  horaFinaliza: { type: String, require: true },
  opcion: { type: String, require: true },
  horasAdicional: { type: String, require: true },
  camareraAdicional: { type: String, require: true },
  comentarios: { type: String, require: true },
  seña: { type: String, require: true },
  saldado: { type: Boolean, require: true },
  calendarData: [{type: Object, required: true}],
})
    
export const eventModel = mongoose.model('events', eventSchema);