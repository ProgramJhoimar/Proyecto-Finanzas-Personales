// deno-lint-ignore-file
import { Categotria } from "../Models/CategoriaModel.ts";

export const getCategoria = async(ctx:any)=>{
    const {response} = ctx;

    try {
        const objCategoria = new Categotria();
        const listCategorias = await objCategoria.SeleccionarCategoria();
        response.status = 200;
        response.body = {
            success:true, 
            data:listCategorias,
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

export const postCategoria = async (ctx:any)=>{

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

        const CategoriaData = {
            idCategoria: null,
            nombreCategoria: body.nombreCategoria,
            valorLimite: body.valorLimite,
            idUsuario: body.idUsuario
        }

        const objCategoria = new Categotria(CategoriaData)
        const result = await objCategoria.InsertarCategoria();
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

export const putCategoria = async (ctx: any) => {
    const { response, request, params } = ctx;

    try {
        const id = Number(params.idCategoria);
        if (isNaN(id)) {
            response.status = 400;
            response.body = { success: false, msg: "id de Categoria inválido" };
            return;
        }

        const body = await request.body.json();

        if (!body) {
            response.status = 400;
            response.body = { success: false, msg: "Cuerpo de la solicitud vacío" };
            return;
        }

        const CategoriaData = {
            idCategoria: id,
            nombreCategoria: body.nombreCategoria,
            valorLimite: body.valorLimite,
            idUsuario: body.idUsuario
        };

        const objCategoria = new Categotria(CategoriaData);
        const result = await objCategoria.ActualizarCategoria();

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

export const deleteCategoria = async(ctx:any)=>{
    const { response, params } = ctx;

    try {
        const id = Number(params.idCategoria);
        if (isNaN(id)) {
            response.status = 400;
            response.body = { success: false, msg: "id de Categoria inválido" };
            return;
        }

        const objCategoria = new Categotria(null, id);
        const result = await objCategoria.EliminarCategoria();

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