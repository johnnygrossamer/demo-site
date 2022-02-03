function animatePage() {
    const animateItems = document.querySelectorAll('._anim');
    if (animateItems.length === 0) return;
    window.addEventListener('scroll', () => animateOnScroll(animateItems), false);
    setTimeout(() => animateOnScroll(animateItems), 300);
}

function animateOnScroll(animateItems){
    for (let i=0; i<animateItems.length; i++){
        const element = animateItems[i],
            elementHeight = element.offsetHeight,
            elementOffset = offset(element).top,
            animateStart = 4;
        let elementPoint = window.innerHeight - elementHeight / animateStart;
        if (elementHeight > window.innerHeight){
            elementPoint = window.innerHeight - window.innerHeight / animateStart;
        }
        if ((pageYOffset > elementOffset - elementPoint) && pageYOffset < (elementOffset + elementHeight)){
            element.classList.add('_complete');
        } else {
            if (element.classList.contains('_anim-repeat')){
                element.classList.remove('_complete');
            }
        }
    }
}

function offset(el){
    const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

document.addEventListener("DOMContentLoaded", () => {
    animatePage();
}, false);