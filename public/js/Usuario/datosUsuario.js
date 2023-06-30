//LLENAR DATOS
llenarDatosUsuario();

function llenarDatosUsuario() {
    let nombre =document.getElementById("nombre");
    let apellido =document.getElementById("apellido");
    let correo =document.getElementById("correo");
    let roles =document.getElementById("roles");
    let estado =document.getElementById("estado");

    traerUsuario().then(usuario => {

        if (usuario.estado == 'A'){
            usuario.estado = 'Activo';
        }else if(usuario.estado == 'I'){
            usuario.estado = 'Inactivo';
        }

        usuario.roles = usuario.roles[0];
        if (usuario.roles == 'ROLE_ADMIN'){
            usuario.roles = 'Administrador';
        }else if(usuario.roles == 'ROLE_RECEPCION'){
            usuario.roles = 'Recepcionista';
        }else{
            usuario.roles = 'Personal de limpieza';
        }  

        nombre.textContent = usuario.nombre;
        apellido.textContent = usuario.apellido;
        correo.textContent = usuario.correo;
        roles.textContent = usuario.roles;
        estado.textContent = usuario.estado;

    })
}
//peticion fetch
async function traerUsuario() {
    let idUsuario = document.getElementById("idUsuario").value;
    let respuesta = await fetch(`/usuario/obtener/${idUsuario}`);
    let usuario = await respuesta.json();
    console.log(usuario);
    return usuario;
}