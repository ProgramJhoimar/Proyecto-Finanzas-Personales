// Backend/Models/UsuarioModel.ts
import { conexion } from "./Conexion.ts";

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
    _idUsuario: number | null = null,
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
      throw new Error("No se ha proporcionado un objeto de usuario en el modelo");
    }

    const { perfil, nombre, apellido, email, telefono, password } = this._objUsuario;

    if (!perfil || !nombre || !apellido || !email || !telefono || !password) {
      throw new Error("Faltan datos obligatorios para registrar el usuario");
    }

    await conexion.execute("START TRANSACTION");

    const result: any = await conexion.execute(
      "INSERT INTO usuarios (perfil, nombre, apellido, email, telefono, password) VALUES (?, ?, ?, ?, ?, ?)",
      [perfil, nombre, apellido, email, telefono, password]
    );

    if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
      const [usuario] = await conexion.query(
        "SELECT * FROM usuarios WHERE idUsuario = LAST_INSERT_ID()"
      );

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

}
