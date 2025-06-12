import {
  getUsuario,
  postUsuario,
  putUsuario,
  deleteUsuario,
} from "../Controllers/UserController.ts";
import { Router } from "../Dependencies/Dependencies.ts";

const UserRouter = new Router();
UserRouter.get("/usuario", getUsuario);
UserRouter.post("/usuario", postUsuario);
UserRouter.put("/usuario", putUsuario);
UserRouter.delete("/usuario", deleteUsuario);
export { UserRouter };
