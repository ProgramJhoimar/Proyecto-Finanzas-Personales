// Backend/Models/Private/sp_TransaccionesDetalladasPorUsuarioModel.ts

import { conexion } from "../Conexion.ts";

export const getTransaccionesDetalladasPorUsuario = async (idUsuario: number) => {
  const result = await conexion.execute(`CALL sp_TransaccionesDetalladasPorUsuario(?)`, [idUsuario]);

  // Verifica si result tiene la propiedad rows (devuelta por la librería MySQL para Deno)
  if (result && "rows" in result) {
    return result.rows;
  }

  return [];
};
