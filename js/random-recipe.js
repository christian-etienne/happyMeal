// Fonction pour charger les recettes depuis le fichier JSON
function loadRecipesFromJSON() {
    fetch('data.json') // Modifier le chemin pour pointer vers data.json à la racine du dossier
        .then(response => response.json())
        .then(data => {
            displayRandomRecipes(data.recettes);
        })
        .catch(error => console.error('Erreur lors du chargement des recettes :', error));
}

// Fonction pour afficher une sélection aléatoire de recettes
function displayRandomRecipes(recipes) {
    const recipeContainer = document.getElementById("recipe-container");
    recipeContainer.innerHTML = '';

    const numberOfRecipesToShow = 3;
    const randomIndex = Math.floor(Math.random() * (recipes.length - numberOfRecipesToShow + 1));
    const randomRecipes = recipes.slice(randomIndex, randomIndex + numberOfRecipesToShow);

    randomRecipes.forEach(recipe => {
        const col = document.createElement('div');
        col.classList.add('col');

        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.nom}">
                <div class="card-body">
                    <p class="card-text">${recipe.nom}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#${recipe.nom.replaceAll(' ', '-')}">Voir la recette</button>
                        </div>
                        <small class="text-body-secondary">${recipe.temps_preparation}</small>
                    </div>
                </div>
            </div>
        `;

        recipeContainer.appendChild(col);
    });
}

// Appeler la fonction pour charger les recettes et les afficher au chargement de la page
loadRecipesFromJSON();
