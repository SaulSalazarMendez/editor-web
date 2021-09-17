import { logError } from "./logger/loggerFunction.js";

let config = {
    forin: true,
    noarg: true,
    bitwise: true,
    nonew: true,    
    browser: true,
    devel: true,
    node: false,    
    moz: false,
    eqnull: false,
    debug: false,
    boss: false,
    evil: true,
    loopfunc: false,
    varstmt: true,
    esversion: 8,
    undef:true,
    unused:true,
    curly: true
};

function addError(html, e) {    
    let lineas = html.split('\n');
    const linea = e.line - 1;
    let esError = e.code.indexOf('E') == 0 ? 'error' : 'warning';
    lineas[linea] = `<span class="linea-${esError}" title="${e.reason}">${lineas[linea]}</span>`;
    return lineas.join('\n');
}
/**
 * 
 * @param {string} html 
 * @param {string} codigo 
 */
export function validaCodigo(html, codigo) {
    JSHINT(codigo, config);     
    let res = JSHINT.data();    
    if ( res.hasOwnProperty('errors')) {
        for(let e of res.errors) {
            html = addError(html, e);
            //logError(`Error: ${e.reason} Linea: ${e.line}`);
        }
    }
    return html;
}