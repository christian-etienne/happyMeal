// Sélectionne tous les boutons "Ajouter une recette"
const addRecipeBtns = document.querySelectorAll('.add-recipe-btn');

// Parcours les boutons et ajoute un écouteur d'événements 'click' à chacun
addRecipeBtns.forEach(btn => {
  btn.addEventListener('click', function(event) {
    // Récupère la cellule du tableau correspondante à partir du bouton cliqué
    const cell = event.target.closest('td');

    // Ouvre la boîte de dialogue modale pour la sélection des recettes
    const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
    recipeModal.show();

    // Vérifie si l'élément .modal-body existe avant de sélectionner les recettes favorites
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
      // Nettoie le contenu existant du modal-body avant d'ajouter de nouvelles recettes
      modalBody.innerHTML = '';

      // Crée la liste des recettes favorites dans la boîte de dialogue modale
      const modalRecipeList = document.createElement('div');
      modalRecipeList.classList.add('list-group');
      modalBody.appendChild(modalRecipeList);

      // Récupère les recettes favorites à partir du localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

      // Ajoute chaque recette favorite à la liste dans la boîte de dialogue modale
      favorites.forEach((favorite, index) => {
        const recipeListItem = document.createElement('a');
        recipeListItem.href = '#';
        recipeListItem.classList.add('list-group-item', 'list-group-item-action', 'modal-recipe-btn');
        recipeListItem.dataset.index = index; // Ajoute l'index de la recette favorite

        const recipeImage = document.createElement('img');
        recipeImage.src = favorite.image;
        recipeImage.alt = favorite.nom;
        recipeImage.classList.add('img-fluid'); // Classe Bootstrap pour une image fluide
        recipeImage.style.maxWidth = '100px'; // Limite la largeur maximale de l'image

        recipeListItem.appendChild(recipeImage);
        recipeListItem.appendChild(document.createTextNode(favorite.nom)); // Ajoute le nom de la recette

        modalRecipeList.appendChild(recipeListItem);
      });

      // Ajoute un écouteur d'événements pour chaque recette dans le modal
      modalRecipeList.querySelectorAll('.modal-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function(event) {
          event.preventDefault();
          const index = event.currentTarget.dataset.index;
          const selectedRecipe = favorites[index];
        // Ajoute la recette sélectionnée à la cellule correspondante du tableau de planification
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');

        // Crée une balise img pour l'image de la recette avec une classe Bootstrap pour une image fluide
            const recipeImage = document.createElement('img');
            recipeImage.src = selectedRecipe.image;
            recipeImage.alt = selectedRecipe.nom;
            recipeImage.classList.add('img-fluid');

        // Limite la taille de l'image en ajustant les attributs width et height
            recipeImage.setAttribute('width', '100'); // Limite la largeur de l'image à 100 pixels
            recipeImage.setAttribute('height', '100'); // Limite la hauteur de l'image à 100 pixels

        // Ajoute l'image à la div de la recette
            recipeDiv.appendChild(recipeImage);

        // Ajoute le nom de la recette et le bouton Supprimer
            recipeDiv.innerHTML += `
                <div class="recipe-name">${selectedRecipe.nom}</div>
                <button type="button" class="btn btn-danger delete-recipe-btn">Supprimer</button>
                `;

        // Ajoute la div de la recette à la cellule du tableau
            cell.appendChild(recipeDiv);

          // Ajoute un écouteur d'événements 'click' au bouton "Supprimer"
          const deleteRecipeBtn = recipeDiv.querySelector('.delete-recipe-btn');
          deleteRecipeBtn.addEventListener('click', function() {
            // Supprime la recette du tableau de planification et met à jour le localStorage
            recipeDiv.remove();
            updateLocalStorage();
          });

          // Ferme la boîte de dialogue modale
          recipeModal.hide();
        });
      });
    }
  });
});

