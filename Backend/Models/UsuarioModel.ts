// Backend/Models/UsuarioModel.ts
import { conexion } from "./Conexion.ts";
import { ensureDir } from "https://deno.land/std@0.203.0/fs/ensure_dir.ts";
import * as path from "https://deno.land/std@0.203.0/path/mod.ts";

interface UsuarioData {
  idUsuario: number | null;
  perfil: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  password: string;
}

export class UsuarioModel {
  public _objUsuario: UsuarioData | null;
  public _idUsuario: number | null;

  constructor(
    _objUsuario: UsuarioData | null = null,
    _idUsuario: number | null = null
  ) {
    this._objUsuario = _objUsuario;
    this._idUsuario = _idUsuario;
  }

  // ...existing code...
  public async InsertarUsuario(): Promise<{
    success: boolean;
    message: string;
    usuario?: Record<string, unknown>;
  }> {
    try {
      if (!this._objUsuario) {
        throw new Error(
          "No se ha proporcionado un objeto de usuario en el modelo"
        );
      }

      const { perfil, nombre, apellido, email, telefono, password } =
        this._objUsuario;

      if (!perfil || !nombre || !apellido || !email || !telefono || !password) {
        throw new Error("Faltan datos obligatorios para registrar el usuario");
      }

      await conexion.execute("START TRANSACTION");

      const result: any = await conexion.execute(
        "CALL spRegistrarUsuario(?, ?, ?, ?, ?, ?)",
        [perfil, nombre, apellido, telefono, email, password]
      );

      if (
        result &&
        typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        const [usuario] = await conexion.query(
          "SELECT * FROM usuarios WHERE idUsuario = LAST_INSERT_ID()"
        );

        await subirFoto({ perfil });

        await conexion.execute("COMMIT");

        return {
          success: true,
          message: "Usuario insertado correctamente",
          usuario: usuario,
        };
      } else {
        await conexion.execute("ROLLBACK");
        throw new Error("No fue posible registrar el usuario");
      }
    } catch (error) {
      await conexion.execute("ROLLBACK");
      if (error instanceof Error) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: "Error del servidor" };
      }
    }
  }
  // ...existing code...
  public async ObtenerUsuarioPorId(): Promise<{
    success: boolean;
    message: string;
    usuario?: Record<string, unknown>;
  }> {
    try {
      if (this._idUsuario === null) {
        throw new Error("ID de usuario no proporcionado");
      }

      const [usuario] = await conexion.query(
        "SELECT * FROM usuarios WHERE idUsuario = ?",
        [this._idUsuario]
      );

      if (usuario) {
        return { success: true, message: "Usuario encontrado", usuario };
      } else {
        return { success: false, message: "Usuario no encontrado" };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: "Error del servidor" };
      }
    }
  }

  public async ActualizarUsuario(): Promise<{
    success: boolean;
    message: string;
    usuario?: Record<string, unknown>;
  }> {
    try {
      if (!this._objUsuario) {
        throw new Error(
          "No se ha proporcionado un objeto de usuario en el modelo"
        );
      }
      const { perfil, nombre, apellido, telefono, email, password } =
        this._objUsuario;
      if (!perfil || !nombre || !apellido || !telefono || !email || !password) {
        throw new Error("Faltan datos obligatorios para actualizar el usuario");
      }

      if (this._idUsuario === null) {
        throw new Error("ID de usuario no proporcionado");
      }

      const idUsuario = this._idUsuario;

      const usuarioActual = idUsuario;
      console.log("Usuario Actual:", idUsuario);
      if (!usuarioActual) {
        throw new Error("Usuario no encontrado");
      }

      const perfilActual = perfil;

      if (
        perfil &&
        perfil !== "null" &&
        !perfil.startsWith("data:") &&
        perfilActual
      ) {
        const rutaActual = path.join(Deno.cwd(), "./Uploads", perfilActual);
        try {
          await Deno.remove(rutaActual);
        } catch (error) {
          console.error(
            `Error al eliminar la foto de perfil actual en Modelo: ${error}`
          );
        }
      }

      await conexion.execute("START TRANSACTION");
      const result = await conexion.execute(
        "CALL spActualizarUsuario(?, ?, ?, ?, ?, ?, ?)",
        [idUsuario, perfil, nombre, apellido, telefono, email, password]
      );

      if (
        result &&
        typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        return {
          success: true,
          message: "Usuario actualizado correctamente",
          usuario: result,
        };
      } else {
        return {
          success: false,
          message: "No fue posible actualizar el usuario en modelo",
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: `Error del servidor" + ${error}` };
      }
    }
  }

  public async EliminarUsuario(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const idUsuario = this._idUsuario;
      if (this._idUsuario === null) {
        throw new Error("ID de usuario no proporcionado");
      }

      await conexion.execute("START TRANSACTION");

      const result: any = await conexion.execute("CALL spEliminarUsuario(?)", [
        idUsuario,
      ]);

      if (
        result &&
        typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        await conexion.execute("COMMIT");
        return { success: true, message: "Usuario eliminado correctamente" };
      } else {
        await conexion.execute("ROLLBACK");
        return {
          success: false,
          message: "No fue posible eliminar el usuario en Modelo",
        };
      }
    } catch (error) {
      await conexion.execute("ROLLBACK");
      if (error instanceof Error) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: "Error del servidor de Modelo" };
      }
    }
  }
}

async function subirFoto(body: { perfil: string }) {
  let perfilPath = null;
  if (body.perfil) {
    const matches = body.perfil.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (matches) {
      const extension = matches[1].split("/")[1];
      const data = matches[2];
      const buffer = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
      const uploadDir = "./Uploads";
      await ensureDir(uploadDir);
      const fileName = `perfil-${Date.now()}.${extension}`;
      perfilPath = `${uploadDir}/${fileName}`;
      await Deno.writeFile(perfilPath, buffer);
      return perfilPath;
    }
  }
}
