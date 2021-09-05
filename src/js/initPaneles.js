let sizes = localStorage.getItem('split-sizes')

if (sizes) {
    sizes = JSON.parse(sizes);
} else {
    sizes = [50, 50];
}

Split(['#tabs-jar', '#panel'], {
    sizes: sizes,
    minSize: 400,
    gutterSize: 8,
    onDragEnd: function (sizes) {
        localStorage.setItem('split-sizes', JSON.stringify(sizes))
    },
});
