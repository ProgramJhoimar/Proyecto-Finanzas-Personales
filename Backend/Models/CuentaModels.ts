import { conexion } from "./Conexion.ts";
import { z } from "../Dependencies/Dependencies.ts";


interface CuentaData{
    idCuenta: number | null;
    nombreCuenta: string ;
    saldo:number;
    idTipoCuenta: number ;
    idUsuario: number;
}

export class Cuenta{
    public _objCuenta: CuentaData | null;
    public _idCuenta: number | null;

    constructor(objCuentas: CuentaData|null = null,idCuenta:number | null = null){
        this._objCuenta = objCuentas;
        this._idCuenta = idCuenta;
    }
    
    public async SeleccionaCuentas(): Promise<CuentaData[]>{
        const {rows: cuent} = await conexion.execute('select * from cuentas');
        return cuent as CuentaData[];
    }

    public async InsertarCuenta():Promise<{ success:boolean; message:string; cuenta?: Record<string, unknown>}>{
        
        try {

            //Validar que _objUsuario no sea null y que los campos requeridos esten definidos
            if (!this._objCuenta){
                throw new Error("No se ha proporcionado un objeto Cuenta válido")
            }

            const {idUsuario,idTipoCuenta,nombreCuenta,saldo} = this._objCuenta;
            if (!idUsuario || !idTipoCuenta ||!nombreCuenta || !saldo ) {
                throw new Error("Faltan campos requeridos para insertar la cuenta.");
            }

            await conexion.execute("START TRANSACTION");
        
            const result = await conexion.execute(`insert into cuentas(idUsuario,idTipoCuenta,nombreCuenta,saldo)values(?,?,?,?)`,[
                idUsuario,
                idTipoCuenta,
                nombreCuenta,
                saldo,
            ])

            if (result && typeof result.affectedRows == "number" && result.affectedRows > 0) {
                const [cuenta] = await conexion.query(`select * from cuentas where idCuenta = LAST_INSERT_ID()`,)

                await conexion.execute("COMMIT");

                return { success:true, message:"Cuenta registrada correctamente.", cuenta:cuenta };
            }else{
                throw new Error("No fue posible registrar la cuenta.")
            }
            
        } catch (error) {

            if (error instanceof z.ZodError) {
                return {success:false, message: error.message};
            }else{
            return {success: false, message:"Error interno del servidor"}
            }
        }
    }
    
    public async ActualizarCuenta(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this._objCuenta || !this._objCuenta.idCuenta) {
                throw new Error("Datos de la Categoria inválidos.");
            }
    
            const { idCuenta, idUsuario, idTipoCuenta, nombreCuenta,saldo } = this._objCuenta;
    
            if (!idUsuario || !idTipoCuenta || !nombreCuenta || !saldo) {
                throw new Error("Todos los campos son obligatorios para actualizar.");
            }
    
            const result = await conexion.execute(
                `UPDATE cuentas SET idUsuario = ?, idTipoCuenta = ?, nombreCuenta = ?, saldo = ? WHERE idCuenta = ?`,
                [idUsuario, idTipoCuenta,nombreCuenta, saldo, idCuenta]
            );
    
            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                return { success: true, message: "Cuenta actualizada correctamente." };
            } else {
                return { success: false, message: "No se encontraron datos o no se actualizó nada." };
            }
    
        // deno-lint-ignore no-unused-vars
        } catch (error) {
            return { success: false, message: "Error al actualizar la Cuenta." };
        }
    }
    
    public async EliminarCuenta(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this._idCuenta) {
                throw new Error("ID de  inválido.");
            }
    
            const result = await conexion.execute(
                `DELETE FROM cuentas WHERE idCuenta = ?`,
                [this._idCuenta]
            );
    
            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                return { success: true, message: "Cuenta eliminada correctamente." };
            } else {
                return { success: false, message: "No se encontró  o no se eliminó nada." };
            }
    
        } catch (error) {
            return { success: false, message: "Error al eliminar." + error};
        }
    }
    

}