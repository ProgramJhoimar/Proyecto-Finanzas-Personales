import { Router } from "../Dependencies/Dependencies.ts";

import { getTipoCuenta, posTipoCuenta, putTipoCuenta, deleteTipo } from "../Controllers/TipoCuentaController.ts";

const RouterTipo = new Router();

RouterTipo.get("/TipoCuentaget", getTipoCuenta);
RouterTipo.post("/TipoCuentapost", posTipoCuenta);
RouterTipo.put("/TipoCuentaput/:id", putTipoCuenta);
RouterTipo.delete("/TipoCuentadelete/:id", deleteTipo);

export {RouterTipo};