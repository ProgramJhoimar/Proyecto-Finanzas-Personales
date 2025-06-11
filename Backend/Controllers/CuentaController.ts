// deno-lint-ignore-file
import { Categotria } from "../Models/CategoriaModel.ts";
import { Cuenta } from "../Models/CuentaModels.ts";

export const getCuenta = async(ctx:any)=>{
    const {response} = ctx;

    try {
        const objCuenta = new Cuenta();
        const listaCuentas = await objCuenta.SeleccionaCuentas();
        response.status = 200;
        response.body = {
            success:true, 
            data:listaCuentas,
        }

    } catch(error){
        response.status = 400;
        response.body = {
            success:false,
            msg: "Error al procesar su solicitud",
            errors: error
        }
    }
}

export const postCuenta = async (ctx:any)=>{

    const { response, request } = ctx;

    try {
        const contentlenght = request.headers.get("Content-Lenght");

        //Verificar si la solicitud contiene cuerpo
        if (contentlenght === "0") {
            response.status = 400;
            response.body = {success:false,msg:"Cuerpo de la solicitud esta vacío"}
            return;
        }

        const body = await request.body.json();

        const CuentaData = {
            idCuenta: null,
            idUsuario: body.idUsuario,
            idTipoCuenta: body.idTipoCuenta,
            nombreCuenta: body.nombreCuenta,
        }

        const objCuenta = new Cuenta(CuentaData)
        const result = await objCuenta.InsertarCuenta();
        response.status = 200;
        response.body = {
            success: true,
            body: result,
        };

    } catch (error) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "Error al procesar la solicitud"
        }

    }

}

export const putCuenta = async (ctx: any) => {
    const { response, request, params } = ctx;

    try {
        const id = Number(params.idCuenta);
        if (isNaN(id)) {
            response.status = 400;
            response.body = { success: false, msg: "id de Cuenta inválido" };
            return;
        }

        const body = await request.body.json();

        if (!body) {
            response.status = 400;
            response.body = { success: false, msg: "Cuerpo de la solicitud vacío" };
            return;
        }

        const CuentaData = {
            idCuenta: id,
            idUsuario: body.idUsuario,
            idTipoCuenta: body.idTipoCuenta,
            nombreCuenta: body.nombreCuenta,
        };

        const objCuenta = new Cuenta(CuentaData);
        const result = await objCuenta.ActualizarCuenta();

        response.status = result.success ? 200 : 404;
        response.body = result;

    } catch (error) {
        response.status = 500;
        response.body = {
            success: false,
            msg: "Error al procesar la solicitud"
        };
    }
}

export const deleteCuenta = async(ctx:any)=>{
    const { response, params } = ctx;

    try {
        const id = Number(params.idCuenta);
        if (isNaN(id)) {
            response.status = 400;
            response.body = { success: false, msg: "id de Cuenta inválido" };
            return;
        }

        const objCuenta = new Cuenta(null, id);
        const result = await objCuenta.EliminarCuenta();

        response.status = result.success ? 200 : 404;
        response.body = result;

    } catch (error) {
        response.status = 500;
        response.body = {
            success: false,
            msg: "Error al procesar la solicitud"
        };
    }


}