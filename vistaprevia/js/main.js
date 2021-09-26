let div = document.querySelector('#main');
let codigo = location.href.split('#')[1];
if (codigo) {    
    let doc = JSON.parse( LZString.decompressFromBase64(codigo));
    [html, css, js] = doc.codigo;
    div.innerHTML = '<iframe></iframe>';
    let iframe = div.querySelector('iframe');
    iframe.contentDocument.open();
    let texthtml = `
    |<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <style>
        ${css}
    </style>
    <body>
        ${html}
    </body>    
    <script type="module">
        ${js}
    </script>    
            `    
    try {
        iframe.contentDocument.write(texthtml);        
    } catch (error) {
        console.log(error);
    } finally {
        iframe.contentDocument.close();
    }
}

let btn = document.querySelector('#editar');
if (codigo){
    btn.addEventListener('click', ()=>{
        window.open('https://saulsalazarmendez.github.io/ejemplos/try-coding/#'+codigo);
    });
} else {
    btn.remove();
}
