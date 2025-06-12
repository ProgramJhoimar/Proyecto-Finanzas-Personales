import { UsuarioModel } from "../Models/UsuarioModel.ts";

export const getUsuario = async (ctxGet: any) => {
  const { responde } = ctxGet;
  try {
    const oUsuario = new UsuarioModel();
    const usuario = await oUsuario.ObtenerUsuarioPorId();
    if (usuario) {
      responde.status = 200;
      responde.body = {
        success: true,
        message: "Usuario obtenido correctamente",
        usuario: usuario,
      };
    } else {
      responde.status = 404;
      responde.body = {
        success: false,
        message: "Usuario no encontrado",
      };
    }
  } catch (error) {
    responde.status = 500;
    responde.body = {
      success: false,
      message: error instanceof Error ? error.message : "Error del servidor",
    };
  }
};

export const postUsuario = async (ctxPost: any) => {
  const { request, response } = ctxPost;
  try {
    const ContentLength = request.headers.get("Content-Length");
    if (!ContentLength || ContentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        message: "No se recibieron datos para el usuario",
      };
      return;
    }
    const body = await request.body.json();
    const UsuarioData = {
      idUsuario: body.idUsuario || null,
      perfil: body.perfil || "",
      nombre: body.nombre,
      apellido: body.apellido,
      telefono: body.telefono,
      email: body.email,
      password: body.password,
    };
    if (
      !UsuarioData.nombre ||
      !UsuarioData.apellido ||
      !UsuarioData.email ||
      !UsuarioData.password
    ) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Faltan datos obligatorios para registrar el usuario",
      };
      return;
    }
    console.log("Datos del usuario:", UsuarioData);
    const oUsuario = new UsuarioModel(UsuarioData);
    const result = await oUsuario.InsertarUsuario();
    response.status = 200;
    response.body = {
      success: true,
      msg: "Usuario Registrado en Controller",
      body: result,
    };
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `Error al procesar la solicitud en controller. \n ${error}`,
    };
  }
};

export const putUsuario = async (ctxPut: any) => {
  const { request, response } = ctxPut;
  try {
    const ContentLength = request.headers.get("Content-Length");
    if (!ContentLength || ContentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        message: "No se recibieron datos para actualizar el usuario",
      };
      return;
    }
    const body = await request.body.json();
    const UsuarioData = {
      idUsuario: body.idUsuario,
      perfil: body.perfil,
      nombre: body.nombre,
      apellido: body.apellido,
      telefono: body.telefono,
      email: body.email,
      password: body.password,
    };

    const idUsuario = Number(UsuarioData.idUsuario);
    console.log("Resultado de la actualización:", UsuarioData);
    const oUsuario = new UsuarioModel(UsuarioData, idUsuario);
    const result = await oUsuario.ActualizarUsuario();

    response.status = 200;
    response.body = {
      success: true,
      msg: "Usuario Actualizado en Controller",
      body: result,
    };
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : `Error del servidor \n ${error}`,
    };
  }
};

export const deleteUsuario = async (ctxDelete: any) => {
  const { request, response } = ctxDelete;
  try {
    const ContentLength = request.headers.get("Content-Length");
    if (!ContentLength || ContentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        msg: "El cuerpo de la solicitud esta vacio",
      };
      return;
    }
    const body = await request.body.json();
    const idUsuario = Number(body.idUsuario);
    if (!idUsuario) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "ID de usuario no proporcionado en Controller",
      };
      return;
    }
    const oUsuario = new UsuarioModel(null, idUsuario);
    const result = await oUsuario.EliminarUsuario();

    response.status = 200;
    response.body = {
      success: true,
      msg: "Usuario Eliminado en Controller",
      body: result,
    };
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : `Error de la solicitud en Controller \n ${error}`,
    };
  }
};
