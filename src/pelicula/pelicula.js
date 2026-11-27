import { ObjectId } from "mongodb";

// Estructura de los datos de una película
export const Pelicula = {
    _id: ObjectId,
    nombre: String,
    generos: Array,
    anioEstreno: Number
};
