import { promises } from "node:dns";
import { z } from "../Dependencies/Dependencies.ts";
import { conexion } from "./Conexion.ts";
import { error } from "node:console";


interface TransaccionesData {
  idTransaccion: number | null;
  	valorMonto: number;
    fecha: Date ;
    descripcion: string;
    idTipoFinanza: number;
    idCategoria: number;
    idCuenta: number;
}

export class Transaccion {
  public _objTransaccion: TransaccionesData | null;
  public _idTransaccion: number | null;

  constructor(
    objTransaccion: TransaccionesData | null = null,
    idTransaccion: number | null = null,
  ) {
    this._objTransaccion = objTransaccion;
    this._idTransaccion = idTransaccion;
  }

  public async SeleccionarTransaccion(): Promise<TransaccionesData[]> {
    const { rows: transaccion } = await conexion.execute("select * from transacciones");
    return transaccion as TransaccionesData[];
  }

  public async insertarTransacion(): Promise<
    { success: boolean; message: string; Transaccion?: Record<string, unknown> }
  > {
    try {
      //validar que _objUsuario no sea null y que los campos requeridos esten definidos
      if (!this._objTransaccion) {
        throw new Error("No se ha proporcionado un objeto de usuario valido");
      }

      const { descripcion, valorMonto ,fecha, idCategoria, idCuenta ,idTipoFinanza } = this._objTransaccion;
      if (!descripcion || !valorMonto || !fecha || !idCategoria || !idCuenta || !idTipoFinanza ) {
        throw new Error("Faltan campos requeridos para insertar la Transaccion");
      }

      await conexion.execute("START TRANSACTION");

      const result = await conexion.execute(
        `insert into transacciones(valorMonto,fecha,descripcion,idTipoFinanza,idCategoria,idCuenta)values(?,?,?,?,?,?)`,
        [
          valorMonto,
          fecha,
          descripcion,
          idTipoFinanza,
          idCategoria,
          idCuenta,
        ],
      );

      if (
        result && typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        const [transac] = await conexion.query(
          `select * from transacciones WHERE idTransaccion  = LAST_INSERT_ID()`,
        );

        await conexion.execute("COMMIT");

        return {
          success: true,
          message: "Transaccion registrado correctamente.",
          Transaccion: transac,
        };
      } else {
        throw new Error("no fue posible registrar la Transaccion.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: "Error interno del servidor" };
      }
    }
  }

 public async actualizarTransaccion(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this._objTransaccion || !this._objTransaccion.idTransaccion) {
        throw new Error("Datos de la transaccion no válidos");
      }
  
      const { idTransaccion, valorMonto, fecha, descripcion, idTipoFinanza, idCategoria, idCuenta } = this._objTransaccion;
  
      await conexion.execute("START TRANSACTION");
  
      const result = await conexion.execute(
        `UPDATE transacciones SET valorMonto = ?, fecha = ?, descripcion = ?, idTipoFinanza = ?, idCategoria = ?, idCuenta = ? WHERE idTransaccion = ?`,
        [valorMonto, fecha, descripcion, idTipoFinanza, idCategoria, idCuenta, idTransaccion]
      );
  
      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        await conexion.execute("COMMIT");
        return { success: true, message: "Transaccion actualizado correctamente." };
      } else {
        throw new Error("No se encontró la Transaccion o no se pudo actualizar.");
      }
  
    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: "Error al actualizar la Transaccion." };
    }
  }

 public async eliminarTransaccion(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this._idTransaccion) {
        throw new Error("ID de la Transaccion no proporcionado");
      }
  
      await conexion.execute("START TRANSACTION");
  
      const result = await conexion.execute(
        "DELETE FROM transacciones WHERE idTransaccion = ?",
        [this._idTransaccion]
      );
  
      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        await conexion.execute("COMMIT");
        return { success: true, message: "Transaccion  eliminada correctamente." };
      } else {
        throw new Error("No se encontró la Transaccion o no se pudo eliminar.");
      }
  
    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: "Error al eliminar la Transaccion." };
    }
  }


}
