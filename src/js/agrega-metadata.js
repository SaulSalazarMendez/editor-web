export function agregaMetada(documento) {
    let metaTitulo = document.querySelector('meta[property="og:title"]');
    metaTitulo.setAttribute('content', 'Try coding - '+documento.titulo);    
}