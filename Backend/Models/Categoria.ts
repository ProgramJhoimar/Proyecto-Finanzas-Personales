import { conexion } from "./Conexion.ts";
import { z } from "../Dependencies/Dependencias.ts";
import { Decipher } from "node:crypto";


interface CategoriaData{
    idCategoria: number | null;
    nombreCategoria: string ;
    valorLimite: number ;
    idUsuario: number;
}

export class Categotria{
    public _objCategoria: CategoriaData | null;
    public _idCategoria: number | null;

    constructor(objCategorias: CategoriaData|null = null,idCategoria:number | null = null){
        this._objCategoria = objCategorias;
        this._idCategoria = idCategoria;
    }
    
    public async SeleccionarCategoria(): Promise<CategoriaData[]>{
        const {rows: catego} = await conexion.execute('select * from cagoria');
        return catego as CategoriaData[];
    }

    public async InsertarCategoria():Promise<{ success:boolean; message:string; categoria?: Record<string, unknown>}>{
        
        try {

            //Validar que _objUsuario no sea null y que los campos requeridos esten definidos
            if (!this._objCategoria){
                throw new Error("No se ha proporcionado un objetode usuario válido")
            }

            const {nombreCategoria,valorLimite,idUsuario} = this._objCategoria;
            if (!nombreCategoria || !valorLimite || !idUsuario) {
                throw new Error("Faltan campos requeridos para insertar el usuario.");
            }

            await conexion.execute("START TRANSACTION");
        
            const result = await conexion.execute(`insert into categoria(nombreCategoria,valorLimite,idUsuario)values(?,?,?)`,[
                nombreCategoria,
                valorLimite,
                idUsuario,
            ])

            if (result && typeof result.affectedRows == "number" && result.affectedRows > 0) {
                const [cagoria] = await conexion.query(`select * from categoria where idCategoria = LAST_INSERT_ID()`,)

                await conexion.execute("COMMIT");

                return { success:true, message:"Categoria registrada correctamente.", categoria:cagoria };
            }else{
                throw new Error("No fue posible registrar la categoria.")
            }
            
        } catch (error) {

            if (error instanceof z.ZodError) {
                return {success:false, message: error.message};
            }else{
            return {success: false, message:"Error interno del servidor"}
            }
        }
    }
    
    public async ActualizarCategoria(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this._objCategoria || !this._objCategoria.idCategoria) {
                throw new Error("Datos de la Categoria inválidos.");
            }
    
            const { idCategoria, nombreCategoria, valorLimite, idUsuario } = this._objCategoria;
    
            if (!nombreCategoria || !valorLimite || !idUsuario) {
                throw new Error("Todos los campos son obligatorios para actualizar.");
            }
    
            const result = await conexion.execute(
                `UPDATE categoria SET nombreCategoria = ?, valorLimite = ?, idUsuario = ? WHERE idCategoria = ?`,
                [nombreCategoria, valorLimite,idUsuario, idCategoria]
            );
    
            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                return { success: true, message: "Categoria actualizada correctamente." };
            } else {
                return { success: false, message: "No se encontraron datos o no se actualizó nada." };
            }
    
        // deno-lint-ignore no-unused-vars
        } catch (error) {
            return { success: false, message: "Error al actualizar la categoria." };
        }
    }
    
    public async EliminarUsuario(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this._idCategoria) {
                throw new Error("ID de  inválido.");
            }
    
            const result = await conexion.execute(
                `DELETE FROM categoria WHERE idCategoria = ?`,
                [this._idCategoria]
            );
    
            if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
                return { success: true, message: "Categoria eliminada correctamente." };
            } else {
                return { success: false, message: "No se encontró  o no se eliminó nada." };
            }
    
        // deno-lint-ignore no-unused-vars
        } catch (error) {
            return { success: false, message: "Error al eliminar." };
        }
    }
    

}