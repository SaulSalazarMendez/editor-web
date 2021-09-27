let sizes = localStorage.getItem('split-sizes');

if (sizes) {
    sizes = JSON.parse(sizes);
} else {
    sizes = [50, 50];
}

export function setSizeVistaPrevia() {    
    let vistaPrevia = document.querySelector('.vista-previa');
    const size = `${vistaPrevia.clientWidth} x ${vistaPrevia.clientHeight}`;
    let divsize = document.querySelector('#size');
    divsize.innerHTML = size;
}

Split(['#tabs-jar', '#panel'], {
    sizes: sizes,
    minSize: 400,
    gutterSize: 8,
    onDragEnd: function (sizes) {
        localStorage.setItem('split-sizes', JSON.stringify(sizes));        
    },
    onDrag: function () {
        setSizeVistaPrevia();
    }
});

window.addEventListener('resize', ()=> {
    setSizeVistaPrevia();
})
