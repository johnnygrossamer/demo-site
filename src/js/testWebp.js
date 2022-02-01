function testWebP(callback) {
    let webP = new Image();
    webP.src ="data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    webP.onload = webP.onerror = function () {
        callback(webP.height === 2);
    };
}

document.addEventListener("DOMContentLoaded", () => {
    testWebP(function (support) {
        if (support === true) {
            document.querySelector('body').classList.add('webp');
        }else{
            document.querySelector('body').classList.add('no-webp');
        }
    });
}, false)