// deno-lint-ignore-file
import { Body } from "https://deno.land/x/oak@v17.1.3/body.ts";
import { TipoCuenta } from '../Models/TipoCuentaModel.ts';
export const getTipoCuenta = async (ctx: any) => {
  const { response } = ctx;

  try {
    const objTipo = new TipoCuenta();
    const listaTipo = await objTipo.SeleccionarTipo();
    response.status = 200;
    response.body = {
      success: true,
      data: listaTipo,
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

export const posTipoCuenta = async (ctx: any) => {
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

    const TipoCuentaData = {
      idTipoCuenta: null,
      nombreTipoCuenta: body.nombreTipoCuenta,
      numeroCuenta: body.numeroCuenta,
    };

    const objTipo = new TipoCuenta(TipoCuentaData);
    const result = await objTipo.insertarTipo();
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

export const putTipoCuenta = async (ctx: any) => {
    const { request, response } = ctx;
  
    try {
      const contentLength = request.headers.get("Content-Length");
      if (contentLength === "0") {
        response.status = 400;
        response.body = { success: false, msg: "Cuerpo de la solicitud está vacío" };
        return;
      }
  
      const body = await request.body.json();
  
      const TipoCuentaData = {
      idTipoCuenta: body.idTipoCuenta,
      nombreTipoCuenta: body.nombreTipoCuenta,
      numeroCuenta: body.numeroCuenta,
    };
  
      if (!TipoCuentaData.idTipoCuenta) {
        response.status = 400;
        response.body = { success: false, msg: "ID de usuario requerido para actualizar." };
        return;
      }
  
      const objTipo = new TipoCuenta(TipoCuentaData);
      const result = await objTipo.actualizarTipo();
  
      response.status = result.success ? 200 : 400;
      response.body = {
        success: result.success,
        message: result.message
      };
  
    } catch (error) {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Error interno al actualizar el Tipo de Cuenta"
      };
    }
  };
  

export const deleteTipo = async (ctx: any) => {
  try {
    const idTipoCuenta = ctx.params.id;

    if (!idTipoCuenta || isNaN(Number(idTipoCuenta))) {
      ctx.response.status = 400;
      ctx.response.body = { success: false, msg: "ID del Tipo de cuenta no válido" };
      return;
    }

    const objTipo = new TipoCuenta(null, Number(idTipoCuenta));
    const result = await objTipo.eliminarTipo();

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