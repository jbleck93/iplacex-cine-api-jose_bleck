
import { Router } from "express";

import {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
} from "./actor.controller.js";

// Rutas para administrar los actores
const ActorRoutes = Router();

// Registrar un actor
ActorRoutes.post("/actor", handleInsertActorRequest);

// Consultar todos los actores
ActorRoutes.get("/actores", handleGetActoresRequest);

// Consultar un actor por su ID
ActorRoutes.get("/actor/:id", handleGetActorByIdRequest);

// Consultar actores asociados a una película
ActorRoutes.get("/actor/:pelicula", handleGetActoresByPeliculaIdRequest);

export default ActorRoutes;
