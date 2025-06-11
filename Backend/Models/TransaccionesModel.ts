import { promises } from "node:dns";
import { z } from "../Dependencies/Dependencies.ts";
import { conexion } from "./Conexion.ts";
import { error } from "node:console";


interface TransaccionesData {
  idTipoCuenta: number | null;
  	valorMonto: string;
  numeroCuenta: string ;
}

export class TipoCuenta {
  public _objTipo: TransaccionesData | null;
  public _idTipo: number | null;

  constructor(
    objTipo: TransaccionesData | null = null,
    idTipo: number | null = null,
  ) {
    this._objTipo = objTipo;
    this._idTipo = idTipo;
  }

  public async SeleccionarTipo(): Promise<TransaccionesData[]> {
    const { rows: tipocuen } = await conexion.execute("select * from tipocuenta");
    return tipocuen as TransaccionesData[];
  }

  public async insertarTipo(): Promise<
    { success: boolean; message: string; TipoCuenta?: Record<string, unknown> }
  > {
    try {
      //validar que _objUsuario no sea null y que los campos requeridos esten definidos
      if (!this._objTipo) {
        throw new Error("No se ha proporcionado un objeto de usuario valido");
      }

      const { nombreTipoCuenta, numeroCuenta } = this._objTipo;
      if (!nombreTipoCuenta || !numeroCuenta ) {
        throw new Error("Faltan campos requeridos para insertar el Tipo de Cuenta");
      }

      await conexion.execute("START TRANSACTION");

      const result = await conexion.execute(
        `insert into tipocuenta(nombreTipoCuenta,numeroCuenta)values(?,?)`,
        [
          nombreTipoCuenta,
          numeroCuenta,
        ],
      );

      if (
        result && typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        const [tipo] = await conexion.query(
          `select * from tipocuenta WHERE idTipoCuenta  = LAST_INSERT_ID()`,
        );

        await conexion.execute("COMMIT");

        return {
          success: true,
          message: "Tipo de Cuenta registrado correctamente.",
          TipoCuenta: tipo,
        };
      } else {
        throw new Error("no fue posible registrar el Tipo de Cuenta.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: "Error interno del servidor" };
      }
    }
  }

 public async actualizarTipo(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this._objTipo || !this._objTipo.idTipoCuenta) {
        throw new Error("Datos de usuario no válidos");
      }
  
      const { idTipoCuenta, nombreTipoCuenta, numeroCuenta} = this._objTipo;
  
      await conexion.execute("START TRANSACTION");
  
      const result = await conexion.execute(
        `UPDATE tipocuenta SET nombreTipoCuenta = ?, numeroCuenta = ? WHERE idTipoCuenta = ?`,
        [nombreTipoCuenta, numeroCuenta, idTipoCuenta]
      );
  
      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        await conexion.execute("COMMIT");
        return { success: true, message: "Tipo de Cuenta actualizado correctamente." };
      } else {
        throw new Error("No se encontró el Tipo de Cuenta o no se pudo actualizar.");
      }
  
    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: "Error al actualizar el Tipo de Cuenta." };
    }
  }

 public async eliminarTipo(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this._idTipo) {
        throw new Error("ID del Tipo de Cuenta no proporcionado");
      }
  
      await conexion.execute("START TRANSACTION");
  
      const result = await conexion.execute(
        "DELETE FROM tipocuenta WHERE idTipoCuenta = ?",
        [this._idTipo]
      );
  
      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        await conexion.execute("COMMIT");
        return { success: true, message: "Tipo de Cuenta eliminado correctamente." };
      } else {
        throw new Error("No se encontró el Tipo e Cuenta o no se pudo eliminar.");
      }
  
    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: "Error al eliminar el Tipo de Cuenta." };
    }
  }


}
