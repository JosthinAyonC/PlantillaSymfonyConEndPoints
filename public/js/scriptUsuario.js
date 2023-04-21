
//ENLISTAR INDEX
function mostrarDatosTabla(datos) {
    let rolUsuarioLog = traerRol();
    var tablaUsuarios = document.getElementById("tablausuarios");
    var tbody = tablaUsuarios.getElementsByTagName("tbody")[0];
    datos.forEach(function (usuario) {
        var fila = document.createElement("tr");
        fila.id = "usuario-" + usuario.idUsuario;

        var celdaIdUsurio = document.createElement("td");
        celdaIdUsurio.textContent = usuario.idUsuario;
        fila.appendChild(celdaIdUsurio);

        var celdaNombre = document.createElement("td");
        celdaNombre.textContent = usuario.nombre + " " + usuario.apellido;
        fila.appendChild(celdaNombre);

        var celdaCorreo = document.createElement("td");
        celdaCorreo.textContent = usuario.correo
        fila.appendChild(celdaCorreo);

        var celdaRol = document.createElement("td");
        celdaRol.textContent = usuario.roles
        fila.appendChild(celdaRol);

        var celdaEstado = document.createElement("td");
        let estado;
        if (usuario.estado === 'A' ? estado = 'Activo' : estado = 'Inactivo')
            celdaEstado.textContent = estado;
        fila.appendChild(celdaEstado);

        if (rolUsuarioLog == "ROLE_ADMIN") {

            var celdaAcciones = document.createElement("td");

            var botonBorrar = document.createElement('a');
            botonBorrar.classList.add('btn', 'btn-outline-primary', 'm-2', 'btn-borrar', 'btn-usuario');
            botonBorrar.id = 'btn-borrar';
            botonBorrar.textContent = 'Borrar';
            fila.appendChild(botonBorrar);

            var enlaceEditar = document.createElement('a');
            enlaceEditar.classList.add('btn', 'btn-outline-primary', 'm-2', 'btn-usuario', 'btn-editar');
            enlaceEditar.id = 'btn-editar'
            enlaceEditar.textContent = 'Editar';
            fila.appendChild(enlaceEditar);
            celdaAcciones.appendChild(botonBorrar);
            celdaAcciones.appendChild(enlaceEditar);
            fila.appendChild(celdaAcciones);

        }
        tbody.appendChild(fila);
    });
    let btn_usuario = document.querySelectorAll(".btn-usuario");

    btn_usuario.forEach(b => b.addEventListener("click", async (e) => {
        const botonActual = e.target;
        const iduser = botonActual.parentNode.parentElement.children[0].innerText;
        const nombre = botonActual.parentNode.parentElement.children[1].innerText;

        if (botonActual.classList.contains("btn-borrar")) {

            let confirmacion = confirm(`Estas seguro que deseas eliminar al usuario ${nombre} ?`);

            if (confirmacion) {
                await fetch(`/usuario/${iduser}/delete`, { method: 'PUT' })
                document.querySelector(`#usuario-${iduser}`).remove()
                alert("Usuario borrado existosamente")

            }

        } else {

            window.location.replace(`/usuario/editar/${iduser}`);
        }
    }));
}

//METODO GET
async function ListarUsuarios() {
    try {
        const respuesta = await fetch('/usuario/get', { method: 'GET' });
        const datos = await respuesta.json();
        mostrarDatosTabla(datos);

    } catch (error) {
        console.log(error);
    }
}

// RENDERIZAR INDEX 
ListarUsuarios();


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

        // Convertir el objeto JavaScript a una cadena JSON
        let jsonData = JSON.stringify(data);

        const idUser = formData.get("id");
        let response = await fetch(`/usuario/${idUser}/editar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });
        alert("Usuario editado satisfatoriamente");
        location.replace('/usuario');
    });
} catch (error) {
    console.log(error);
}

//NUEVO USUARIO
let btn_nuevo = document.getElementById("btnNuevo");
let formUsuarioNuevo = document.getElementById("nuevo-usuario");

try {

    btn_nuevo.addEventListener("click", async function () {

        let formData = new FormData(formUsuarioNuevo);

        // Convertir el objeto FormData a un objeto JavaScript
        let data = Object.fromEntries(formData);

        // Convertir el campo roles a un objeto JavaScript
        data.roles = JSON.parse(data.roles);

        // Convertir el objeto JavaScript a una cadena JSON
        let jsonData = JSON.stringify(data);

        let response = await fetch(`/usuario/nuevo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });
        alert("Usuario creado satisfatoriamente");

        location.replace('/usuario');
    });

} catch (error) {
    console.log(error);
}

//EDITAR CONTRASENIA
let formPassedit = document.getElementById("form-passedit");
let btn_passedit = document.getElementById("btn-passedit");

try {

    btn_passedit.addEventListener("click", async function () {
        let formData = new FormData(formPassedit);
        let data = Object.fromEntries(formData);

        let claveN = formData.get("claveNueva");
        let claveC = formData.get("claveNuevaConfirmar");
        let jsonData = JSON.stringify(data);
        console.log(jsonData)

        if (claveN == claveC) {

            const idUser = formData.get("id");

            let respuesta = await fetch(`/usuario/${idUser}/change/pass`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });
            if (respuesta.status == 200) {

                await fetch(`/usuario/${idUser}/change/pass`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: jsonData
                });
                alert("Contrasenia editada correctamente");
                location.replace('/');

            } else {
                alert("Contrasenia actual incorrecta")
            }

        } else {
            alert("Verifique las claves ingresadas sean iguales")
        }


    });
} catch (error) {
    console.log(error);
}

//OBTENER ROL DEL USUARIO LOGEADO
function traerRol() {
    let formRoles = document.getElementById("form-obtenerRoles");
    let formData = new FormData(formRoles);
    let data = Object.fromEntries(formData);

    return data.roles;
}