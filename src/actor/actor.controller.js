
import { ObjectId } from "mongodb";
import { conectarDB } from "../common/db.js";
import { Actor } from "./actor.js";

// Colecciones que utilizamos
const actorCollection = "actores";
const peliculaCollection = "peliculas";

// Revisar los datos del actor
function validarActor(datos) {
    if (!datos || typeof datos.nombre !== "string" ||
        datos.nombre.trim() === "") {
        return "El nombre del actor es obligatorio";
    }

    if (typeof datos.idPelicula !== "string" ||
        !ObjectId.isValid(datos.idPelicula)) {
        return "El ID de la película no es válido";
    }

    if (!Number.isInteger(datos.edad) || datos.edad < 0) {
        return "La edad debe ser un número entero válido";
    }

    if (typeof datos.estaRetirado !== "boolean") {
        return "Debe indicar si el actor está retirado";
    }

    if (!Array.isArray(datos.premios) ||
        !datos.premios.every(p =>
            typeof p === "string" && p.trim() !== "")) {
        return "Los premios deben ingresarse como una lista";
    }

    return null;
}

// Registrar un actor
export async function crearActor(req, res) {
    try {
        const datos = req.body;
        const error = validarActor(datos);

        if (error) {
            return res.status(400).json({ mensaje: error });
        }

        const idPelicula = new ObjectId(datos.idPelicula);

        // Preparar los datos que vamos a guardar
        const actor = {};

        for (const campo of Object.keys(Actor)) {
            if (campo !== "_id") {
                actor[campo] = datos[campo];
            }
        }

        return conectarDB()
            .then((db) => {
                // Buscar la película asociada al actor
                return db.collection(peliculaCollection).findOne({
                    _id: idPelicula
                }).then((pelicula) => {
                    if (!pelicula || !pelicula.nombre ||
                        typeof pelicula.nombre !== "string") {
                        res.status(404).json({
                            mensaje: "La película asociada no existe o no tiene nombre"
                        });
                        return null;
                    }

                    return db.collection(actorCollection).insertOne(actor);
                });
            })
            .then((resultado) => {
                if (!resultado) {
                    return;
                }

                res.status(201).json({
                    mensaje: "Actor registrado correctamente",
                    id: resultado.insertedId
                });
            })
            .catch((error) => {
                res.status(500).json({
                    mensaje: "Error al registrar el actor"
                });
            });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al procesar el ID de la película"
        });
    }
}

// Consultar todos los actores
export async function obtenerActores(req, res) {
    return conectarDB()
        .then((db) => {
            return db.collection(actorCollection).find().toArray();
        })
        .then((actores) => {
            res.status(200).json(actores);
        })
        .catch((error) => {
            res.status(500).json({
                mensaje: "Error al consultar los actores"
            });
        });
}

// Consultar un actor por su ID
export async function obtenerActorPorId(req, res, next) {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje: "ID de actor no válido"
            });
        }

        const idObject = new ObjectId(id);

        return conectarDB()
            .then((db) => {
                return db.collection(actorCollection).findOne({
                    _id: idObject
                });
            })
            .then((actor) => {
                if (!actor) {
                    return next();
                }

                res.status(200).json(actor);
            })
            .catch((error) => {
                res.status(500).json({
                    mensaje: "Error al consultar el actor"
                });
            });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al procesar el ID del actor"
        });
    }
}

// Consultar actores de una película por su ID
export async function obtenerActoresPorPelicula(req, res) {
    try {
        const idPelicula = req.params.pelicula;

        if (!ObjectId.isValid(idPelicula)) {
            return res.status(400).json({
                mensaje: "ID de película no válido"
            });
        }

        return conectarDB()
            .then((db) => {
                // Comprobar que la película exista
                return db.collection(peliculaCollection).findOne({
                    _id: new ObjectId(idPelicula)
                }).then((pelicula) => {
                    if (!pelicula) {
                        res.status(404).json({
                            mensaje: "Película no encontrada"
                        });
                        return null;
                    }

                    return db.collection(actorCollection)
                        .find({ idPelicula: idPelicula })
                        .toArray();
                });
            })
            .then((actores) => {
                if (!actores) {
                    return;
                }

                res.status(200).json(actores);
            })
            .catch((error) => {
                res.status(500).json({
                    mensaje: "Error al consultar actores de la película"
                });
            });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al procesar el ID de la película"
        });
    }
}

// Exportar los nombres solicitados en la evaluación
export {
    crearActor as handleInsertActorRequest,
    obtenerActores as handleGetActoresRequest,
    obtenerActorPorId as handleGetActorByIdRequest,
    obtenerActoresPorPelicula as handleGetActoresByPeliculaIdRequest
};
