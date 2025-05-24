import startAparts from "./aparts.js";


const apartmentsContainer = document.getElementById('apartments-container');

const modal = document.getElementById("modal");
const modalApartCard = document.getElementById("modal-apart-card");
const modalClose = document.querySelector(".modal-close");

const fullSizeModal = document.getElementById("fullsize-modal");

const emptyListButton = document.getElementById('empty-list-button')

let newContactFormData;

const contactForm = document.getElementById('contact-form');

function getContactFormData() {

    newContactFormData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value,
        time: new Date()
    };
    return newContactFormData;
}


contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    getContactFormData();
    const storedContactFormData = JSON.parse(localStorage.getItem('contactFormData')) || []; storedContactFormData.push(newContactFormData);
    localStorage.setItem('contactFormData', JSON.stringify(storedContactFormData));

    contactForm.reset();
    document.getElementById("message").innerText = "";
    document.getElementById('message').placeholder = 'I want to get more information about....';
    messageSnackbar('Your message has been send');
})


let storedLocalData = localStorage.getItem('savedApartsArray');

let aparts = [];

if (storedLocalData) {
    aparts = JSON.parse(storedLocalData);
} else {

    localStorage.setItem("savedApartsArray", JSON.stringify(startAparts));
    storedLocalData = localStorage.getItem('savedApartsArray');
    aparts = JSON.parse(storedLocalData);
}


function updateSavedArray() {
    localStorage.setItem("savedApartsArray", JSON.stringify(aparts));
}

document.querySelector('.sort-buttons-dropdown').addEventListener('click', () => document.getElementById("sortButtons").classList.toggle("show"))


let activeArray = aparts;

function arraySort(value, order) {
    if (activeArray.length == 0) {
        return;
    } else {
        if (value === 'price') {
            activeArray.sort((a, b) => {
                return order === 'ascending' ? a.price - b.price : b.price - a.price;
            })
            apartmentsContainer.innerHTML = ''
            activeArray.forEach(renderApartment);
        } else if (value === 'added') {
            activeArray.sort((a, b) => {
                return order === 'ascending' ? new Date(b.added) - new Date(a.added) : new Date(a.added) - new Date(b.added);
            })

            apartmentsContainer.innerHTML = ''; activeArray.forEach(renderApartment)
        }
    }
}


window.onclick = function (event) {
    if (!event.target.matches('.sort-buttons-dropdown')) {
        document.getElementById("sortButtons").classList.remove('show');
    }
}


const sortButtons = document.querySelectorAll('.sort-button');

sortButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        sortButtons.forEach(item => {
            item.classList.remove('active-sort');
        });
        this.classList.add('active-sort');
        switch (this.id) {
            case 'sort-cheaper': arraySort('price', 'ascending');
                break;
            case 'sort-expensive': arraySort('price', 'descending');
                break;
            case 'sort-newer': arraySort('added', 'ascending');
                break;
            case 'sort-older': arraySort('added', 'descending');
                break;
        }
    });
});


function closeModal() {
    const modalWindow = document.getElementById(`apartment-${modalClose.id}`);

    if (!modalWindow) return;

    document.body.style.position = '';
    document.body.style.top = '';
    modalWindow.scrollIntoView({ block: "center", behavior: 'instant' });
    modal.style.display = "none";
    modalApartCard.innerHTML = "";

    const isMainPageActive = document.getElementById('savedAparts').classList.contains('active-page') || document.getElementById('savedApartsBurger').classList.contains('active-page');

    emptyListButton.style.visibility = isMainPageActive ? 'visible' : 'hidden';
}

modalClose.addEventListener("click", closeModal);

function handleEscapeBtn(event) {
    if (event.key === 'Escape') {
        if (fullSizeModal.style.display == "block") {
            fullSizeModal.style.display = "none";
        } else {
            closeModal();
        }
    }
}

function messageSnackbar(message) {
    const snackbar = document.getElementById("snackbar");
    snackbar.innerHTML = message;
    snackbar.className = "show";
    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 1500);
}


