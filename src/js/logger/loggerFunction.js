import { cssConsola } from "./css.js";

let div = null;
let mainDiv = null;
let estilosConsola = {};

function getEstilos() {
    return {
        //colores de letra
        colorNumero: 'blue',
        colorString: 'red',
        colorKey: 'purple',
        colorTipo: 'blue',
        colorObjecto: 'black',
        colorLinea: '#eee',
        //color de fondo        
        fondoError: ' #f3babf',
        fondoWarning: '#f3dfba',
        //detalles objecto
        simboloExpandir: '+ ',
        simboloContraer: '- ',
    }
}

export function setEstilosConsola(estilos) {
	estilosConsola = estilos;
}

function creaEstilos() {
    let estilos = Object.assign(getEstilos(), estilosConsola);
    return `
.variables{
    --color-numero: ${estilos.colorNumero};
    --color-string: ${estilos.colorString};
    --color-key: ${estilos.colorKey};
    --color-tipo: ${estilos.colorTipo};
    --color-objecto: ${estilos.colorObjecto};
    --color-linea: ${estilos.colorLinea};
    --fondo: ${estilos.fondo};
    --fondo-warning: ${estilos.fondoWarning};
	--fondo-error: ${estilos.fondoError};
	--simbolo-expandir: "${estilos.simboloExpandir}";
	--simbolo-contraer: "${estilos.simboloContraer}";
}
    `;
}

function creaJson(json) {
	let obj = {objecto : json};
	let text = '';		
	for (let key in json) {
		let valor = json[key];
		if (typeof valor == 'object') {
			text += `<details>
	<summary>${key}: <span class="tipo">${valor.constructor.name}</span></summary>
	${creaJson(valor)}
</details>
			`;
		} else if (typeof valor == 'number'){
			text += `<p><span class="key">${key}</span>: <span class="numero">${valor}</span></p>`;
		} else if (typeof valor == 'string'){
			text += `<p><span class="key">${key}</span>: <span class="cadena">"${valor}"</span></p>`;
		} else if (typeof valor == 'function') {
			text += `<p><span class="key">${key}</span>: <span class="funcion"> funcion()</span></p>`;
		}
	}
	return text;
}

function imprimeJson(json) {
	return 	creaJson({objecto: json});
}

/**
 * 
 * @param {HTMLElement} _div 
 */
export function setDivConsola(_div) {
    _div;
    _div.attachShadow({ mode: 'open'});
    _div.shadowRoot.innerHTML = `
        <style>
        ${cssConsola}
        </style>
        
        <style>
        ${creaEstilos()}
        </style>
		<div class="variables main" style="height: 0px; visibility: hidden;">
			<div class="encabezado-consola">
				<div class="titulo">Logger</div> 
				<div class="acciones">
				<span title="limpiar" id="limpiar">&empty;</span>
				<span title="cerrar" id="cerrar">&#x2B07;</span>
				</div>				
			</div>
            <div class="console"></div>
		</div>
		<div class="footer">
		<span class="show-consola">Logger</span>
			<div class="acciones">
				<span title="mostrar " id="show">&#x2B06;</span>
			</div>		
		</div>
	`;
	mainDiv = _div;
	div = _div.shadowRoot.querySelector('.console');
	let limpia = _div.shadowRoot.querySelector('span#limpiar')	;
	let showConsola = _div.shadowRoot.querySelector('span#show');
	let cerrar = _div.shadowRoot.querySelector('span#cerrar');
	let footer = _div.shadowRoot.querySelector('.footer');
	setEventShowConsola(showConsola, _div, footer);
	setEventoLimpiar(limpia);
	cerrarEvento(cerrar, _div, footer);
}

function setEstilosMostrar(main,footer) {
	footer.style.visibility = 'hidden';
	main.style.visibility = 'visible';
	main.style.height = "600px";
}

function setEstilosOcultar(main,footer) {
	main.style.height = "0";
	main.style.visibility = 'hidden';
	footer.style.visibility = 'visible';
}

export function muestraOcultaConsola() {
	let footer = mainDiv.shadowRoot.querySelector('.footer');
	let main = mainDiv.shadowRoot.querySelector('.main');
	console.log(main.style.visibility);
	//esta oculto
	if (main.style.visibility === 'hidden') {
		setEstilosMostrar(main, footer);
	} else {
		setEstilosOcultar(main, footer);
	}
}

function cerrarEvento(cerrar, _div, footer) {
	let main = _div.shadowRoot.querySelector('.main');
	cerrar.addEventListener('click', ev => {
		setEstilosOcultar(main, footer);
	});
}

function setEventShowConsola(show, _div, footer) {
	let main = _div.shadowRoot.querySelector('.main');
	show.addEventListener('click', ev => {
		setEstilosMostrar(main, footer);
	});
}

function setEventoLimpiar(limpiar) {
	limpiar.addEventListener('click', ev => {
		div.innerHTML = '';
	});
}

function renderLinea(datos) {
	let text = '';
	for (let dato of datos) {
		if (typeof dato == 'object') {
			if ( dato instanceof Date ) {
				text += dato;
			} else if (dato){
				text += imprimeJson(dato);
			}			
		}
		else if (typeof dato == 'number') {
			text += `<span class="numero">${dato}</span>&nbsp;`
		}
		else if (typeof dato == 'string') {
			text += `<span class="cadena">${dato}</span>&nbsp;`
		}
		else if (typeof dato == 'function') {
			text += `<span class="funcion">funcion()</span>`
		}
	}
	return text;
}

function validadDiv() {
    if (!div) {
        throw 'Defina el div contenedor de la consola';
    }
}

function mueveScrollFondo() {
	div.scrollTop = (div.scrollHeight - div.clientHeight);
}

function creaLinea(tipo,datos) {
	let linea = document.createElement('div');
	linea.classList.value = tipo;	
	linea.innerHTML = renderLinea(datos);
	div.append(linea);
	mueveScrollFondo();
}

export function logger(...datos) {
    validadDiv();	
	creaLinea('linea', datos);
}

export function logError(...datos) {
	validadDiv();
	creaLinea('linea error', datos);	
}
export function logWarn(...datos) {
	validadDiv();
	creaLinea('linea warning', datos);	
}
