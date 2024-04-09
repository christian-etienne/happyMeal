// Variables globales
let recipes = [];

// Charger les recettes lors du chargement de la page
window.onload = loadRecipesFromJSON;

// Fonction pour charger les recettes à partir du JSON
function loadRecipesFromJSON() {
  fetch('../data.json')
    .then((response) => response.json())
    .then((data) => {
      recipes = data.recettes;
      displayRandomRecipes(recipes);
    })
    .catch((error) => console.error('Erreur lors du chargement des recettes :', error));
}

// Fonction pour afficher les recettes favorites
function displayFavorites() {
    const recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = '';
  
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
    favorites.forEach(recipe => {
      const card = document.createElement('div');
      card.classList.add('col');
      card.innerHTML = `
        <div class="card shadow-sm">
          <img src="${recipe.image}" class="card-img-top" alt="${recipe.nom}">
          <div class="card-body">
            <h5 class="card-title">${recipe.nom}</h5>
            <p class="card-text">${recipe.temps_preparation}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <button type="button" class="btn btn-sm btn-outline-danger view-recipe-btn" data-recipe-name="${recipe.nom}">Voir la recette</button>
              </div>
              <button type="button" class="btn btn-sm btn-warning delete-favorite-btn">Supprimer</button>
            </div>
          </div>
        </div>
      `;
      recipeContainer.appendChild(card);
    });
  
    // Sélectionne tous les boutons "Voir la recette"
    const viewRecipeBtns = document.querySelectorAll('.view-recipe-btn');
  
    // Parcours les boutons et ajoute un écouteur d'événements 'click' à chacun
    viewRecipeBtns.forEach(btn => {
      btn.addEventListener('click', function(event) {
        // Récupère le nom de la recette à partir de l'attribut data-recipe-name
        const recipeName = event.target.getAttribute('data-recipe-name');
  
        // Affiche les détails de la recette
        displayRecipeDetails(recipeName);
      });
    });
  
    // Sélectionne tous les boutons "Supprimer"
    const deleteFavoriteBtns = document.querySelectorAll('.delete-favorite-btn');
  
    // Parcours les boutons et ajoute un écouteur d'événements 'click' à chacun
    deleteFavoriteBtns.forEach(btn => {
      btn.addEventListener('click', function(event) {
        // Récupère le nom de la recette à partir de la card parent
        const recipeName = event.target.closest('.card').querySelector('.card-title').textContent;
  
        // Supprime la recette du localStorage
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(recipe => recipe.nom !== recipeName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
  
        // Supprime la card de la page
        event.target.closest('.card').remove();
      });
    });
  }
  
  // Fonction pour afficher les détails d'une recette dans le modal
  function displayRecipeDetails(recipeName) {
      const recipe = JSON.parse(localStorage.getItem('favorites')).find(recipe => recipe.nom === recipeName);
    
      if (!recipe) {
        console.error(`Aucune recette trouvée avec le nom "${recipeName}".`);
        return;
      }
    
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
  
  // Fonction pour vérifier si une recette existe déjà dans les favoris
  function isRecipeInFavorites(recipe) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.nom === recipe.nom);
  }
  
  // Sélectionne le bouton "Ajouter aux favoris"
  const addToShoppingListBtn = document.querySelector('.add-to-shopping-list-btn');
  
  // Écoute l'événement 'click' sur le bouton
  addToShoppingListBtn.addEventListener('click', function() {
      // Récupère les informations de la recette à partir de la modal
      const recipe = {
          nom: document.getElementById('recipeModalName').textContent,
          image: document.getElementById('recipeModalImage').src,
          temps_preparation: document.getElementById('recipeModalDuration').textContent,
          ingredients: Array.from(document.getElementById('recipeModalIngredients').children).map(li => li.textContent),
          etapes: Array.from(document.getElementById('recipeModalSteps').children).map(li => li.textContent)
      };
  
      // Vérifie si la recette existe déjà dans les favoris
      if (!isRecipeInFavorites(recipe)) {
          // Stocke la recette dans le localStorage
          let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
          favorites.push(recipe);
          localStorage.setItem('favorites', JSON.stringify(favorites));
      } else {
          console.log(`La recette "${recipe.nom}" est déjà dans les favoris.`);
      }
      window.recipeModalInstance.hide();
  
  });
  
  // Affiche les recettes favorites lors du chargement de la page favoris.html
  window.addEventListener('load', displayFavorites);
  displayFavorites();
  