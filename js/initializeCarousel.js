export function initializeCarousel(imageArray) {

    const rightButton = document.getElementById('right-btn');
    const leftButton = document.getElementById('left-btn');
    const imgElement = document.getElementById('carousel');

    const carouselElementPosition = document.getElementById('carousel-count-current');
    const carouselTotalElements = document.getElementById('carousel-count-total');
    carouselElementPosition.innerText = 1;
    carouselTotalElements.innerText = imageArray.length;

    let position = 0;
    imgElement.src = imageArray[position];

    const updateImage = () => {
        imgElement.src = imageArray[position];
        carouselElementPosition.innerText = position + 1;
        carouselTotalElements.innerText = imageArray.length;
    };

    if (imageArray.length == 1) {
        carouselElementPosition.innerText = 1;
        carouselTotalElements.innerText = imageArray.length;

        rightButton.style.display = 'none';
        leftButton.style.display = 'none';

    } else {
        rightButton.addEventListener('click', () => {
            position = (position + 1) % imageArray.length;
            updateImage();

        });
        leftButton.addEventListener('click', () => {
            position = (position - 1 + imageArray.length) % imageArray.length;
            updateImage();
        });
    }
}
