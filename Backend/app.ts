import { Application , oakCors } from "./Dependencies/Dependencies.ts";
import { send } from "https://deno.land/x/oak@v17.1.3/send.ts";
import { routerCategoria } from "./Routes/CategoriaRouter.ts";
import { routerCuenta } from "./Routes/CuetaRouter.ts";
import { routeTipoFinanza } from "./Routes/TipoFinanzaRouter.ts";
import { RouterTipo } from "./Routes/TipoCuentaRouter.ts";
import { UserRouter } from "./Routes/UserRoute.ts";



const app = new Application();

app.use(oakCors());

const routers = [routerCategoria, routerCuenta, routeTipoFinanza, UserRouter, RouterTipo];
app.use(async (ctx, next) => {
  if (ctx.request.url.pathname.startsWith("/Uploads")) {
    await send(ctx, ctx.request.url.pathname, {
      root: `${Deno.cwd()}`,
    });
  } else {
    await next();
  }
});


routers.forEach((router) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
});

console.log("Servidor corriendo por el puerto 8000");

app.listen({ port: 8000 });
