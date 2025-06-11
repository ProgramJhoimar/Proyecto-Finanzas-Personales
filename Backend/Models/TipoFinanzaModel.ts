// deno-lint-ignore-file
import { conexion } from "./Conexion.ts";
import { z } from "../Dependencies/Dependencies.ts";

interface TipoFinazaData {
    idTipoFinanza: number | null;
    nombreTipoFinanza: string;
}

export class TipoFinanza {
    public _objTipoFinanza: TipoFinazaData | null;
    public _idTipoFinanza: number | null;

    constructor(objTipoFinanza: TipoFinazaData | null = null, idTipoFinanza: number | null = null) {
        this._objTipoFinanza = objTipoFinanza;
        this._idTipoFinanza = idTipoFinanza;
    }

    public async SeleccionarTipoFinanza(): Promise<TipoFinazaData[]> {
        const { rows: TipoFin } = await conexion.execute('SELECT * FROM tipofinanza');
        return TipoFin as TipoFinazaData[];
    }

    public async InsertaTipoFinanza(): Promise<{ success: boolean; message: string; TipoFinanza?: Record<string, unknown> }> {
        try {
            if (!this._objTipoFinanza) {
                throw new Error("No se ha proporcionado un objeto de tipo finanza válido.");
            }

            const { nombreTipoFinanza } = this._objTipoFinanza;
            if (!nombreTipoFinanza) {
                throw new Error("Faltan campos requeridos para insertar el tipo de finanza.");
            }

            await conexion.execute("START TRANSACTION");

            const result = await conexion.execute(
                `INSERT INTO tipofinanza(nombreTipoFinanza) VALUES (?)`,
                [nombreTipoFinanza]
            );

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                const [TipoFn] = await conexion.query(`SELECT * FROM tipofinanza WHERE idTipoFinanza = LAST_INSERT_ID()`);

                await conexion.execute("COMMIT");

                return { success: true, message: "Tipo de Finanza registrada correctamente.", TipoFinanza: TipoFn };
            } else {
                throw new Error("No fue posible registrar el tipo de finanza.");
            }

        } catch (error) {
            await conexion.execute("ROLLBACK");

            if (error instanceof z.ZodError) {
                return { success: false, message: error.message };
            } else {
                return { success: false, message: "Error interno del servidor: " + error };
            }
        }
    }

    public async ActualizarTipoFinanza(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this._objTipoFinanza || !this._objTipoFinanza.idTipoFinanza) {
                throw new Error("Datos de la Tipo Finanza inválidos.");
            }

            const { idTipoFinanza, nombreTipoFinanza } = this._objTipoFinanza;

            if (!nombreTipoFinanza) {
                throw new Error("Todos los campos son obligatorios para actualizar.");
            }

            const result = await conexion.execute(
                `UPDATE tipofinanza SET nombreTipoFinanza = ? WHERE idTipoFinanza = ?`,
                [nombreTipoFinanza, idTipoFinanza]
            );

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                return { success: true, message: "Tipo de Finanza actualizada correctamente." };
            } else {
                return { success: false, message: "No se encontró el registro o no se actualizó nada." };
            }

        } catch (error) {
            return { success: false, message: "Error al actualizar la Tipo Finanza." };
        }
    }

    public async EliminarTipoFinanza(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this._idTipoFinanza) {
                throw new Error("ID de Tipo Finanza inválido.");
            }

            const result = await conexion.execute(
                `DELETE FROM tipofinanza WHERE idTipoFinanza = ?`,
                [this._idTipoFinanza]
            );

            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                return { success: true, message: "Tipo de Finanza eliminada correctamente." };
            } else {
                return { success: false, message: "No se encontró el registro o no se eliminó nada." };
            }

        } catch (error) {
            return { success: false, message: "Error al eliminar: " + error };
        }
    }
}
