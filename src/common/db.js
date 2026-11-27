import { MongoClient } from "mongodb";
import "dotenv/config";

// Obtener la conexión desde la variable de entorno
const uri = process.env.MONGODB_URI;

// Cliente de MongoDB
const client = new MongoClient(uri);

// Conexión a la base de datos
export async function conectarDB() {
    await client.connect();
    console.log("Conectado a MongoDB");

    return client.db("cine-db");
}