// deno-lint-ignore-file
import { TipoFinanza } from "../Models/TipoFinanzaModel.ts";

export const getTipoFinanza = async (ctx: any) => {
    const { response } = ctx;

    try {
        const objTipoFinanza = new TipoFinanza();
        const listTipoFinanzas = await objTipoFinanza.SeleccionarTipoFinanza();
        response.status = 200;
        response.body = {
            success: true,
            data: listTipoFinanzas,
        };
    } catch (error) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "Error al procesar su solicitud",
            errors: error,
        };
    }
};

export const postTipoFinanza = async (ctx: any) => {
    const { response, request } = ctx;

    try {
        const body = await request.body.json();

        const TipoFnData = {
            idTipoFinanza: null,
            nombreTipoFinanza: body.nombreTipoFinanza,
        };

        const objTipoFinanza = new TipoFinanza(TipoFnData);
        const result = await objTipoFinanza.InsertaTipoFinanza();

        response.status = 200;
        response.body = {
            success: true,
            body: result,
        };

    } catch (error) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "Error al procesar la solicitud: " + error,
        };
    }
};

export const putTipoFinanza = async (ctx: any) => {
    const { response, request, params } = ctx;

    try {
        const id = Number(params.idTipoFinanza);
        if (isNaN(id)) {
            response.status = 400;
            response.body = { success: false, msg: "id de TipoFinanza inválido" };
            return;
        }

        const body = await request.body.json();

        const TipoFnData = {
            idTipoFinanza: id,
            nombreTipoFinanza: body.nombreTipoFinanza,
        };

        const objTipoFinanza = new TipoFinanza(TipoFnData);
        const result = await objTipoFinanza.ActualizarTipoFinanza();

        response.status = result.success ? 200 : 404;
        response.body = result;

    } catch (error) {
        response.status = 500;
        response.body = {
            success: false,
            msg: "Error al procesar la solicitud",
        };
    }
};

export const deleteTipoFinanza = async (ctx: any) => {
    const { response, params } = ctx;

    try {
        const id = Number(params.idTipoFinanza);
        if (isNaN(id)) {
            response.status = 400;
            response.body = { success: false, msg: "id de Tipo Finanza inválido" };
            return;
        }

        const objTipoFinanza = new TipoFinanza(null, id);
        const result = await objTipoFinanza.EliminarTipoFinanza();

        response.status = result.success ? 200 : 404;
        response.body = result;

    } catch (error) {
        response.status = 500;
        response.body = {
            success: false,
            msg: "Error al procesar la solicitud",
        };
    }
};
