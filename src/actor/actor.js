import { ObjectId } from "mongodb";

// Estructura de los datos de un actor
export const Actor = {
    _id: ObjectId,
    idPelicula: String,
    nombre: String,
    edad: Number,
    estaRetirado: Boolean,
    premios: Array
};
