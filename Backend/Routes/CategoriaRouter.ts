import { Router } from "../Dependencies/Dependencies.ts";
import { deleteCategoria, getCategoria,postCategoria, putCategoria} from"../Controllers/CategoriaController.ts";

const routerCategoria = new Router();

routerCategoria.get("/categorias", getCategoria);
routerCategoria.post("/categorias", postCategoria);
routerCategoria.put("/categorias/:idCategoria", putCategoria);
routerCategoria.delete("/categorias/:idCategoria", deleteCategoria);


export {routerCategoria};