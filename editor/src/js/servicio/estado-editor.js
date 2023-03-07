let estado = {
    validarJs: false,
    tema: 'claro',
    size: ''
}

/**
 * Carga los estados del localstorage
 */
function inicializaEstado () {
    let estadoLocal = localStorage.getItem('estado-editor');
    if (estadoLocal) {
        estado = JSON.parse(estadoLocal);
    }
}
/**
 * guarda estado a local storage
 */
export function guardaEstado() {
    localStorage.setItem('estado-editor', JSON.stringify(estado))
}


export function getEstado() {
    return estado;
}
/**
 * actualiza el estado
 * @param {JSON} obj 
 */
export function setEstado(obj) {
    estado = Object.assign(estado, obj);
}

inicializaEstado();