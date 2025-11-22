// // localStorage 

// const STORAGE_KEY = "crm_clientes";
// const getClientes = () =>
//     JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// const saveClientes = (clientes) =>
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));

// const guardarCliente = (cliente) =>{
//     if (cliente.id){
//         const i = clientes.findIndex(c => c.id == cliente.id);
//         clientes[i] = cliente;
//         alert("Cliente autorizado correctamente") 
//     }
//     else{
//         cliente.id = Date.now().tonString();
//         clientes.push(cliente);
//         alert("cliente ELIMINADO correctamente");
//     };
//     saveClientes(clientes);


// }

// const eliminarCLIENTE = id => {
//     saveClientes(getClientes().filter(c => c.id !== id));
//     alett("clientes eliminado correctamente")
// }

// // validaciones


// =====================================
// LOCALSTORAGE
// =====================================
const STORAGE_KEY = "crm_clientes";

const getClientes = () =>
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const saveClientes = (clientes) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));

const guardarCliente = (cliente) => {
    const clientes = getClientes();

    if (cliente.id) {
        const i = clientes.findIndex(c => c.id === cliente.id);
        clientes[i] = cliente;
        alert("Cliente ACTUALIZADO correctamente");
    } else {
        cliente.id = Date.now().toString();
        clientes.push(cliente);
        alert("Cliente CREADO correctamente");
    }

    saveClientes(clientes);
};

const eliminarCliente = id => {
    saveClientes(getClientes().filter(c => c.id !== id));
    alert("Cliente ELIMINADO correctamente");
};


// =====================================
// VALIDACIONES
// =====================================
const validarValores = ({ nombre, email, empresa, telefono, categoria }) => {
    const errores = {};

    if (!nombre || nombre.trim().length < 2)
        errores.nombre = "El nombre es obligatorio y debe tener al menos 2 letras";

    const expEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !expEmail.test(email))
        errores.email = "Email no válido";

    if (!empresa || empresa.trim().length < 2)
        errores.empresa = "La empresa es obligatoria";

    if (telefono) {
        const digits = telefono.replace(/\D/g, "");
        if (digits.length < 7 || digits.length > 15)
            errores.telefono = "Teléfono inválido (7-15 dígitos)";
    }

    if (!categoria)
        errores.categoria = "Selecciona una categoría";

    return errores;
};


// LIMPIAR ERRORES DEL DOM
const clearAllErrors = () => {
    document.querySelectorAll(".text-danger").forEach(e => e.textContent = "");
    document.querySelectorAll("input, select").forEach(i => i.classList.remove("is-invalid"));
};

const applyErrorsToDOM = (errores) => {
    for (const campo in errores) {
        const span = document.getElementById(campo + "Error");
        if (span) span.textContent = errores[campo];

        const input = document.getElementById(campo);
        if (input) input.classList.add("is-invalid");
    }
};


// =====================================
// RENDER EN TABLA
// =====================================
const renderClientes = (lista) => {
    const cont = document.getElementById("clientesList");

    if (!lista || lista.length === 0) {
        cont.innerHTML = `<p>No hay clientes registrados</p>`;
        return;
    }

    cont.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-bordered align-middle">
                <thead class="table-primary">
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Empresa</th>
                        <th>Categoría</th>
                        <th style="width: 150px;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${lista.map(c => `
                        <tr>
                            <td>${c.nombre}</td>
                            <td>${c.email}</td>
                            <td>${c.telefono || "—"}</td>
                            <td>${c.empresa}</td>
                            <td>${c.categoria.toUpperCase()}</td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm me-2" onclick="editar('${c.id}')">
                                    Editar
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="borrar('${c.id}')">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
};


// =====================================
// EDITAR
// =====================================
window.editar = (id) => {
    const c = getClientes().find(x => x.id === id);
    if (!c) return;

    clienteId.value = c.id;
    nombre.value = c.nombre;
    email.value = c.email;
    telefono.value = c.telefono;
    empresa.value = c.empresa;
    categoria.value = c.categoria;

    clearAllErrors();
    guardarBtn.textContent = "Actualizar Cliente";
};


// =====================================
// BORRAR
// =====================================
window.borrar = (id) => {
    if (!confirm("¿Seguro de eliminar?")) return;
    eliminarCliente(id);
    renderClientes(getClientes());
};


// =====================================
// INICIALIZAR
// =====================================
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("clienteForm");
    renderClientes(getClientes());


    // ENVIAR FORMULARIO
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = {
            id: clienteId.value,
            nombre: nombre.value.trim(),
            email: email.value.trim(),
            telefono: telefono.value.trim(),
            empresa: empresa.value.trim(),
            categoria: categoria.value
        };

        const errores = validarValores(data);

        clearAllErrors();

        if (Object.keys(errores).length > 0) {
            applyErrorsToDOM(errores);
            return;
        }

        guardarCliente(data);
        renderClientes(getClientes());
        form.reset();
        clienteId.value = "";
        guardarBtn.textContent = "Guardar Cliente";
    });


    // CANCELAR
    cancelarBtn.addEventListener("click", () => {
        form.reset();
        clienteId.value = "";
        clearAllErrors();
        guardarBtn.textContent = "Guardar Cliente";
    });


    // LIMPIAR BÚSQUEDA
    limpiarBusquedaBtn.addEventListener("click", () => {
        busqueda.value = "";
        renderClientes(getClientes());
    });


    // BÚSQUEDA EN TIEMPO REAL
    busqueda.addEventListener("input", () => {
        const t = busqueda.value.toLowerCase();
        const filtrados = getClientes().filter(c =>
            c.nombre.toLowerCase().includes(t) ||
            c.email.toLowerCase().includes(t) ||
            c.empresa.toLowerCase().includes(t)
        );
        renderClientes(filtrados);
    });

});