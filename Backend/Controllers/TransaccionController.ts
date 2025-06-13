// deno-lint-ignore-file
import { Body } from "https://deno.land/x/oak@v17.1.3/body.ts";
import { Transaccion } from '../Models/TransaccionesModel.ts';
export const getTransaccion = async (ctx: any) => {
  const { response } = ctx;

  try {
    const objTransanciones = new Transaccion();
    const transaciion = await objTransanciones.SeleccionarTransaccion();
    response.status = 200;
    response.body = {
      success: true,
      data: transaciion,
    };
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "Error al procesar la solicitud",
      errors: error,
    };
  }
};

export const posTransaccion = async (ctx: any) => {
  const { response, request } = ctx;

  try {
    const contentLength = request.headers.get("Content-Length");

    //verifica si la ssolicitud contiene cuerpo
    if (contentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Cuerpo de la solicitud esta vacio",
      };
      return;
    }

    const body = await request.body.json();

    const TransaccionData = {
      idTransaccion: null,
      valorMonto: body.valorMonto,
      fecha: body.fecha,
      descripcion: body.descripcion,
      idTipoFinanza: body.idTipoFinanza,
      idCategoria: body.idCategoria,
      idCuenta: body.idCuenta,
    };

    const objTransaccion = new Transaccion(TransaccionData);
    const result = await objTransaccion.insertarTransacion();
    response.status = 200;
    response.body = {
      success: true,
      body: result,
    };
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "Error al procesar la solicitud",
    };
  }
};

export const putTransaccion = async (ctx: any) => {
  const { request, response, params } = ctx;

  try {
    const id = params.id;
    if (!id) {
      response.status = 400;
      response.body = { success: false, msg: "ID de transacción no proporcionado en la URL." };
      return;
    }

    const contentLength = request.headers.get("Content-Length");
    if (!contentLength || contentLength === "0") {
      response.status = 400;
      response.body = { success: false, msg: "El cuerpo de la solicitud está vacío." };
      return;
    }

    const body = await request.body({ type: "json" }).value;

    const transaccionData = {
      idTransaccion: parseInt(id), // viene de la URL
      valorMonto: body.valorMonto,
      fecha: body.fecha,
      descripcion: body.descripcion,
      idTipoFinanza: body.idTipoFinanza,
      idCategoria: body.idCategoria,
      idCuenta: body.idCuenta,
    };

    const objTransaccion = new Transaccion(transaccionData);
    const result = await objTransaccion.actualizarTransaccion();

    response.status = result.success ? 200 : 400;
    response.body = {
      success: result.success,
      message: result.message,
    };

  } catch (error) {
    console.error("Error en putTransaccion:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: `Error interno al actualizar la transacción: ${error.message}`,
    };
  }
};
  

export const deleteTransaccion = async (ctx: any) => {
  try {
    const idTransaccion = ctx.params.id;

    if (!idTransaccion || isNaN(Number(idTransaccion))) {
      ctx.response.status = 400;
      ctx.response.body = { success: false, msg: "ID del Tipo de cuenta no válido" };
      return;
    }

    const objTipo = new Transaccion(null, Number(idTransaccion));
    const result = await objTipo.eliminarTransaccion();

    ctx.response.status = result.success ? 200 : 400;
    ctx.response.body = {
      success: result.success,
      message: result.message,
    };

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      msg: "Error interno al eliminar el Tipo de Cuenta"
    };
  }
};