// Backend/Controllers/Private/sp_TransaccionesDetalladasPorUsuarioController.ts

import { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { getTransaccionesDetalladasPorUsuario } from "../../Models/Private/sp_TransaccionesDetalladasPorUsuarioModel.ts";

// NOTA: El tipo debe coincidir con la ruta real exacta
export const obtenerTransaccionesPorUsuario = async (
  ctx: RouterContext<"/api/transacciones/:id">
) => {
  const { id } = ctx.params;

  if (!id || isNaN(Number(id))) {
    ctx.response.status = 400;
    ctx.response.body = { message: "ID de usuario inválido" };
    return;
  }

  try {
    const transacciones = await getTransaccionesDetalladasPorUsuario(Number(id));

    if (!transacciones || transacciones.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "No se encontraron transacciones para este usuario" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = transacciones;
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error interno del servidor" };
  }
};