function updateSavedApartmentsCounter() {
    const savedApartmentsCount = aparts.filter(apart => apart.saved === 1).length;
    const counterElement = document.querySelector('.counter');
    const currentCount = parseInt(counterElement.innerText, 10);

    if (currentCount !== savedApartmentsCount) {
        counterElement.classList.add('scale-up');
        setTimeout(() => {
            counterElement.classList.remove('scale-up');
            counterElement.innerText = savedApartmentsCount;
        }, 300);
    }
}


function generateApartmentContent(apart) {
    return `
<div class="apartment-card-top">
    <div class="apartment-image-overlay">
        <p class="added-time">Added ${apart.added}</p>           
    </div>
    <img class="apartment-image" src=${apart.image[0]} alt=${apart.details} style="width:300px;height:200px;">
</div>
<div class="card-footer">
        <p class="apartment-price">${apart.price} ${apart.currency}</p>
        <p class="apartment-adress">${apart.adres}</p>
        <p class="apartment-details">${apart.details}</p>
</div>
`;
}

function generateModalContent(apart) {
    const isSaved = apart.saved === 1 ? 'yes' : 'no ';
    const buttonText = apart.saved === 1 ? 'Remove' : 'Save';
    const isSavedButton = `<button id="modal-is-saved-button">${buttonText}</button>`;
    modalClose.id = apart.id;
    return `

<div class="modal-image-container">
    
    <button id="left-btn"><i class="fas fa-arrow-left"></i></button>
    <span class="carousel-count"><span id="carousel-count-current">0</span>/<span id="carousel-count-total">0</span></span>
    <img id="carousel" src="" alt="">
    <button id="right-btn"><i class="fas fa-arrow-right"></i></button>
</div>
<hr>
<p class="modal-apartment-details"><strong>Description: </strong><br>${apart.details}</p>
        <p class="modal-apartment-adress"><strong>Location: </strong><br>${apart.adres}</p>
<p class="modal-apartment-price"><strong>Price: </strong><br>${apart.price} ${apart.currency}/per month</p>
<p class="modal-apartment-size"><strong>Size: </strong><br>${apart.size} sq. m.</p>
<p class="modal-added-time" ><strong>Was added: </strong><br><span class="modal-added-time-text">${apart.added}</span></p>           
<p class="modal-apartment-category"><strong>Real estate category: </strong><br>for ${apart.category}</p>
         <p class="modal-apartment-id"><strong>Offer ID number: </strong><br> ${apart.id}</p>
        <hr>
        <p class="modal-apartment-in-list"><strong>Saved in Your List: </strong><br>${isSaved}${isSavedButton}</p>
  `;
}


function handleSaveButtonClick(apart) {
    apart.saved = apart.saved === 1 ? 0 : 1;
    updateApartmentCard(apart);
    updateSavedApartmentsCounter();
    updateSavedArray();
}

function createSaveButton(apart) {
    const saveButton = document.createElement('button');
    saveButton.classList.add('btn', 'save-button', apart.saved === 1 ? 'saved' : 'not-saved');
    saveButton.innerHTML = `<span class="fa fa-home"></span>`;

    saveButton.addEventListener('click', function (event) {
        event.stopPropagation();
        handleSaveButtonClick(apart);
        messageSnackbar("Your list was updated");
    });



    return saveButton;
}

function handleDetailsButtonClick(apart) {
    document.body.style.position = 'fixed';
    document.addEventListener('keydown', handleEscapeBtn);
    modal.style.display = 'block';
    renderModalApartment(apart);
    openFullSizeModal();
    emptyListButton.style.visibility = 'hidden';
}

function createDetailsButton(apart) {
    const detailsButton = document.createElement('button');
    detailsButton.classList.add('details-button');
    detailsButton.innerText = 'Show details';

    detailsButton.addEventListener('click', function (event) {
        event.stopPropagation();
        handleDetailsButtonClick(apart);
    });
    return detailsButton;
}


