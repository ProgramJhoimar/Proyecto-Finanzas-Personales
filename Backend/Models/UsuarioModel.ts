import { number } from "https://deno.land/x/zod@v3.24.4/types.ts";

interface UsuarioData {
  idUsuario: number | null;
  perfil: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  password: string;
}

export class UsuarioModel {
  public _objUsuario: UsuarioData | null;
  public _idUsuario: number | null;

  constructor(
    _objUsuario: UsuarioData | null = null,
    _idUsuario: number | null = null,
  ) {
    this._objUsuario = _objUsuario;
    this._idUsuario = _idUsuario;
  }
}
