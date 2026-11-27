
import { ObjectId } from "mongodb";
import { conectarDB } from "../common/db.js";
import { Pelicula } from "./pelicula.js";

// Nombre de la colección
const peliculaCollection = "peliculas";

// Revisar los datos de la película
function validarPelicula(datos) {
    if (!datos || typeof datos.nombre !== "string" ||
        datos.nombre.trim() === "") {
        return "El nombre de la película es obligatorio";
    }

    if (!Array.isArray(datos.generos) ||
        datos.generos.length === 0 ||
        !datos.generos.every(g => typeof g === "string" && g.trim() !== "")) {
        return "Debe ingresar al menos un género válido";
    }

    if (!Number.isInteger(datos.anioEstreno)) {
        return "El año de estreno debe ser un número entero";
    }

    return null;
}

// Registrar una película
export async function crearPelicula(req, res) {
    const datos = req.body;
    const error = validarPelicula(datos);

    if (error) {
        return res.status(400).json({ mensaje: error });
    }

    const pelicula = {};

    for (const campo of Object.keys(Pelicula)) {
        if (campo !== "_id") {
            pelicula[campo] = datos[campo];
        }
    }

    return conectarDB()
        .then((db) => {
            return db.collection(peliculaCollection).insertOne(pelicula);
        })
        .then((resultado) => {
            res.status(201).json({
                mensaje: "Película registrada correctamente",
                id: resultado.insertedId
            });
        })
        .catch((error) => {
            res.status(500).json({
                mensaje: "Error al registrar la película"
            });
        });
}

// Consultar todas las películas
export async function obtenerPeliculas(req, res) {
    return conectarDB()
        .then((db) => {
            return db.collection(peliculaCollection).find().toArray();
        })
        .then((peliculas) => {
            res.status(200).json(peliculas);
        })
        .catch((error) => {
            res.status(500).json({
                mensaje: "Error al consultar las películas"
            });
        });
}

// Consultar una película por su ID
export async function obtenerPeliculaPorId(req, res) {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje: "ID de película no válido"
            });
        }

        const idObject = new ObjectId(id);

        return conectarDB()
            .then((db) => {
                return db.collection(peliculaCollection).findOne({
                    _id: idObject
                });
            })
            .then((pelicula) => {
                if (!pelicula) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada"
                    });
                }

                res.status(200).json(pelicula);
            })
            .catch((error) => {
                res.status(500).json({
                    mensaje: "Error al consultar la película"
                });
            });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al procesar el ID de la película"
        });
    }
}

// Modificar una película
export async function actualizarPelicula(req, res) {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje: "ID de película no válido"
            });
        }

        const idObject = new ObjectId(id);
        const datos = req.body;

        const camposPermitidos = Object.keys(Pelicula).filter(
            campo => campo !== "_id"
        );

        if (!datos || Object.keys(datos).length === 0 ||
            Object.keys(datos).some(campo =>
                !camposPermitidos.includes(campo))) {
            return res.status(400).json({
                mensaje: "Debe ingresar campos válidos para modificar"
            });
        }

        if (datos.nombre !== undefined &&
            (typeof datos.nombre !== "string" ||
             datos.nombre.trim() === "")) {
            return res.status(400).json({
                mensaje: "El nombre de la película no es válido"
            });
        }

        if (datos.generos !== undefined &&
            (!Array.isArray(datos.generos) ||
             datos.generos.length === 0 ||
             !datos.generos.every(g =>
                 typeof g === "string" && g.trim() !== ""))) {
            return res.status(400).json({
                mensaje: "Los géneros no son válidos"
            });
        }

        if (datos.anioEstreno !== undefined &&
            !Number.isInteger(datos.anioEstreno)) {
            return res.status(400).json({
                mensaje: "El año de estreno debe ser un número entero"
            });
        }

        return conectarDB()
            .then((db) => {
                return db.collection(peliculaCollection).updateOne(
                    { _id: idObject },
                    { $set: datos }
                );
            })
            .then((resultado) => {
                if (resultado.matchedCount === 0) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada"
                    });
                }

                res.status(200).json({
                    mensaje: "Película actualizada correctamente"
                });
            })
            .catch((error) => {
                res.status(500).json({
                    mensaje: "Error al actualizar la película"
                });
            });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al procesar el ID de la película"
        });
    }
}

// Eliminar una película
export async function eliminarPelicula(req, res) {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje: "ID de película no válido"
            });
        }

        const idObject = new ObjectId(id);

        return conectarDB()
            .then((db) => {
                return db.collection(peliculaCollection).deleteOne({
                    _id: idObject
                });
            })
            .then((resultado) => {
                if (resultado.deletedCount === 0) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada"
                    });
                }

                res.status(200).json({
                    mensaje: "Película eliminada correctamente"
                });
            })
            .catch((error) => {
                res.status(500).json({
                    mensaje: "Error al eliminar la película"
                });
            });

    } catch (error) {
        return res.status(500).json({
            mensaje: "Error al procesar el ID de la película"
        });
    }
}

// Nombres solicitados en la evaluación
export {
    crearPelicula as handleInsertPeliculaRequest,
    obtenerPeliculas as handleGetPeliculasRequest,
    obtenerPeliculaPorId as handleGetPeliculaByIdRequest,
    actualizarPelicula as handleUpdatePeliculaByIdRequest,
    eliminarPelicula as handleDeletePeliculaByIdRequest
};
