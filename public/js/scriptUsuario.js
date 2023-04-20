
function mostrarDatosTabla(datos) {
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

        tbody.appendChild(fila);
    });
    let btn_usuario = document.querySelectorAll(".btn-usuario");

    btn_usuario.forEach(b => b.addEventListener("click", async (e) => {
        const botonActual = e.target;
        const iduser = botonActual.parentNode.parentElement.children[0].innerText;
        if (botonActual.classList.contains("btn-borrar")) {
            let response = await fetch(`http://127.0.0.1:8000/usuario/${iduser}/delete`, { method: 'PUT' });
            document.querySelector(`#usuario-${iduser}`).remove();
        } else{
            window.location.assign(`editar/${iduser}`);
        }
    }));
}



async function ListarUsuarios() {
    try {

        const respuesta = await fetch('http://127.0.0.1:8000/usuario/get', { method: 'GET' });
        const datos = await respuesta.json();
        mostrarDatosTabla(datos);
        
    } catch (error) {
        console.log(error);
    }
}
ListarUsuarios();
