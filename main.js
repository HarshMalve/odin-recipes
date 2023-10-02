const recipes = [
    {
        id: 1,
        name: "lasagna",
        url: "./recipes/lasagna/lasagna.html",
        image: "./recipes/lasagna/lasagna.webp"
    },
    {
        id: 2,
        name: "Recipe 2",
        url: "./recipes/lasagna/lasagna.html",
        image: "./recipes/lasagna/lasagna.webp"
    },
    {
        id: 3,
        name: "Recipe 3",
        url: "./recipes/lasagna/lasagna.html",
        image: "./recipes/lasagna/lasagna.webp"
    },
];
let slideIndex = 1;
let slider = document.getElementById('slider');
let dots = document.getElementById('dots');

loadSlides(slideIndex);

function loadSlides(n) {
    recipes.forEach((element, id) => {
        let mySlidesDiv = document.createElement('div');
        mySlidesDiv.setAttribute('class', 'mySlides fade');

        let img = document.createElement('img');
        img.setAttribute('src', element.image);
        img.addEventListener('click', (ev) => {
            window.location.href = element.url;
        });

        let nameDiv = document.createElement('div');
        nameDiv.setAttribute('class', 'name');
        nameDiv.innerHTML = element.name;

        mySlidesDiv.appendChild(img);
        mySlidesDiv.appendChild(nameDiv);
        slider.appendChild(mySlidesDiv);


        let dot = document.createElement('span');
        dot.setAttribute('class', 'dot');
        // dot.setAttribute('')
        dot.addEventListener('click', (ev) => {
            showSlides(slideIndex = element.id);
        });
        dots.appendChild(dot);
    });

    showSlides(slideIndex = n);


};

function showSlides(n) {
    let slides = document.getElementsByClassName('mySlides');
    let dotDiv = document.getElementsByClassName('dot');
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (let i = 0; i < slides.length; i++) {
        const element = slides[i];
        element.style.display = 'none';
    }
    for (let index = 0; index < dotDiv.length; index++) {
        const element = dotDiv[index];
        element.className = element.className.replace(' active', '');
    }
    slides[slideIndex - 1].style.display = 'block';
    dotDiv[slideIndex - 1].className += ' active';
};

function plusSlides(n) {
    showSlides(slideIndex += n);
}