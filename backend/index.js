import app from "./app.js"
import "./database.js"
import { config } from "./src/config.js";

//creo una función que ejecuta el servidor
async function main() {
    //esta dirección esta en el archivo config
    app.listen(config.server.port);
    console.log("server running" + config.server.port);
}

//ejecuto la función
main();