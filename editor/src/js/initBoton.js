import { addNotificacion } 
  from "https://unpkg.com/notificaciones-w3css@1.0.1/notificaciones.js";
import { abrirEnCodepen, generarDocumento, guardarCodigo } from "./documento.js";
import { creaVista } from "./initeditor.js";

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
    <tr>
        <th colspan="2">Editor</th>       
    </tr>
    <tr>
      <td>ctrl + m</td>
      <td>Abre un nuevo documento en blanco.</td>      
    </tr>
    <tr>
      <td>ctrl + s</td>
      <td>Guardar el código en el explorador.</td>      
    </tr>
    <tr>
      <td>ctrl + e</td>
      <td>Ejecutar.</td>      
    </tr>
    <tr>
      <td>ctrl + k</td>
      <td>Intercambiar tema de editor.</td>      
    </tr>
    <tr>
      <td>ctrl + d</td>
      <td>Descarga el contenido un archivo html.</td>      
    </tr>
    <tr>
      <td>ctrl + &lt;</td>
      <td>Decrementa la letra de los editores.</td>      
    </tr>
    <tr>
      <td>ctrl + &gt;</td>
      <td>Incrementa la letra de los editores.</td>      
    </tr>
`;
const tablaFocus = `
    <tr>
    <th colspan="2">Focus</th>    
    </tr>
    <tr>
      <td>ctrl + 1</td>
      <td>Activa el editor html.</td>      
    </tr>
    <tr>
      <td>ctrl + 2</td>
      <td>Activa el editor css.</td>      
    </tr>
    <tr>
      <td>ctrl + 3</td>
      <td>Activa el editor js.</td>      
    </tr>
    <tr>
      <td>ctrl + 4</td>
      <td>Activa la consola.</td>      
    </tr> 
`;

const codigoAyuda = `
<div class="w3-padding" style="max-height: calc(100vh / 2); overflow: auto;"> 
    <table class="w3-table-all">
    ${tablaEdicion}
    ${tablaFocus}  
    </table>  
</div>


`;

let botonComandos = document.querySelector('#ayuda');
botonComandos.addEventListener('click', ev => {
    addNotificacion({
        tipo: 'w3-white',
        titulo: '&#x261B; Comandos',
        mensaje: codigoAyuda,
        tiempo: 50000,
    })
});


let botonCodepen = document.querySelector('#codepen');
botonCodepen.addEventListener('click', ev => {
    abrirEnCodepen();
});


let botonEjecutar= document.querySelector('#run');
botonEjecutar.addEventListener('click', ()=>{
    creaVista();
})