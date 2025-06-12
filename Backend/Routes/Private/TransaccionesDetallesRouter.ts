// Backend/Routes/sp_TransaccionesDetalladasPorUsuario.ts

import { Router, RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { obtenerTransaccionesPorUsuario } from "../../Controllers/Private/sp_TransaccionesDetalladasPorUsuarioController.ts";

const routerDetallesT = new Router();

routerDetallesT.get(
  "/api/transacciones/:id",
  async (ctx: RouterContext<"/api/transacciones/:id">) => {
    await obtenerTransaccionesPorUsuario(ctx);
  }
);

export {routerDetallesT};
