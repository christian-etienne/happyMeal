// Variables globales
let recipes = [];

// Charger les recettes lors du chargement de la page
window.onload = loadRecipesFromJSON;

// Fonction pour charger les recettes à partir du JSON
async function loadRecipesFromJSON() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    recipes = data.recettes; // Stocke les recettes dans la variable globale 'recipes'
    return recipes; // Retourne la variable 'recettes'
  } catch (error) {
    console.error('Erreur lors du chargement des recettes :', error);
  }
}

// Fonction pour afficher les recettes favorites
async function displayFavorites() {
  const recipeContainer = document.getElementById('recipe-container');
  recipeContainer.innerHTML = '';

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Charge les recettes à partir de la fonction 'loadRecipesFromJSON()'
  recipes = await loadRecipesFromJSON();

  // Vérifie si chaque recette favorite est déjà dans la liste des recettes affichées
  // Si ce n'est pas le cas, affiche la recette
  favorites.forEach(favorite => {
    const recipe = recipes.find(recipe => recipe.nom === favorite.nom);
    if (!recipeContainer.querySelector(`[data-recipe-name="${recipe.nom}"]`)) {
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
      card.setAttribute('data-recipe-name', recipe.nom); // Ajoute un attribut 'data-recipe-name' à la card
      recipeContainer.appendChild(card);
    }
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
async function displayRecipeDetails(recipeName) {
  // Charge les recettes à partir de la fonction 'loadRecipesFromJSON()'
  recipes = await loadRecipesFromJSON();

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const recipe = favorites.find(recipe => recipe.nom === recipeName) || recipes.find(recipe => recipe.nom === recipeName);

  if (!recipe) {
    console.error(`Aucune recette trouvée avec le nom "${recipeName}".`);
    return;
  }

  console.log('Recette sélectionnée :', recipe);

  const modalImage = document.getElementById('recipeModalImage');
  const modalName = document.getElementById('recipeModalName');
  const modalDuration = document.getElementById('recipeModalDuration');
  const modalIngredients = document.getElementById('recipeModalIngredients');
  const modalSteps = document.getElementById('recipeModalSteps');
  const mealPlanningButton = document.getElementById('mealPlanningButton');

  modalImage.src = recipe.image;
  modalName.textContent = recipe.nom;
  modalDuration.textContent = `Temps de préparation : ${recipe.temps_preparation}`;

  console.log('Ingrédients de la recette :', recipe.ingredients);

  // Afficher les ingrédients
  modalIngredients.innerHTML = '';
  recipe.ingredients.forEach(ingredient => {
    const li = document.createElement('li');
    li.textContent = `${ingredient}`;
    const addButton = document.createElement('button');
    addButton.textContent = 'Ajouter à la liste de courses';
    addButton.classList.add('btn', 'btn-sm', 'btn-success', 'add-to-shopping-list');
    addButton.addEventListener('click', function() {
      addToShoppingList(ingredient);
    });
    li.appendChild(addButton);
    modalIngredients.appendChild(li);
  });

  // Afficher les étapes
  modalSteps.innerHTML = '';
  recipe.etapes.forEach((etape, index) => {
    const li = document.createElement('li');
    li.textContent = `${etape}`;
    modalSteps.appendChild(li);
  });

  // Ajouter le bouton pour planifier le repas
  mealPlanningButton.innerHTML = `
    <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
      Planifiez votre repas
    </button>
    <ul class="dropdown-menu" aria-labelledby="mealPlanningButton">
      <li><button class="dropdown-item" onclick="addToMealPlan('Lundi', '${recipe.nom}')">Lundi</button></li>
      <li><button class="dropdown-item" onclick="addToMealPlan('Mardi', '${recipe.nom}')">Mardi</button></li>
      <li><button class="dropdown-item" onclick="addToMealPlan('Mercredi', '${recipe.nom}')">Mercredi</button></li>
      <li><button class="dropdown-item" onclick="addToMealPlan('Jeudi', '${recipe.nom}')">Jeudi</button></li>
      <li><button class="dropdown-item" onclick="addToMealPlan('Vendredi', '${recipe.nom}')">Vendredi</button></li>
      <li><button class="dropdown-item" onclick="addToMealPlan('Samedi', '${recipe.nom}')">Samedi</button></li>
      <li><button class="dropdown-item" onclick="addToMealPlan('Dimanche', '${recipe.nom}')">Dimanche</button></li>
    </ul>
  `;

  // Afficher le modal
  const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'), {
    keyboard: false
  });
  window.recipeModalInstance = recipeModal; // Stocke l'instance du modal dans une variable globale
  recipeModal.show();
}

// Fonction pour sauvegarder les données dans le localStorage
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Fonction pour récupérer les données du localStorage
function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}




// Fonction pour ajouter une recette au plan de repas
function addToMealPlan(day, recipeName) {
  // Récupérer le jour sélectionné et le nom de la recette
  const selectedDay = day.toLowerCase(); // Convertir en minuscules pour la correspondance avec les ID
  const recipe = { day: selectedDay, recipeName: recipeName };

  // Récupérer la liste des recettes planifiées depuis le localStorage
  let mealPlan = getFromLocalStorage('mealPlan');

  // Ajouter la recette au plan de repas pour le jour sélectionné
  mealPlan[selectedDay] = recipe;

  // Mettre à jour le localStorage avec le nouveau plan de repas
  saveToLocalStorage('mealPlan', mealPlan);

  // Afficher la recette dans le tableau
  const dayElement = document.getElementById(`recipeElement${day}`);
  const recipeElement = document.createElement('p');
  recipeElement.textContent = recipeName;
  dayElement.appendChild(recipeElement);
}



 
  // Fonction pour vérifier si une recette existe déjà dans les favoris
  function isRecipeInFavorites(recipe) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.nom === recipe.nom);
  }
  
  // Fonction pour gérer l'ajout d'un ingrédient à la liste de courses
function addToShoppingList(ingredient) {
  const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
  if (!shoppingList.includes(ingredient)) {
    shoppingList.push(ingredient);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }
}

  // Affiche les recettes favorites lors du chargement de la page favoris.html
  window.addEventListener('load', displayFavorites);
  displayFavorites();

