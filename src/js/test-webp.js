function testWebp() {
    let webP = new Image();
    webP.src ="data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    webP.onload = webP.onerror = function () {
        if(webP.height === 2){
            document.querySelector('body').classList.add('webp');
        }else{
            document.querySelector('body').classList.add('no-webp');
        }
    };
}

document.addEventListener("DOMContentLoaded", () => {
    testWebp();
}, false)