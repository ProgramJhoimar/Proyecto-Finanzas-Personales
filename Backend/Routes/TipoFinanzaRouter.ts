import { Router } from "../Dependencies/Dependencies.ts";
import { deleteTipoFinanza, getTipoFinanza, postTipoFinanza, putTipoFinanza } from "../Controllers/TipoFinanza.ts";

const routeTipoFinanza = new Router();

routeTipoFinanza.get("/TipoFinanza", getTipoFinanza);
routeTipoFinanza.post("/TipoFinanza", postTipoFinanza);
routeTipoFinanza.put("/TipoFinanza/:idTipoFinanza", putTipoFinanza);
routeTipoFinanza.delete("/TipoFinanza/:idTipoFinanza", deleteTipoFinanza);
export {routeTipoFinanza};