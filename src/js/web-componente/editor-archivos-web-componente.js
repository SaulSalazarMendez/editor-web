import {html} from './htm.js';
import {css} from './css.js';
import {CodeJar} 
    from 'https://unpkg.com/codejar@3.5.0/codejar.js';
import { withLineNumbers } 
    from 'https://unpkg.com/codejar@3.5.0/linenumbers.js';


function createEditor(element, tipo, fcolor = null) {
    const highlight = (editor) => {
        editor.textContent = editor.textContent;
        let code = editor.textContent;                
        let html = hljs.highlight(code, {language: tipo}).value;
        editor.innerHTML = html;
    }
    if (fcolor == null){
        return CodeJar(element,  withLineNumbers(highlight) );
    }
    return CodeJar(element,  withLineNumbers(fcolor) );
}

const TEMAS = {
    claro: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/styles/base16/edge-light.min.css',
    oscuro: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/styles/base16/edge-dark.min.css'
    //oscuro: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/styles/agate.min.css'    
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
            tamanioLetra: 10
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
    setTema(tema) {
        this.tema = tema;
        let link = this.querySelector('#temacolor');
        link.setAttribute('href', TEMAS[this.tema]);
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
        editor.innerHTML = `<div id="file+${con}" class="editor hljs language-${dato.tipo}"></div>`;
        editor.classList.add('contenedor-'+con);
        editor.setAttribute('contenedor', '');
        let div = editor.querySelector('div');
        let jar = createEditor(div, dato.tipo, dato.fcolor);
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
            fcolor: null
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
        <style>
        ${css}
        </style>
        ${html}
        `;        
        this.contadorTab = 0;
        this.editoresJar = [];
        this.tabs = this.querySelector('.tabs');
        this.variables = this.querySelector('[variables]');   
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
        this.addEventosEditoresJar();
    }

    seteaVariables() {
        this.variables.innerHTML = `
            .variables {
                --alto: ${this.variablesEditor.alto};
                --color-seleccion: ${this.variablesEditor.colorSeleccion};
                --fondo-seleccion: ${this.variablesEditor.fondoSeleccion};
                --tamanio-letra: ${this.variablesEditor.tamanioLetra}pt;
            }
        `;
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
