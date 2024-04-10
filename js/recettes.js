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
  // Votre code existant pour afficher les détails de la recette
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

  // // Utiliser un ensemble pour stocker les noms d'ingrédients déjà ajoutés
  // const addedIngredients = new Set();

  // Afficher les ingrédients
  modalIngredients.innerHTML = '';
  recipe.ingredients.forEach(ingredient => {
    // Vérifier si l'ingrédient a déjà été ajouté
    if (!addedIngredients.has(ingredient.nom)) {
      const li = document.createElement('li');
      li.textContent = `${ingredient.nom} - ${ingredient.quantite}`;
      
  //     // Créer le bouton "Ajouter à ma liste"
  //     const addButton = document.createElement('button');
  //     addButton.textContent = 'Ajouter à ma liste';
  //     addButton.classList.add('btn', 'btn-primary', 'btn-sm', 'ms-2');
  //     addButton.addEventListener('click', () => {
  //         // Ajouter le code pour ajouter cet ingrédient à la liste de l'utilisateur
  //         // Par exemple, vous pouvez appeler une fonction pour gérer l'ajout à la liste
  //         addToMyList(ingredient);
  //     });

  //     // Ajouter le bouton à l'élément de liste des ingrédients
  //     li.appendChild(addButton);

  //     // Ajouter l'élément de liste des ingrédients à la liste des ingrédients
  //     modalIngredients.appendChild(li);

  //     // Ajouter le nom de l'ingrédient à l'ensemble des ingrédients ajoutés
  //     addedIngredients.add(ingredient.nom);
  //   }
  // });

  // Votre code existant pour afficher les étapes et afficher le modal
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

// Fonction pour ajouter un ingrédient à la liste de l'utilisateur
function addToMyList(ingredient) {
  // Récupérer la liste actuelle des ingrédients depuis le stockage local
  let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

  // Vérifier si l'ingrédient est déjà présent dans la liste
  const existingIngredient = shoppingList.find(item => item.nom === ingredient.nom && item.quantite === ingredient.quantite);

  // Si l'ingrédient n'existe pas encore dans la liste, l'ajouter
  if (!existingIngredient) {
    shoppingList.push(ingredient);
  } else {
    console.log("Cet ingrédient est déjà dans la liste.");
    return; // Sortir de la fonction si l'ingrédient existe déjà
  }

  // Enregistrer la liste mise à jour dans le stockage local
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));

  // Afficher un message de confirmation à l'utilisateur
  console.log(`Ingrédient ajouté à la liste de l'utilisateur : ${ingredient.nom}`);

  // Redirection vers la page liste.html (facultatif)
  // window.location.href = 'pages/liste.html';
}

// Fonction pour supprimer un ingrédient de la liste de l'utilisateur
function removeFromMyList(ingredient) {
  // Récupérer la liste actuelle des ingrédients depuis le stockage local
  let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

  // Filtrer la liste pour supprimer l'ingrédient spécifié
  shoppingList = shoppingList.filter(item => !(item.nom === ingredient.nom && item.quantite === ingredient.quantite));

  // Enregistrer la liste mise à jour dans le stockage local
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));

  // Actualiser la page pour refléter les changements (facultatif)
  location.reload();
}

// Code pour afficher les ingrédients sur la page liste.html
document.addEventListener('DOMContentLoaded', function() {
  const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
  const ingredientsContainer = document.getElementById('ingredients-container');

  if (shoppingList && shoppingList.length > 0) {
    shoppingList.forEach(ingredient => {
      const li = document.createElement('li');
      li.textContent = `${ingredient.nom} - ${ingredient.quantite}`;

      // Ajouter un bouton "Supprimer" pour chaque ingrédient
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
      deleteButton.addEventListener('click', () => {
        removeFromMyList(ingredient);
      });
      li.appendChild(deleteButton);

      ingredientsContainer.appendChild(li);
    });
  } else {
    const message = document.createElement('p');
    message.textContent = "Aucun ingrédient n'a été ajouté à la liste.";
    ingredientsContainer.appendChild(message);
  }
});

// Charger les recettes au chargement de la page
loadRecipesFromJSON();

function displayRecipeDetails();























