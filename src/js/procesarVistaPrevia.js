import { addEventosGeneralesAWindow } from './comandos-generales.js';
import { logError, logger} from './logger/loggerFunction.js';
import {descargarArchivo} from './libs.js';

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
function initIframe(iframe, detalleError) {
    iframe.contentWindow.console.error = (...todo) => {
        if (todo[0] == '__No error__') {
            detalleError.linea = -1;
            detalleError.detalle = '';
            return;
        }        
        let mensaje  = todo[0];
        let error = mensaje.message;
        let detalles = mensaje.stack;
        let linea = cadenaError(detalles);
        Object.assign(detalleError, {
            linea: linea,
            detalle: error
        });
        logError('Error: ', error, 'en linea:', linea );        
    };
    iframe.contentWindow.console.log = logger;
}

export function creaVistaPrevia(editor, vistaPrevia, refiframe, detalleError) {
    vistaPrevia.innerHTML = "<iframe></iframe>";
    
    let iframe = vistaPrevia.querySelector('iframe');
    //let iframe = document.createElement('iframe');
    refiframe = iframe;
    initIframe(iframe, detalleError);    
    let [html, css, js] = editor.getTodoElCodigo();
    let codigoJs64 = LZString.compressToBase64( JSON.stringify({js: js}));
    
    let codigo = templateConEval(html, css, codigoJs64);
    //let codigo = templateHtml(html, css, js);
    //para no sobrecargar la consola con errores de error
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

function templateConEval(html, css, codigoJs64) {
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js"></script>
    <script type="module">
        try {
            let _____codigo64 = "${codigoJs64}";
            let _____jsonCodigo = JSON.parse(LZString.decompressFromBase64(_____codigo64));
            eval(_____jsonCodigo.js);
            console.error('__No error__');
        } catch(e) {
            console.error(e);
        }
    </script>
    </html>
    `;
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