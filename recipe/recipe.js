const urlParams = new URLSearchParams(location.search);
let meal = {};
let mealId = urlParams.get('mealId');

fetchMealByID(mealId);


async function fetchMealByID(mealId) {
    try {
        let url = mealDBAPI.baseURL + mealDBAPI.api.mealDetailsByID + mealId;
        fetch(url).then((res) => {
            return res.json();
        }).then((data) => {
            if (data['meals'].length > 0) {
                meal = data['meals'][0];
                let name = document.getElementsByClassName('recipe-header')[0];
                name.innerHTML = meal['strMeal'];

                let img = document.getElementById('recipe-thumbnail');
                img.setAttribute('src', meal['strMealThumb']);
                img.setAttribute('alt', meal['strMeal']);

                let ingClass = document.getElementsByClassName('ingredients')[0];
                let ingParaTag = document.createElement('p');
                ingParaTag.innerHTML = sanitizeRecipeIngredients(meal);
                ingClass.appendChild(ingParaTag);
                let descClass = document.getElementsByClassName('description')[0];
                let instructionsParaTag = document.createElement('p');
                instructionsParaTag.innerHTML = sanitizeRecipeString(meal['strInstructions']);
                descClass.appendChild(instructionsParaTag);
            }

        }).catch(err => new Error(err));

    } catch (error) {
        console.error(error);
    }
};


function sanitizeRecipeString(recipeString) {
    let responseString = '<h2>Instructions</h2><ol>';
    recipeString = recipeString.replaceAll("\r\n", '');
    const steps = recipeString.split(/STEP \d+/); // Split the string into an array of steps
    const filteredSteps = steps.filter(step => step.trim() !== ''); // Filter out any empty strings
    const trimmedSteps = filteredSteps.map(step => step.trim()); // Trim leading and trailing whitespace from each step
    trimmedSteps.forEach((step, index) => {
        responseString += `<li>${step} </li>`;
    });
    responseString += `</ol>`;
    return responseString;
};

function sanitizeRecipeIngredients(meal) {
    let ingredientMap = new Map();
    let responseMap = new Map();
    let responseString = `<h2>Ingredients</h2><ol>`
    for (const key in meal) {

        if ((key.includes('strIngredient') || key.includes('strMeasure')) && !!meal[key].trim()) {
            let numberIdentifier = key.match(/\d+/);
            if (numberIdentifier) {
                const number = parseInt(numberIdentifier[0], 10);
                if (key.includes('strIngredient')) {
                    ingredientMap.set(number, meal[key]);
                } else {
                    let newKey = ingredientMap.get(number);
                    if (newKey) {
                        responseMap.set(newKey, meal[key])
                    }
                }
            }
        }
    }

    responseMap.forEach((value, key) => {
        responseString += `<li>${key} - ${value}</li>`
    });
    responseString += `</ol>`;
    ingredientMap.clear();
    responseMap.clear();
    return responseString
}