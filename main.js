let recipes = [];
let tileData = [];
let slideIndex = 1;
let slider = document.getElementById('slider');
let dots = document.getElementById('dots');
let tilesDiv = document.getElementById('tiles');
let idMeal;
let environment = window.location.hostname;
fetchLatestMeals();
loadSlides(slideIndex);
function loadSlides(n) {
    recipes.forEach((element, id) => {
        let mySlidesDiv = document.createElement('div');
        mySlidesDiv.setAttribute('class', 'mySlides fade');

        let img = document.createElement('img');
        img.setAttribute('src', element.strMealThumb);
        img.addEventListener('click', (ev) => {
            idMeal = element.idMeal;
            // if (environment == '127.0.0.1' || environment == 'localhost') {
            window.location.href += 'recipe/recipe.html?mealId=' + idMeal;
            // } else {
            //     window.location.href = 
            // }
        });

        let nameDiv = document.createElement('div');
        nameDiv.setAttribute('class', 'name');
        nameDiv.innerHTML = element.strMeal;

        mySlidesDiv.appendChild(img);
        mySlidesDiv.appendChild(nameDiv);
        slider.appendChild(mySlidesDiv);


        let dot = document.createElement('span');
        dot.setAttribute('class', 'dot');
        dot.addEventListener('click', (ev) => {
            showSlides(slideIndex = id + 1);
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

async function fetchLatestMeals() {
    recipes = latestMeals;
    searchMeal('');
};

async function searchMeal(searchString) {
    try {
        let url = mealDBAPI.baseURL + mealDBAPI.api.searchByName + searchString;
        fetch(url).then((res) => {
            return res.json();
        }).then((data) => {
            if (data['meals'].length > 0 && data['meals'] !== null) {
                tilesDiv.innerHTML = '';
                tileData = data['meals'];

                tileData.forEach((data, i) => {
                    let recipeTileDiv = setRecipeTileDiv(data)
                    tilesDiv.appendChild(recipeTileDiv);

                    let tileDiv = setTileDiv();
                    recipeTileDiv.appendChild(tileDiv);

                    let childSpan = setSpan(data);
                    tileDiv.appendChild(childSpan);
                });
            }
        }).catch(err => new Error(err));
    } catch (error) {
        console.error(error);
    }
}

function setRecipeTileDiv(data) {
    try {
        let recipeTileDiv = document.createElement('div');
        recipeTileDiv.setAttribute('class', 'recipe-tile');
        const gradient = 'linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.3))';
        const imageURL = `url("${data['strMealThumb']}")`;
        recipeTileDiv.style.backgroundImage = `${gradient}, ${imageURL}`;
        recipeTileDiv.addEventListener(('mouseenter'), (ev) => {
            recipeTileDiv.style.backgroundImage = imageURL;
        });
        recipeTileDiv.addEventListener(('mouseleave'), (ev) => {
            recipeTileDiv.style.backgroundImage = `${gradient}, ${imageURL}`;
        });
        recipeTileDiv.addEventListener(('click'), (ev) => {
            idMeal = data.idMeal;
            window.location.href += 'recipe/recipe.html?mealId=' + idMeal;
        });
        return recipeTileDiv;
    } catch (error) {
        console.error(error);
    }
}

function setTileDiv() {
    let tileDiv = document.createElement('div');
    tileDiv.setAttribute('class', 'tile');
    return tileDiv;
}

function setSpan(data) {
    let childSpan = document.createElement('span');
    childSpan.innerHTML = data['strMeal'];
    return childSpan;
}

async function searchRecipe(searchString) {
    if (searchString.length >= 3) {
        searchMeal(searchString);
    } else {
        searchMeal('');
    }
}

// Debounce function to delay search execution
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            func.apply(context, args);
        }, wait);
    };
}

// Create a debounced version of the search function
const debouncedSearch = debounce(function () {
    const query = searchInput.value;
    searchRecipe(query); // Replace this with your actual search logic
}, 2000);

let searchInput = document.getElementById('searchStr');
searchInput.innerHTML = '';
searchInput.addEventListener(('input'), debouncedSearch);