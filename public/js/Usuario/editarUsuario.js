//LLENAR FORMULARIO
llenarFormulario();

function llenarFormulario() {

    let nombre = document.getElementById("nombre");
    let apellido = document.getElementById("apellido");
    let correo = document.getElementById("correo");
    let roles = document.getElementById("roles");
    let estado = document.getElementById("estado");

    traerUsuario().then(usuario => {

        nombre.value = usuario.nombre;
        apellido.value = usuario.apellido;
        correo.value = usuario.correo;
        
        let rolesSeleccionados = usuario.roles[0]; // Asignar el valor de usuario.roles[0]
        if (rolesSeleccionados == 'ROLE_ADMIN'){
            rolesSeleccionados = 'Administrador';
        }else if(rolesSeleccionados == 'ROLE_RECEPCION'){
            rolesSeleccionados = 'Recepcionista';
        }else{
            rolesSeleccionados = 'Personal de limpieza';
        }   

        for (let i = 0; i < roles.options.length; i++) {
            let option = roles.options[i];
            if (option.text === rolesSeleccionados) { // Comparar con rolesSeleccionados
                option.selected = true;
                break;
            }
        }

        if (usuario.estado == 'A'){
            usuario.estado = 'Activo';
        }else if(usuario.estado == 'I'){
            usuario.estado = 'Inactivo';
        }
        for (let i = 0; i < estado.options.length; i++) {
            let option = estado.options[i];
            if (option.text === usuario.estado) {
                option.selected = true;
                break;
            }
        }
    });
}

//Funcion para traer al usuario
async function traerUsuario() {
    let idUsuario = document.getElementById("idUsuario").value;
    let respuesta = await fetch(`/usuario/obtener/${idUsuario}`);
    let usuario = await respuesta.json();
    console.log(usuario);
    return usuario;
}


//EDITAR USUARIO
let formUsuario = document.getElementById("formulario-usuario");
let btn_actualizar = document.getElementById("btn-actualizar");

try {

    btn_actualizar.addEventListener("click", async function () {
        let formData = new FormData(formUsuario);

        // Convertir el objeto FormData a un objeto JavaScript
        let data = Object.fromEntries(formData);

        // Convertir el campo roles a un objeto JavaScript
        data.roles = JSON.parse(data.roles);
        if (data.nombre == "" || data.apellido == "" || data.correo == "" || data.clave == "") {

            alert("Asegurese de llenar todos los datos")

        } else {
            // Convertir el objeto JavaScript a una cadena JSON
            let jsonData = JSON.stringify(data);

            const idUser = formData.get("id");
            let respuesta = await fetch(`/usuario/${idUser}/editar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
            const response = await respuesta.json();
            alert(response.msg);
            location.replace('/usuario');
        }

    });
} catch (error) {
    console.log(error);
}

