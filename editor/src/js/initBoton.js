import { addNotificacion } 
  from "https://unpkg.com/notificaciones-w3css@1.0.1/notificaciones.js";
import { abrirEnCodepen, generarDocumento, guardarCodigo } from "./documento.js";

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


let codigoAyuda = `
<h3>Edición</h3>
<table class="w3-table-all">
    <tr>
      <th>Comando</th>
      <th>Descripción</th>      
    </tr>
    <tr>
      <td>ctrl + m</td>
      <td>Abre un nuevo documento en blanco listo para editar.</td>      
    </tr>
    <tr>
      <td>ctrl + s</td>
      <td>Guardar el código en el explorador. <br>Este se cargara por defecto en el proximo inicio. Elimina el documento anterior.</td>      
    </tr>
    <tr>
      <td>ctrl + z</td>
      <td>Deshacer, aplica en el editor con focus.</td>      
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
</table>
<h3>Focus</h3>
<table class="w3-table-all">
    <tr>
    <th>Comando</th>
    <th>Descripción</th>      
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
</table>
`;

let botonComandos = document.querySelector('#ayuda');
botonComandos.addEventListener('click', ev => {
    addNotificacion({
        tipo: 'w3-white',
        titulo: '&#x261B; Comandos',
        mensaje: codigoAyuda,
        tiempo: 20000,
    })
});


let botonCodepen = document.querySelector('#codepen');
botonCodepen.addEventListener('click', ev => {
    abrirEnCodepen();
});
