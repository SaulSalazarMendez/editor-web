import {html} from './htm.js';
import {css} from './css.js';
import * as color from './colores.js';
import { guardaEstado, setEstado } from '../servicio/estado-editor.js';

async function cargaLibrerias() {
    const cj = (await import('https://unpkg.com/codejar@3.5.0/codejar.js'));
    const lines = (await import('https://unpkg.com/codejar@3.5.0/linenumbers.js'));    
    await import('https://unpkg.com/prismjs');
    const pr = window.Prism;
    
    return {
        CodeJar: cj.CodeJar,
        withLineNumbers: lines.withLineNumbers,        
        Prism: pr
    };
}

const libs = await cargaLibrerias();

function getFuncion(funcion, numLinea) {
    if (numLinea) {
        return  libs.withLineNumbers(funcion);
    }
    return funcion;
}
function createEditor(element, tipo, fcolor = null, numLinea = true) {
    const highlight = (editor) => {
        editor.textContent = editor.textContent;
        let code = editor.textContent;
        let html = libs.Prism.highlight(code, libs.Prism.languages[tipo], tipo);
        editor.innerHTML = html;
    }
    if (fcolor == null){
        return libs.CodeJar(element,  getFuncion(highlight, numLinea) );
    }
    return libs.CodeJar(element,  getFuncion(fcolor, numLinea) );
}

const TEMAS = {
    claro: 'https://cdn.jsdelivr.net/gh/PrismJS/prism-themes/themes/prism-gruvbox-light.css',
    oscuro: 'https://cdn.jsdelivr.net/gh/PrismJS/prism-themes/themes/prism-nord.css'
}

class EditorArchivos extends HTMLElement {
    constructor() {
        super();
        this.files = [];
        this.contadorTab = 0;
        this.editoresJar = [];
        this.tema = 'oscuro';
        this.variablesEditor = {
            alto: '100vh',
            colorSeleccion: 'white',
            fondoSeleccion: '#446294',
            tamanioLetra: 12
        }
    }
    getTodoElCodigo() {
        let codigo = [];
        for(let editor of this.editoresJar) {
            codigo.push(editor.jar.toString());
        }
        return codigo;
    }
    /**
     * Emite cambio del archivo modificado
     * @param {HTMLElement} target 
     * @param {string} codigo 
     */
    emiteCambio(target, codigo) {
        let ev = new CustomEvent('cambio-editor', {
            detail: {
                target: target,                
                codigo: codigo
            }
        });        
        this.dispatchEvent(ev);
    }
    /**
     * Emite el clip del icono que se haya dado clic
     * @param {HTMLElement} target 
     * @param {number} con 
     */
    emiteclipIcono(target, con) {
        let ev = new CustomEvent('click-icono', {
            detail: {
                target: target,
                index: con-1
            }
        })
        this.dispatchEvent(ev);
    }
    swapTema() {
        if (this.tema == 'claro') {
            this.setTema('oscuro');
        } else {
            this.setTema('claro');
        }
    }
    setTema(tema) {
        this.tema = tema;
        let link = this.querySelector('#temacolor');
        link.setAttribute('href', TEMAS[this.tema]);
        this.colorStyle.innerHTML = `${color[this.tema]}`;
        setEstado({tema: tema})
        guardaEstado();
    }

    creaTab(titulo, icono, con) {
        let tab = document.createElement('button');
        this.tabs.append(tab);
        tab.innerHTML = `<span icono>${icono}</span> ${titulo}`;
        tab.id = `tab-${con}`;
        tab.setAttribute('tab', '');
        let spanIcono = tab.querySelector('[icono]');
        spanIcono.addEventListener('click', ev => this.emiteclipIcono(spanIcono, con))
        return tab;
    }

    creaEditor(dato, con) {
        let editor = document.createElement('div');
        this.editores.append(editor);
        editor.innerHTML = `<div id="file+${con}" class="editor language-${dato.tipo} principal"></div>`;
        editor.classList.add('contenedor-'+con);
        editor.setAttribute('contenedor', '');
        let div = editor.querySelector('div');
        let jar = createEditor(div, dato.tipo, dato.fcolor, dato.numLinea);
        jar.updateCode(dato.codigo);
        return {editor, jar};
    }

