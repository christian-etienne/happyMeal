// Variables globales
let recipes = [];
let currentPage = 1;
const recipesPerPage = 4;

// Fonction pour charger les recettes à partir du JSON
async function loadRecipesFromJSON() {
  try {
    const response = await fetch('../data.json');
    const data = await response.json();
    recipes = data.recettes;
    displayRecipes();
    displayPagination();
  } catch (error) {
    console.error('Erreur lors du chargement des recettes :', error);
  }
}

// Fonction pour afficher les recettes
function displayRecipes() {
  const recipeContainer = document.getElementById('recipe-container');
  recipeContainer.innerHTML = '';

  recipes.forEach((recipe, index) => {
    if (index >= (currentPage - 1) * recipesPerPage && index < currentPage * recipesPerPage) {
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
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="displayRecipeDetails('${recipe.nom}', '${recipe.image}')">Voir la recette</button>
                    </div>
                </div>
            </div>
        </div>
      `;

      recipeContainer.appendChild(card);
    }
  });
}

// Fonction pour afficher la pagination
function displayPagination() {
  const paginationContainer = document.getElementById('recipe-pagination');
  paginationContainer.innerHTML = '';

  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.classList.add('page-item');

    const pageLink = document.createElement('a');
    pageLink.classList.add('page-link');
    pageLink.href = '#';
    pageLink.textContent = i;

    if (i === currentPage) {
      pageItem.classList.add('active');
    }

    pageLink.addEventListener('click', (event) => {
      event.preventDefault();
      currentPage = i;
      displayRecipes();
      displayPagination();
    });

    pageItem.appendChild(pageLink);
    paginationContainer.appendChild(pageItem);
  }
}

// Fonction pour afficher les détails d'une recette dans le modal
function displayRecipeDetails(recipeName, recipeImage) {
    const recipe = recipes.find(recipe => recipe.nom === recipeName);
  
    if (!recipe) {
      console.error(`Aucune recette trouvée avec le nom "${recipeName}".`);
      return;
    }
  
    const modalImage = document.getElementById('recipeModalImage');
    const modalName = document.getElementById('recipeModalName');
    const modalDuration = document.getElementById('recipeModalDuration');
    const modalIngredients = document.getElementById('recipeModalIngredients');
    const modalSteps = document.getElementById('recipeModalSteps');
  
    modalImage.src = `${recipeImage}`; 
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
  
  loadRecipesFromJSON();