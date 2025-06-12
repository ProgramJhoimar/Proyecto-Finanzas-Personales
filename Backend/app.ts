import { Application , oakCors } from "./Dependencies/Dependencies.ts";
import { routerCategoria } from "./Routes/CategoriaRouter.ts";
import { routerCuenta } from "./Routes/CuetaRouter.ts";
import { RouterTipo } from "./Routes/TipoCuentaRouter.ts";
import { routeTipoFinanza } from "./Routes/TipoFinanzaRouter.ts";
import { routeTipoFinanza } from "./Routes/TipoFinanzaRouter.ts";
import { RouterTipo } from "./Routes/TipoCuentaRouter.ts";



const app = new Application();

app.use(oakCors());

const routers = [routerCategoria,routerCuenta,routeTipoFinanza,RouterTipo];


routers.forEach((router) =>{
    app.use(router.routes());
    app.use(router.allowedMethods());
});

console.log("Servidor corriendo por el puerto 8000");

app.listen({ port:8000 });