import { Router } from "../Dependencies/Dependencies.ts";
import { deleteCuenta, getCuenta, postCuenta,putCuenta } from "../Controllers/CuentaController.ts";

const routerCuenta = new Router();

routerCuenta.get("/cuentas", getCuenta);
routerCuenta.post("/cuentas", postCuenta);
routerCuenta.put("/cuentas/:idCuenta", putCuenta);
routerCuenta.delete("/cuentas/:idCuenta", deleteCuenta);


export {routerCuenta};