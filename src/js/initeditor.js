import { setDatosTitulo } from './documento.js';
import { logger, setDivConsola, setEstilosConsola } from './logger/loggerFunction.js';
import { creaVistaPrevia } from './procesarVistaPrevia.js';
import { validaCodigo } from './validarCodigo.js';
import './web-componente/editor-archivos-web-componente.js';

let editor = document.querySelector('editor-archivos-codejar');
let vistaPrevia = document.querySelector('.vista-previa');

let [html, css, js] = ['', '', '']; 

let codigo = location.href.split('#')[1];
if (codigo) {
    let doc = JSON.parse( LZString.decompressFromBase64(codigo));
    setDatosTitulo(doc);
    [html, css, js] = doc.codigo;    
} else {
    let localCodigo = localStorage.getItem('documento');
    if (localCodigo) {
        let doc = JSON.parse( LZString.decompressFromBase64(localCodigo));
        setDatosTitulo(doc);
        [html, css, js] = doc.codigo;
    }
}

const highlightJS = (editor) => {
    editor.textContent = editor.textContent;
    let code = editor.textContent;                
    let html = hljs.highlight(code, {language: 'js'}).value;
    html = validaCodigo(html, code);
    editor.innerHTML = html;
}

editor.setFiles([
    {
        titulo: 'HTML',
        tipo: 'html',
        codigo: html,
        icono:`&#9733;`
    },
    {
        titulo: 'CSS',
        tipo: 'css',
        codigo: css,
        icono: '&#9733;'
    },
    {
        titulo: 'Js',
        tipo: 'js',
        codigo: js,
        fcolor: highlightJS,
        icono: '&#9733;'
    }
]);

let tamanioBlanco = 95;

let refiframe = null;
window.addEventListener('resize', ev => {
    editor.setAlto(`${window.innerHeight - tamanioBlanco}px`);
    if (refiframe) {
        refiframe.style.maxHeight = `${window.innerHeight - tamanioBlanco}px`;
    }
});
editor.setAlto(`${window.innerHeight - tamanioBlanco}px`);

editor.addEventListener('cambio-editor', ev => {    
    creaVistaPrevia(editor, vistaPrevia, refiframe);
});

creaVistaPrevia(editor, vistaPrevia, refiframe);

export function getEditor() {
    return editor;
}

let div = document.querySelector('.consola');
setEstilosConsola({
    colorString: 'black',
});
setDivConsola(div);
logger(`<h2 style="color: indigo;">Logger beta</h2>
<h4>by Saúl SM</h4>`);
