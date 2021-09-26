import { abrirNuevo, guardarCodigo } from "./documento.js";
import { getEditor } from "./initeditor.js";
import { muestraOcultaConsola } from "./logger/loggerFunction.js";
import { descargaHtml } from "./procesarVistaPrevia.js";


export function addEventosGeneralesAWindow(window){
    let editor = getEditor();
    window.onkeydown = function(e) {
        //guardar codigo
        if (e.ctrlKey && e.key.toLowerCase() === 's') {        
            guardarCodigo();
            return false;
        }
    
        if ( e.ctrlKey && e.key.toLowerCase() === 'd') {
            descargaHtml(editor);
            return false;
        }
    
        if ( e.ctrlKey && e.key === '1') {            
            editor.activaTabPorIndice(0);
            return false;
        }
    
        if ( e.ctrlKey && e.key === '2') {            
            editor.activaTabPorIndice(1);
            return false;
        }
    
        if ( e.ctrlKey && e.key === '3') {            
            editor.activaTabPorIndice(2);
            return false;
        }

        if ( e.ctrlKey && e.key === '4') {            
            muestraOcultaConsola();
            return false;
        }

        if ( e.ctrlKey && e.key === '>') {            
            editor.incrementaTamanio();
            return false;
        }

        if ( e.ctrlKey && e.key === '<') {            
            editor.decrementaTamanio();
            return false;
        }

        if ( e.ctrlKey && e.key.toLowerCase() === 'm') {
            abrirNuevo();
            return false;
        }

        if ( e.ctrlKey && e.key.toLowerCase() === 'k') {
            editor.swapTema();
            return false;
        }
    };
}