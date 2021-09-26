import { getEditor } from "./initeditor.js";
import { addNotificacion } 
    from "https://unpkg.com/notificaciones-w3css@1.0.1/notificaciones.js";

let botonGuardar = document.querySelector('#guardar');
export function guardarCodigo() {
    const doc = generarDocumento();
    let documento = LZString.compressToBase64( JSON.stringify(doc) );
    localStorage.setItem('documento', documento);
    botonGuardar.classList.remove('cambio');
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

export function abrirEnCodepen(){
    let div = document.createElement('div');
    div.innerHTML = `
    <form action="https://codepen.io/pen/define" 
    method="POST" target="_blank">
      <input id="data-input" type="hidden" name="data" value="">
    <button type=submmit>
    enviar
    </button>
    </form>
    `;
    let form = div.querySelector('form');
    let input = form.querySelector('input');    
    let doc = generarDocumento();
    input.value = JSON.stringify({
        title: doc.titulo,
        html: doc.codigo[0],
        css: doc.codigo[1],
        js: doc.codigo[2]
    });
    document.body.append(form);
    let enviar = form.querySelector('button');
	enviar.click();
	setTimeout(t =>{
		form.remove();
	},1);
}