// Vérifie si des informations de planification de repas sont stockées dans le localStorage
const mealPlan = localStorage.getItem('mealPlan');

// Si des informations de planification de repas sont stockées dans le localStorage, remplit le tableau de planification en conséquence
if (mealPlan) {
  const mealPlanObject = JSON.parse(mealPlan);

  // Parcours les jours de la semaine et les repas
  Object.entries(mealPlanObject).forEach(([day, meals]) => {
    // Vérifie si meals est un tableau avant de l'itérer
    if (Array.isArray(meals)) {
      meals.forEach(meal => {
        // Récupère la cellule du tableau correspondante
        const cell = document.querySelector(`td:nth-child(${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].indexOf(day) + 2})`);

        // Ajoute la recette à la cellule du tableau
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
          <img src="${meal.image}" alt="${meal.name}" class="recipe-image img-fluid">
          <div class="recipe-name">${meal.name}</div>
          <button type="button" class="btn btn-danger delete-recipe-btn">Supprimer</button>
        `;
        cell.appendChild(recipeDiv);

        // Ajoute un écouteur d'événements 'click' au bouton "Supprimer"
        const deleteRecipeBtn = recipeDiv.querySelector('.delete-recipe-btn');
        deleteRecipeBtn.addEventListener('click', function() {
          // Supprime la recette du tableau de planification et met à jour le localStorage
          recipeDiv.remove();
          updateLocalStorage();
        });
      });
    }
  });
}

// Ajoute un écouteur d'événements pour la fermeture de la boîte de dialogue modale
const recipeModal = document.getElementById('recipeModal');
recipeModal.addEventListener('hidden.bs.modal', function() {
  // Met à jour le localStorage avec les informations de planification de repas actuelles
  updateLocalStorage();
});

// Fonction pour mettre à jour le localStorage avec les informations de planification de repas actuelles
function updateLocalStorage() {
  // Vérifie si le tableau de planification existe
  const mealPlanTable = document.querySelector('tbody');
  if (!mealPlanTable) {
    console.error("Tableau de planification introuvable.");
    return;
  }

  // Crée un objet JSON pour stocker les informations de planification de repas
  const mealPlanObject = {};

  // Parcours les lignes du tableau de planification
  const rows = mealPlanTable.querySelectorAll('tr');
  rows.forEach(row => {
    // Vérifie si la ligne actuelle contient le jour de la semaine
    const dayCell = row.querySelector('th');
    if (!dayCell) return; // Ignore les lignes sans jour de la semaine

    const day = dayCell.textContent.trim(); // Récupère le jour de la semaine

    // Parcours les cellules de repas dans la ligne actuelle
    const mealCells = row.querySelectorAll('td');
    mealCells.forEach(mealCell => {
      const mealType = mealCell.textContent.trim(); // Récupère le type de repas (Déjeuner, Dîner, etc.)
      const recipes = mealCell.querySelectorAll('.recipe');

      // Vérifie si des recettes sont présentes dans la cellule
      if (recipes.length > 0) {
        const recipesArray = [];

        // Parcours les recettes dans la cellule
        recipes.forEach(recipe => {
          const recipeName = recipe.querySelector('.recipe-name');
          const recipeImage = recipe.querySelector('.recipe-image');

          // Vérifie si le nom de la recette et l'image existent avant de les ajouter à l'objet
          if (recipeName && recipeImage) {
            recipesArray.push({ name: recipeName.textContent, image: recipeImage.src });
          }
        });

        // Vérifie si l'objet mealPlanObject contient déjà une clé pour le jour de la semaine
        if (!mealPlanObject[day]) {
          mealPlanObject[day] = {};
        }

        // Ajoute les recettes au type de repas correspondant dans l'objet mealPlanObject
        mealPlanObject[day][mealType] = recipesArray;
      }
    });
  });

  // Stocke les informations de planification de repas dans le localStorage
  localStorage.setItem('mealPlan', JSON.stringify(mealPlanObject));
}