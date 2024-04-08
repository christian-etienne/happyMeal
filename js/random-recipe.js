// Charger les recettes lors du chargement de la page
window.onload = loadRecipesFromJSON;

// Fonction pour charger les recettes à partir du JSON
function loadRecipesFromJSON() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => displayRandomRecipes(data.recettes))
        .catch(error => console.error('Erreur lors du chargement des recettes :', error));
}

// Fonction pour afficher des recettes aléatoires
function displayRandomRecipes(recipes) {
    const recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = '';

    // Sélectionner trois recettes aléatoires
    const randomRecipes = getRandomElements(recipes, 3);

    // Afficher chaque recette dans une carte
    randomRecipes.forEach(recipe => {
        const card = document.createElement('div');
        card.classList.add('col');

        card.innerHTML = `
            <div class="card shadow-sm">
                <img src="${recipe.image}" class="card-img-top" alt="Image de ${recipe.nom}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.nom}</h5>
                    <p class="card-text">${recipe.temps_preparation}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-warning" onclick="displayRecipeDetails('${recipe.nom}')">Voir la recette</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        recipeContainer.appendChild(card);
    });
}

// Fonction pour afficher les détails d'une recette dans le modal
function displayRecipeDetails(recipeName) {
    const recipe = recipes.find(recipe => recipe.nom === recipeName);

    const modalImage = document.getElementById('recipeModalImage');
    const modalName = document.getElementById('recipeModalName');
    const modalDuration = document.getElementById('recipeModalDuration');
    const modalIngredients = document.getElementById('recipeModalIngredients');
    const modalSteps = document.getElementById('recipeModalSteps');

    modalImage.src = recipe.image;
    modalName.textContent = recipe.nom;
    modalDuration.textContent = `Temps de préparation : ${recipe.temps_preparation}`;

    // Afficher les ingrédients
    modalIngredients.innerHTML = '';
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = `${ingredient.nom} - ${ingredient.quantite}`;
        modalIngredients.appendChild(li);
    });

    // Afficher les étapes
    modalSteps.innerHTML = '';
    recipe.etapes.forEach((etape, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${etape}`;
        modalSteps.appendChild(li);
    });

    // Afficher le modal
    const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'), {
        keyboard: false
    });
    recipeModal.show();
}

// Fonction pour obtenir des éléments aléatoires d'un tableau
function getRandomElements(array, numberOfElements) {
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, numberOfElements);
}
