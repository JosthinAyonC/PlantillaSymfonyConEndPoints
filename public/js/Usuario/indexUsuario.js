
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

        var celdaAcciones = document.createElement("td");

        if (rolUsuarioLog == "ROLE_ADMIN") {

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

            var vistazo = document.createElement('a');
            vistazo.classList.add('btn', 'btn-outline-primary', 'm-2', 'btn-usuario', 'btn-show');
            vistazo.id = 'btn-show'
            vistazo.textContent = 'Vistazo';
            fila.appendChild(vistazo);

            celdaAcciones.appendChild(vistazo);
            celdaAcciones.appendChild(botonBorrar);
            celdaAcciones.appendChild(enlaceEditar);

            fila.appendChild(celdaAcciones);

        } else {
            var vistazo = document.createElement('a');
            vistazo.classList.add('btn', 'btn-outline-primary', 'm-2', 'btn-usuario', 'btn-show');
            vistazo.id = 'btn-show'
            vistazo.textContent = 'Vistazo';
            fila.appendChild(vistazo);

            celdaAcciones.appendChild(vistazo);
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
                let respuesta = await fetch(`/usuario/${iduser}/delete`, { method: 'PUT' })
                document.querySelector(`#usuario-${iduser}`).remove()
                const response = await respuesta.json();
                alert(response.msg)
            }

        } else if (botonActual.classList.contains("btn-editar")) {
            window.location.replace(`/usuario/editar/${iduser}`);
        } else {
            window.location.replace(`/usuario/visualizar/${iduser}`);
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



//OBTENER ROL DEL USUARIO LOGEADO
function traerRol() {
    let formRoles = document.getElementById("form-obtenerRoles");
    let formData = new FormData(formRoles);
    let data = Object.fromEntries(formData);

    return data.roles;
}