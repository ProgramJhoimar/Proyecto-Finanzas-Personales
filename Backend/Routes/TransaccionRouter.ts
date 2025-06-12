import { Router } from "../Dependencies/Dependencies.ts";

import { getTransaccion, posTransaccion, putTransaccion, deleteTransaccion } from "../Controllers/TransaccionController.ts";

const RouterTransaccion = new Router();

RouterTransaccion.get("/Transaccionget", getTransaccion);
RouterTransaccion.post("/Transaccionpost", posTransaccion);
RouterTransaccion.put("/Transaccionput/:id", putTransaccion);
RouterTransaccion.delete("/Transacciondelete/:id", deleteTransaccion);

export {RouterTransaccion};