    remueveActivo(selector) {
        let items = this.querySelectorAll(selector);
        for(let item of items) {
            item.classList.remove('activo');
        }
    }
    
    activa(tab, contenedor) {
        this.remueveActivo('[tab]');
        this.remueveActivo('[contenedor]');
        tab.classList.add('activo');
        contenedor.classList.add('activo');
    }

    addListenersTabEditor(tab, editor) {
        tab.addEventListener('click', ev=> {
            this.activa(tab,editor);
        });
    }

    getMetadataFile() {
        return {        
            titulo: '',
            tipo: '',
            codigo: '',
            icono: '',
            fcolor: null,
            numLinea: true
        }
    }

    activaTabPorIndice( indice = 0 ) {
        let tab = this.querySelector('#tab-'+indice);
        let contenedor = this.querySelector('.contenedor-'+indice);
        if (tab && contenedor) {
            this.activa(tab, contenedor);
            let editor = contenedor.querySelector('.editor');
            editor.focus();
        }
    }

    addEventosEditoresJar() {        
        for (let editor of this.editoresJar) {
            editor.jar.onUpdate( codigo => {
                this.emiteCambio(editor.editor, codigo);
            });            
        }
    }

    render() {
        this.innerHTML =`
        <link rel="stylesheet" href="${TEMAS[this.tema]}" id="temacolor">
        <style variables>                
        </style>
        <style color>
            ${color[this.tema]}
        </style>
        <style>
        ${css}
        </style>
        ${html}
        `;        
        this.contadorTab = 0;
        this.editoresJar = [];
        this.tabs = this.querySelector('.tabs');
        this.variables = this.querySelector('[variables]');   
        this.colorStyle = this.querySelector('[color]');   
        this.seteaVariables();     
        this.editores = this.querySelector('.editores');        
        for(let item of this.files) {            
            let dato = this.getMetadataFile();
            dato = Object.assign(dato, item);            
            let tab = this.creaTab(dato.titulo, dato.icono, this.contadorTab);
            let editor = this.creaEditor(dato, this.contadorTab);
            this.addListenersTabEditor(tab, editor.editor);
            this.editoresJar.push(editor);            
            if (this.contadorTab == 0){
                this.activa(tab, editor.editor);
            }
            this.contadorTab ++;
        }
        this.quitaPropiedadColorLineas();
        this.addEventosEditoresJar();
    }

    quitaPropiedadColorLineas() {
        let lineas = this.querySelectorAll('.codejar-linenumbers');
        for(let linea of lineas) {
            linea.style.color = '';
        }
    }

    seteaTamanioLetraLineas() {
        let lineas = this.querySelectorAll('.codejar-linenumbers');
        for(let linea of lineas) {
            linea.style.fontSize = `${this.variablesEditor.tamanioLetra}px`;
            linea.style.lineHeight = 1.3;
        }
    }

    seteaVariables() {
        this.variables.innerHTML = `
            .variables {
                --alto: ${this.variablesEditor.alto};
                --color-seleccion: ${this.variablesEditor.colorSeleccion};
                --fondo-seleccion: ${this.variablesEditor.fondoSeleccion};
                --tamanio-letra: ${this.variablesEditor.tamanioLetra}px;
            }
        `;
        this.seteaTamanioLetraLineas();
    }

    setAlto(alto = '100vh') {
        this.variablesEditor.alto = alto;
        this.seteaVariables();
    }

    incrementaTamanio() {
        this.variablesEditor.tamanioLetra ++;
        this.seteaVariables();        
    }

    decrementaTamanio() {
        this.variablesEditor.tamanioLetra --;
        if (this.variablesEditor.tamanioLetra < 6) {
            this.variablesEditor.tamanioLetra = 6;
        }
        this.seteaVariables();
    }

    setColorSeleccion(color = 'white') {
        this.variablesEditor.colorSeleccion = color;
        this.seteaVariables();
    }

    setFondoSeleccion(fondo = '#446294') {
        this.variablesEditor.fondoSeleccion = fondo;
        this.seteaVariables();
    }

    setFiles(files) {
        this.files = files;
        this.render();
    }
}

customElements.define('editor-archivos-codejar', EditorArchivos);
