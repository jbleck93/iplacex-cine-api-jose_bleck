import "dotenv/config";
import express from "express";
import cors from "cors";
import { conectarDB } from "./src/common/db.js";
import peliculaRoutes from "./src/pelicula/routes.js";
import actorRoutes from "./src/actor/routes.js";

// Configuración del servidor
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de películas
app.use("/api", peliculaRoutes);

// Rutas de actores
app.use("/api", actorRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.send("Bienvenido al cine Iplacex");
});

// Conexión a MongoDB e inicio del servidor
try {
    await conectarDB();

    app.listen(PORT, "0.0.0.0", () => {
        console.log("Servidor funcionando en el puerto " + PORT);
    });

} catch (error) {
    console.log("Error al conectar con MongoDB:", error.message);
}