
import { Router } from "express";

import {
    handleInsertPeliculaRequest,
    handleGetPeliculasRequest,
    handleGetPeliculaByIdRequest,
    handleUpdatePeliculaByIdRequest,
    handleDeletePeliculaByIdRequest
} from "./pelicula.controller.js";

// Rutas para administrar las películas
const peliculaRoutes = Router();

// Registrar una película
peliculaRoutes.post("/pelicula", handleInsertPeliculaRequest);

// Consultar todas las películas
peliculaRoutes.get("/peliculas", handleGetPeliculasRequest);

// Consultar una película por su ID
peliculaRoutes.get("/pelicula/:id", handleGetPeliculaByIdRequest);

// Modificar una película
peliculaRoutes.put("/pelicula/:id", handleUpdatePeliculaByIdRequest);

// Eliminar una película
peliculaRoutes.delete("/pelicula/:id", handleDeletePeliculaByIdRequest);

export default peliculaRoutes;
