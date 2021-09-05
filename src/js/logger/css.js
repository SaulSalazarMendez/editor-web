export const cssConsola = /*css*/`
.main{  
    visibility: hidden;  
    background: white;
    position: fixed;
    width: 400px;
    max-height: 600px;
    height: 0px;
    bottom: 5px;
    right: 0;    
    border: solid 1px black;
    overflow-y: visible;
    transition: height 0.5s;
}
.footer{
    padding-left: 5px;
    position: fixed;
    background: #009688;
    bottom: 5px;
    right: 0;
    border: solid 1px black;
    width: 400px;
    height: 18px;
    color: white;
}
.linea {
	margin-top: 4px;
    font-size: 11px;
    font-family: monospace;
    display: flex;
    border-bottom: solid 1px var(--color-linea);
	
}

.error {
	background-color: var(--fondo-error);
}
.warning {
	background-color: var(--fondo-warning);
}

.console {
    counter-reset: numlinea;
}

.linea::before {
    counter-increment: numlinea;
    content: "[" counter(numlinea) "]: ";    
    font-weight: bold;
    width: 50px;
}

details {
	margin-left: 15px;
	font-family: monospace;	
}
details > summary {
	list-style-type: none;
    padding-left: 4px;
    width: 200px;    
    border: none;
    cursor: pointer;
}

details > summary > .tipo {
	color: var(--color-tipo);
}

details > p {    
    padding: 4px;
    margin: 0;
    margin-left: 15px;
}

details > p > .key {
    color: var(--color-key);;
}

details > p > .objecto {
    color: var(--color-objecto);;
}

details > p > .cadena, .linea > .cadena {
    color: var(--color-string);
}
details > p > .numero, .linea > .numero {
    color: var(--color-numero);
}

details > p > .funcion, .linea > .funcion {
    color: var(--color-tipo);
}

details > summary::before {
    content: var(--simbolo-expandir);
    color: blue;
}

details[open] > summary::before {
    content: var(--simbolo-contraer);
    color: red;
}
.console{
    overflow-y: auto;
    max-height: 560px;
    height: 560px;
    max-width: 400px;
}
.encabezado-consola{
    border-bottom: 1px solid black;
    height: 18px;
    background: #009688;
    color: white;
}
.titulo{
    float: left;
    margin-left: 5px;
}
.acciones{
    float: right;
    margin-right: 5px;
}
.acciones > span {
    border: solid 1px black;
    font-size: 12px;
    cursor: pointer;
    color: black;
    background-color: white;
}

.acciones > span:hover {    
    color:blue;
}
`;
