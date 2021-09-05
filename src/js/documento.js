import { getEditor } from "./initeditor.js";
import { addNotificacion } from "./libs.js";


export function guardarCodigo() {    
    const doc = generarDocumento();
    let documento = LZString.compressToBase64( JSON.stringify(doc) );
    localStorage.setItem('documento', documento);
    addNotificacion({
        tipo: 'w3-indigo',
        titulo: '&#10004; Ok',
        mensaje: 'Se guardó correctamente el documento'
    });
}


export function generarDocumento() {
    let editor = getEditor();
    const [html, css, js] = editor.getTodoElCodigo();
    const autor = document.querySelector('input.autor');
    const titulo = document.querySelector('input.titulo');
    return {
        autor: autor.value,
        titulo: titulo.value,
        fecha: Date.now(),
        codigo: [html, css, js]
    }    
}

export function setDatosTitulo(doc) {
    let autor = document.querySelector('input.autor');
    let titulo = document.querySelector('input.titulo');
    autor.value = doc.autor;
    titulo.value = doc.titulo;
}

export function abrirNuevo() {    
    const url = `${location.protocol}//${location.host}${location.pathname}`;
    const codigo = '#N4IghgrgLg9gTiAXOa8QBoRQJZQgGxiRABVcCjMAzAUwGMALMJARgDYBmABjYBZ+WLAOy8WmOjAAm2AOZFEAbRAZlmEAF0AvkA==';    
    window.open(url+codigo, '_blank');
}
