import { addNotificacion } 
  from "https://unpkg.com/notificaciones-w3css";
import { abrirEnCodepen, generarDocumento, guardarCodigo } from "./documento.js";
import { creaVista, getEditor } from "./initeditor.js";
import {Modal} from 'https://unpkg.com/modales-w3css';
import { getEstado, guardaEstado, setEstado } from "./servicio/estado-editor.js";

let botonCompartir = document.querySelector('#compartir');
botonCompartir.addEventListener('click', ev => {
    let doc = generarDocumento();
    let url = `${location.protocol}//${location.host}${location.pathname}`;
    let codigo = LZString.compressToBase64( JSON.stringify(doc) );    
    url += '#'+codigo;

    navigator.clipboard.writeText(url).then(r => {         
        addNotificacion({
            tipo: 'w3-green',
            titulo: '&#10004; Ok',
            mensaje: 'Se copió la url para compartir'
        });
    });    
});

let botonGuardar = document.querySelector('#guardar');
botonGuardar.addEventListener('click', ev => {
    guardarCodigo();
});

const tablaEdicion = `
<div class="w3-panel w3-bottombar w3-border-blue">
<p>Editor</p>
</div>
<div class="w3-margin-top">
  <span class="w3-indigo w3-border w3-padding-small w3-round-xxlarge">ctrl + m</span>
  <span>Abre un nuevo documento en blanco.</span>    
</div> 
<div class="w3-margin-top">
  <span class="w3-indigo w3-border w3-padding-small w3-round-xxlarge">ctrl + s</span>
  <span>Guardar el código en el explorador.</span>    
</div> 
<div class="w3-margin-top">
  <span class="w3-indigo w3-border w3-padding-small w3-round-xxlarge">ctrl + e</span>
  <span>Ejecutar.</span>    
</div> 
<div class="w3-margin-top">
  <span class="w3-indigo w3-border w3-padding-small w3-round-xxlarge">ctrl + k</span>
  <span>Intercambiar tema de editor.</span>    
</div> 
<div class="w3-margin-top">
  <span class="w3-indigo w3-border w3-padding-small w3-round-xxlarge">ctrl + d</span>
  <span>Descarga el contenido un archivo html.</span>    
</div> 
<div class="w3-margin-top">
  <span class="w3-indigo w3-border w3-padding-small w3-round-xxlarge">ctrl + &lt;</span>
  <span>Decrementa la letra de los editores.</span>    
</div>  
<div class="w3-margin-top">
  <span class="w3-indigo w3-border w3-padding-small w3-round-xxlarge">ctrl + &gt;</span>
  <span>Incrementa la letra de los editores.</span>    
</div>
`;
const tablaFocus = `
<div class="w3-panel w3-bottombar w3-border-blue">
<p>Focus</p>
</div>
<div class="w3-margin-top">
  <span class="w3-indigo w3-border w3-padding-small w3-round-xxlarge">ctrl + 1</span>
  <span>Activa el editor html.</span>    
</div>
<div class="w3-margin-top">
  <span class="w3-indigo w3-border w3-padding-small w3-round-xxlarge">ctrl + 2</span>
  <span>Activa el editor css.</span>    
</div>
<div class="w3-margin-top">
  <span class="w3-indigo w3-border w3-padding-small w3-round-xxlarge">ctrl + 3</span>
  <span>Activa el editor js.</span>    
</div>
<div class="w3-margin-top">
  <span class="w3-indigo w3-border w3-padding-small w3-round-xxlarge">ctrl + 4</span>
  <span>Activa la consola.</span>    
</div>   
`;

const codigoAyuda = `   
<div class="w3-padding" style="max-height: calc(100vh / 2); overflow: auto; display: flex; flex-wrap: wrap;"> 
    <div style="width: 50%;  margin-right: 5px;">
    ${tablaEdicion}    
    </div>  
    <div style="width: 48%;">
    ${tablaFocus}  
    </div>
</div>
`;



let botonComandos = document.querySelector('#ayuda');
botonComandos.addEventListener('click', ev => {
    let modal = new Modal({
        colorFondo: 'w3-black',
        colorActivo: 'w3-indigo'
    });
    modal.titulo = 'Comandos';
    modal.innerHtml = codigoAyuda;
    modal.opciones.ancho = `90%`;
    modal.open();
});


let botonCodepen = document.querySelector('#codepen');
botonCodepen.addEventListener('click', ev => {
    abrirEnCodepen();
});


let botonEjecutar= document.querySelector('#run');
botonEjecutar.addEventListener('click', ()=>{
    creaVista();
})

function selecionaSelect(val1, val2) {
  if (val1 === val2){
    return 'selected'
  }
  return '';
}

function getHtmlConfig(){
  const estado = getEstado();

  return  /*html*/`
<div class="w3-padding" style="max-height: calc(100vh / 2); overflow: auto;"> 
  <div class="w3-panel">
<form >
    <div class="w3-margin-bottom">
    <label for="tema"><b>Tema:</b></label>
    <select class="w3-select" name="tema">
    <option value="claro" ${selecionaSelect('claro', estado.tema)}>Claro</option>
    <option value="oscuro" ${selecionaSelect('oscuro', estado.tema)}>Oscuro</option>
    </select>
    </div>
    <div>
    <label for="tema"><b>Validar código Javascript:<b></label>
    <select class="w3-select" name="validarJs">
    <option value="true" ${selecionaSelect(true, estado.validarJs)}>SI</option>
    <option value="false" ${selecionaSelect(false, estado.validarJs)}>No</option>
    </select>
    </div>
</form>
  </div>
</div>
`;
}
let botonConfiguracion = document.querySelector('#configurar');
botonConfiguracion.addEventListener('click', ()=> {
  let modal = new Modal({
    colorFondo: 'w3-black',
    colorActivo: 'w3-indigo'
  });
  modal.titulo = 'Configuraciones';
  modal.innerHtml = getHtmlConfig();
  modal.opciones.ancho = `50%`;
  modal.open().then(res => {
    const data = {
      validarJs: 'true' === res.data.validarJs,
      tema: res.data.tema
    }
    setEstado(data);
    guardaEstado();
    getEditor().setTema(data.tema);
  });
});