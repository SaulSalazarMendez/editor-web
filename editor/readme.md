# Editor Web

Es la base para tener un play ground web.
Con este voy a crear la version para crear modelos sql y mi creador rápido de prototipos.

## Consideraciones

Al momento de usar parcel hay un error. El problema es que descontinuaron a parcel y no lo estan
actualizando con los nuevos paquetes.
La solución de momento es no minificar el build *--no-minify* y minificar despues(ver el archivo build.sh).

## Probar el entorno local

Hay dos formas de hacer esto:
- mediante el *package.json* con el npm start. 
- Usando un webserver. Para hacer esto se tiene que modficar el archivo libs.js y descomentar las lineas comentadas y comentar las que no estaban comentadas.


## Agregar librerias npm

Se pueden agregar de dos maneras:
- npm install
- poniendola como un cdn por medio de unpack.


## TODO

- Separar el codigo para que el editor quede como un webcomponente
- Separar el codigo para que la consola quede como un div y web componente