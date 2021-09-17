export const css = /*css*/`
/**host */

.editor {   
    font-family: "Source Code Pro", monospace;
    font-size: var(--tamanio-letra);
    font-weight: 400;
    min-height: 240px;
    letter-spacing: normal;
    line-height: 20px;
    padding: 10px;
    tab-size: 4;
    height: var(--alto);
    overflow: auto;
    resize: none;
    line-height: 1.3;    
}
[contenedor] {
    display: none;
}

.activo {
    display: block;
}
.tabs {
    overflow: hidden;    
    position: sticky;
    top: 0;
    z-index: 1;
}
.tabs button{
    background-color: inherit;
    float: left;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 4px 5px;
    transition: 0.3s;    
    filter: contrast(50%);
}

.tabs button img{
    width: 18px;
    height: 18px;
}

.tabs button:hover {    
    filter: contrast(100%);
}

.tabs button.activo {    
    filter: contrast(100%);
}

.codejar-linenumbers > div {
    filter: invert(1);
}
.linea-error{    
    color: white;
    background-color: red;
    border: solid 1px #902d2d;
    padding-left: 2px;
    padding-right: 2px;
    background-color: #907c7c;
}
.linea-error::before{
    content: '\\25B6 ';
    color: red;
}
.linea-warning{    
    color: white;
    background-color: orange;
    border: solid 1px #902d2d;
    padding-left: 2px;
    padding-right: 2px;
    background-color: #907c7c;
}
.linea-warning::before{
    content: '\\25B6 ';
    color: orange;
}
div[class*="editor"] span::selection, div[class*="editor"]::selection {
    color: var(--color-seleccion);
    background: var(--fondo-seleccion);
}

`
