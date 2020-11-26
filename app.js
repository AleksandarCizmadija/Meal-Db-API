const randomBtn = document.querySelector('#random'),
    selectCategory = document.querySelector('#category'),
    htmlDiv = document.querySelector('#html'),
    footer = document.querySelector('footer');

randomBtn.addEventListener('click', generateRecepie);

async function generateRecepie() {
    try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await res.json();
        showMeal(data.meals[0]);
    } catch (e) {
        console.log(e);
    }
}

async function listCategories() {
    try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const data = await res.json();
        insertOptions(data.meals)

    } catch (e) {
        console.log(e);
    }
}
listCategories()

function insertOptions(categories) {
    const arrOpt = []
    categories.forEach(cat => {
        const opt = document.createElement('option')
        opt.innerText = cat.strCategory;
        opt.value = cat.strCategory;
        selectCategory.appendChild(opt);

        selectCategory.addEventListener('change', fetchCategory)
    })
}

async function fetchCategory(e) {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${e.target.value}`)
        const data = await res.json();
        showCategory(data.meals, e.target.value);
    } catch (e) {
        console.log(e);
    }
}

function showCategory(meals, name) {
    footer.style.bottom = '0'

    htmlDiv.innerHTML = `
        <h1>${name}</h1>
        <div class="cards"></div>
    `;

    cards = document.querySelector('.cards');

    meals.forEach(meal => {
        const card = document.createElement('div');
        card.classList = 'card';
        card.setAttribute('data-id', meal.idMeal);
        card.innerHTML = `
            <h2 data-id="${meal.idMeal}">${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="" data-id="${meal.idMeal}">
        `
        cards.appendChild(card);
    })
    cards.addEventListener('click', showReceipeByID);
}

function showReceipeByID(e) {
    if (e.target.classList.contains('card') || e.target.parentElement.classList.contains('card')) {
        fetchById(e.target.dataset.id);
    }
}

async function fetchById(id) {
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();

        showMeal(data.meals[0]);
    } catch (e) {
        console.log(e);
    }
}


function showMeal(meal) {
    selectCategory.selectedIndex = 0;

    footer.style.position = 'static';
    const mealName = meal.strMeal,
        mealDesc = meal.strInstructions,
        mealArticle = meal.strSource,
        mealImg = meal.strMealThumb,
        mealVideo = meal.strYoutube,
        mealCategory = meal.strCategory,
        mealArea = meal.strArea;

    const ingredientsArr = []

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredientsArr.push(meal[`strIngredient${i}`] + ' - ' + meal[`strMeasure${i}`])
        }
    }
    const liArr = ingredientsArr.map(ing => `<li>${ing} </li>`).join('');

    htmlDiv.innerHTML = `
    <div class="description">
        <div class="description-text">
                <div class="main-text">
                    <h2>${mealName}</h2>
                    <p class="text">
                        ${mealDesc}
                    </p>
                    
                    ${(mealArticle) ? `<a href="${mealArticle}" target="_blank" class="btn">Read Full Article</a>` : ''}
                    
                </div> <!-- main-text -->
            </div> <!-- description-text -->

            <div class="description-ingredients">
                <h2>Ingredients:</h2>
                <ul>
                    ${liArr}
                </ul>
                <p><strong>Category:</strong> <span id="category">${mealCategory}</span></p>
                <p><strong>Area:</strong> <span id="area">${mealArea}</span></p>

            </div> <!-- description-ingredients -->
        </div> <!-- description-->

        <div class="img-video section">
                ${(mealImg) ? `<img src="${mealImg}" alt="">` : ''}

                ${mealVideo ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${mealVideo.slice(-11)}" frameborder="0"></iframe>` : ''}
            </div> <!-- img-video -->
        </div> <!-- html -->
        `;
}