function datesCount(dateAdded) {
    const daysDifference = Math.floor((new Date() - new Date(dateAdded)) / (1000 * 60 * 60 * 24));
    return daysDifference === 0 ? 'today' : `${daysDifference} days ago`;
}

function renderApartment(apart) {
    const apartDiv = document.createElement('div');
    apartDiv.classList.add('apartment-card');
    apartDiv.classList.add(apart.status);
    apartDiv.setAttribute('id', `apartment-${apart.id}`);
    apartDiv.addEventListener('click', () => handleDetailsButtonClick(apart));
    apartDiv.innerHTML = generateApartmentContent(apart);

    const imageOverlayDiv = apartDiv.querySelector('.apartment-image-overlay');

    const saveButton = createSaveButton(apart);

    imageOverlayDiv.appendChild(saveButton);
    const detailsButton = createDetailsButton(apart);

    apartDiv.appendChild(detailsButton);

    apartmentsContainer.appendChild(apartDiv);

    if (apart.status == "reserved") {
        const reservedText = document.createElement('span');
        reservedText.classList.add('reserved-text');
        reservedText.innerText = apart.status.toUpperCase(); apartDiv.appendChild(reservedText);
    }


}


function modalIsSavedButtonClick(apart) {
    handleSaveButtonClick(apart);
    messageSnackbar("Your list updated");
    modalApartCard.innerHTML = "";
    renderModalApartment(apart);
};


function renderModalApartment(apart) {
    const modalApartDiv = document.createElement('div');
    modalApartDiv.classList.add('modal-apartment-card');
    modalApartDiv.setAttribute('id', `modal-apartment-${apart.id}`);
    modalApartDiv.innerHTML = generateModalContent(apart);
    const imageOverlayDiv = modalApartDiv.querySelector('.apartment-image-overlay');
    modalApartCard.appendChild(modalApartDiv);
    initializeCarousel(apart.image);
    document.querySelector(".modal-added-time-text").innerHTML = datesCount(apart.added)
    const modalIsSavedButton = document.getElementById("modal-is-saved-button")
    modalIsSavedButton.addEventListener('click', () => modalIsSavedButtonClick(apart));



    const handleOrderButtonClick = () => {
        closeModal();
        contactForm.scrollIntoView({ behavior: "smooth" });

        document.getElementById("message").innerText = `I want to get more information about your offer (#${apart.id}). Please call or text to me so I can get details and made an appointment.`;
        messageSnackbar(`Please fill in the form`);
    };


    const orderButton = document.createElement('button');
    orderButton.classList.add('order-button');
    orderButton.innerText = 'Get more info';
    orderButton.addEventListener('click', handleOrderButtonClick);
    modalApartDiv.appendChild(orderButton);
}


function updateApartmentCard(apart) {
    const apartDiv = document.getElementById(`apartment-${apart.id}`);
    apartDiv.innerHTML = generateApartmentContent(apart);
    const imageOverlayDiv = apartDiv.querySelector('.apartment-image-overlay');
    const saveButton = createSaveButton(apart);
    const detailsButton = createDetailsButton(apart);

    if (imageOverlayDiv) {
        imageOverlayDiv.appendChild(saveButton);
    }
    apartDiv.appendChild(detailsButton);
}

aparts.forEach(renderApartment);

updateSavedApartmentsCounter();
updateSavedArray();

document.getElementById("contact-form-button-reset").addEventListener('click', () => {
    document.getElementById("message").innerText = "";
});

const burgerNavBar = document.getElementById("burger-nav");

const burgerIcon = document.querySelector(".burger-icon");

function burgerTrigger() {
    burgerNavBar.style.left === "0px" ? burgerNavBar.style.left = "-200px" : burgerNavBar.style.left = "0";
}

burgerIcon.addEventListener("click", burgerTrigger);


function burgerMenuClose() {
    burgerNavBar.style.left = "-200px"
}

const burgerMenu = document.querySelector(".burger-nav-list");

