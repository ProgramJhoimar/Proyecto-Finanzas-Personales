import { promises } from "node:dns";
import { z } from "../Dependencies/Dependencies.ts";
import { conexion } from "./Conexion.ts";
import { error } from "node:console";

interface TipoData {
  idUsuario: number | null;
  nombreTipoCuenta: string;
  apellido: string;
}

export class TipoCuenta {
  public _objTipo: TipoData | null;
  public _idTipo: number | null;

  constructor(
    objTipo: TipoData | null = null,
    idTipo: number | null = null,
  ) {
    this._objTipo = objTipo;
    this._idTipo = idTipo;
  }

  public async SeleccionarCliente(): Promise<TipoData[]> {
    const { rows: client } = await conexion.execute("select * from cliente");
    return client as TipoData[];
  }

  public async insertarCliente(): Promise<
    { success: boolean; message: string; cliente?: Record<string, unknown> }
  > {
    try {
      //validar que _objUsuario no sea null y que los campos requeridos esten definidos
      if (!this._objTipo) {
        throw new Error("No se ha proporcionado un objeto de usuario valido");
      }

      const { nombreTipoCuenta, apellido } = this._objTipo;
      if (!nombreTipoCuenta || !apellido ) {
        throw new Error("Faltan campos requeridos para insertar el usuario");
      }

      await conexion.execute("START TRANSACTION");

      const result = await conexion.execute(
        `insert into cliente(nombre,apellido,documento,telefono,direccion)values(?,?,?,?,?)`,
        [
          nombreTipoCuenta,
          apellido,
        ],
      );

      if (
        result && typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        const [cliente] = await conexion.query(
          `select * from cliente WHERE idUsuario = LAST_INSERT_ID()`,
        );

        await conexion.execute("COMMIT");

        return {
          success: true,
          message: "cliente registrado correctamente.",
          cliente: cliente,
        };
      } else {
        throw new Error("no fue posible registrar el usuario.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: "Error interno del servidor" };
      }
    }
  }

 public async actualizarClientes(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this._objcliente || !this._objcliente.idUsuario) {
        throw new Error("Datos de usuario no válidos");
      }
  
      const { idUsuario, nombre, apellido, documento, telefono, direccion } = this._objcliente;
  
      await conexion.execute("START TRANSACTION");
  
      const result = await conexion.execute(
        `UPDATE cliente SET nombre = ?, apellido = ?, documento = ?, telefono = ?, direccion = ? WHERE idUsuario = ?`,
        [nombre, apellido, documento, telefono, direccion, idUsuario]
      );
  
      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        await conexion.execute("COMMIT");
        return { success: true, message: "cliente actualizado correctamente." };
      } else {
        throw new Error("No se encontró el cliente o no se pudo actualizar.");
      }
  
    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: "Error al actualizar el usuario." };
    }
  }

 public async eliminarCliente(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this._idCLiente) {
        throw new Error("ID de usuario no proporcionado");
      }
  
      await conexion.execute("START TRANSACTION");
  
      const result = await conexion.execute(
        "DELETE FROM cliente WHERE idUsuario = ?",
        [this._idCLiente]
      );
  
      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        await conexion.execute("COMMIT");
        return { success: true, message: "Usuario eliminado correctamente." };
      } else {
        throw new Error("No se encontró el usuario o no se pudo eliminar.");
      }
  
    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: "Error al eliminar el usuario." };
    }
  }


}
