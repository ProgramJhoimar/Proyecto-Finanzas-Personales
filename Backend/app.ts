import { Application , oakCors } from "./Dependencies/Dependencies.ts";
import { routerCategoria } from "./Routes/CategoriaRouter.ts";
import { routerCuenta } from "./Routes/CuetaRouter.ts";



const app = new Application();

app.use(oakCors());

const routers = [routerCategoria,routerCuenta];


routers.forEach((router) =>{
    app.use(router.routes());
    app.use(router.allowedMethods());
});

console.log("Servidor corriendo por el puerto 8000");

app.listen({ port:8000 })