document.addEventListener("mouseup", function (event) {
    if (!burgerIcon.contains(event.target) && !burgerMenu.contains(event.target)) {
        burgerMenuClose();
    }
});


const burgerLinks = document.querySelectorAll(".burger-nav-list a");

burgerLinks.forEach(link => {
    link.addEventListener("click", burgerMenuClose);
});


function generateEmptyContent() {
    return `
            <div class="apartment-card" >
    <div class="apartment-card-top">
    <img class="apartment-image" src="https://studioopinii.pl/wp-content/uploads/2016/01/list.jpg" alt="empty list" style="width:300px;height:200px;">
</div>
<div class="card-footer">
        <p class="apartment-price">Your list is empty</p>
        <p class="apartment-details">Explore the full list of our offers</p>
<button class="order-button" id="show-full-list-btn">Show full list</button>
       </div>
</div>
    `;
}

function fullListBtnTrigger() {
    const fullListBtn = document.getElementById('show-full-list-btn')
    fullListBtn.addEventListener('click', showFullList);
}

function showFullList() {

    document.getElementById('burger-aparts').click();
    document.getElementById('savedAparts').classList.remove('active-page');
    document.getElementById('aparts').classList.add('active-page');
}

const ArrayLinks = document.querySelectorAll('.savedAparts, .businessAparts, .livingAparts, .aparts');

ArrayLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        closeModal();

        const allAparts = aparts;
        const businessAparts = aparts.filter(apartment => apartment.category === 'business');
        const livingAparts = aparts.filter(apartment => apartment.category === 'living');
        const savedAparts = aparts.filter(apartment => apartment.saved === 1);

        const apartmentsMap = {
            aparts: aparts,
            businessAparts: businessAparts,
            livingAparts: livingAparts,
            savedAparts: savedAparts
        };

        const arrayName = event.target.className;

        const apartmentsArray = apartmentsMap[arrayName];
        window.scrollTo(0, 0);
        messageSnackbar(`Offers in this category: <span class="offers-count-number">${apartmentsArray.length}<span>`)

        emptyListButton.style.visibility = (arrayName == 'savedAparts') ? "visible" : "hidden";

        if (arrayName == 'aparts') {

            document.querySelector('.page-title').style.transform = `translateY(0)`;
            document.querySelector('.apartments-container').style.transform = `translateY(0)`;
        } else {

            document.querySelector('.page-title').style.transform = `translateY(-400px)`;
            document.querySelector('.apartments-container').style.transform = `translateY(-260px)`;

        }

        if (apartmentsArray.length == 0) {

            apartmentsContainer.innerHTML = generateEmptyContent();
            fullListBtnTrigger()
        } else {
            apartmentsContainer.innerHTML = '';
            apartmentsArray.forEach(renderApartment);
            activeArray = apartmentsArray;
        }

    });
});


const menuLinks = document.querySelectorAll('.header-nav-list li a, .burger-nav-list li a');

menuLinks.forEach(link => {

    link.addEventListener('click', function (event) {
        menuLinks.forEach(item => {
            item.classList.remove('active-page');
        });
        this.classList.add('active-page');
    });

});



function initializeCarousel(imageArray) {

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


function emptySavedList() {
    aparts.forEach(apart => {
        if (apart.saved === 1) {
            apart.saved = 0;
        }
    });
    updateSavedApartmentsCounter();
    updateSavedArray();
    apartmentsContainer.innerHTML = generateEmptyContent();
    fullListBtnTrigger();
    activeArray = [];
    window.scrollTo(0, 0);
}

emptyListButton.addEventListener("click", emptySavedList);

function openFullSizeModal() {
    const imageForModal = document.getElementById("carousel");
    const modalFullSizeImg = document.getElementById("fullsize-modal-image");

    imageForModal.onclick = function () {
        fullSizeModal.style.display = "block";
        modalFullSizeImg.src = this.src;
    }

    fullSizeModal.onclick = () => { fullSizeModal.style.display = "none" };
}
