import { addEventosGeneralesAWindow } from './comandos-generales.js';
import { logError, logger} from './logger/loggerFunction.js';
import {descargarArchivo} 
    from 'https://unpkg.com/operaciones-archivos@1.0.2/operaciones-archivos.js';

/**
 * Regresa la linea con el error
 * @param {string} cad 
 */
function cadenaError(cad) {    
    let matches = cad.match(/<anonymous>:\d{1,}:\d{1,}/);
    if (!matches) {
        return null;
    }
    let indice = matches[0].match(/\d{1,}/);    
    return indice[0];
}
/**
 * 
 * @param {HTMLIFrameElement} iframe 
 */
function initIframe(iframe) {
    iframe.contentWindow.console.error = (...todo) => {        
        logError(...todo);        
    };
    iframe.contentWindow.console.log = logger;
}
let anteriorDoc = '';
let botonGuardar = document.querySelector('#guardar');
export function creaVistaPrevia(editor, vistaPrevia, refiframe) {
    let [html, css, js] = editor.getTodoElCodigo();
    let documento = JSON.stringify([html, css, js]);
    if (anteriorDoc === documento) {
        return;
    }
    anteriorDoc = documento;
    botonGuardar.classList.add('cambio');
    vistaPrevia.innerHTML = "<iframe></iframe>";
    let iframe = vistaPrevia.querySelector('iframe');    
    refiframe = iframe;
    initIframe(iframe);
    let codigo = templateHtml(html, css, js);    
    iframe.contentDocument.open();
    try {
        iframe.contentDocument.write(codigo);        
    } catch (error) {
        console.log(error);
    } finally {
        iframe.contentDocument.close();
    }
    addEventosGeneralesAWindow(iframe.contentWindow);
}

function templateHtml(html, css, js) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <style>
        ${css}
    </style>
    <body>
        ${html}
    </body>    
    <script type="module">
        ${js}
    </script>
    </html>
    `;
}

export function descargaHtml(editor) {
    const [html, css, js] = editor.getTodoElCodigo();
    const titulo = document.querySelector('input.titulo').value;
    const textHtml = templateHtml( html, css, js);    
    descargarArchivo(textHtml, `${titulo}.html`,'text/html');
}