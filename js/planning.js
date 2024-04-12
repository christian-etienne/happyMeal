
// Selekcja wszystkich przycisków "Ajouter une recette"
const addRecipeBtns = document.querySelectorAll('.add-recipe-btn');

// Przeglądanie przycisków i dodawanie nasłuchiwacza zdarzeń 'click' do każdego
addRecipeBtns.forEach(btn => {
  btn.addEventListener('click', function(event) {
    // Pobranie komórki tabeli odpowiadającej klikniętemu przyciskowi
    const cell = event.target.closest('td');

    // Otwarcie okna modalnego do wyboru przepisów
    const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
    recipeModal.show();

    // Sprawdzenie, czy istnieje element .modal-body przed wyborem ulubionych przepisów
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
      // Wyczyszczenie istniejącej zawartości .modal-body przed dodaniem nowych przepisów
      modalBody.innerHTML = '';

      // Utworzenie listy ulubionych przepisów w oknie modalnym
      const modalRecipeList = document.createElement('div');
      modalRecipeList.classList.add('list-group');
      modalBody.appendChild(modalRecipeList);

      // Pobranie ulubionych przepisów z local storage
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

      // Dodanie każdego ulubionego przepisu do listy w oknie modalnym
      favorites.forEach((favorite, index) => {
        const recipeListItem = document.createElement('a');
        recipeListItem.href = '#';
        recipeListItem.classList.add('list-group-item', 'list-group-item-action', 'modal-recipe-btn');
        recipeListItem.dataset.index = index; // Dodanie indeksu ulubionego przepisu

        const recipeImage = document.createElement('img');
        recipeImage.src = favorite.image;
        recipeImage.alt = favorite.nom;
        recipeImage.classList.add('img-fluid');
        recipeImage.style.maxWidth = '100px'; // Ograniczenie maksymalnej szerokości obrazka

        recipeListItem.appendChild(recipeImage);
        recipeListItem.appendChild(document.createTextNode(favorite.nom)); // Dodanie nazwy przepisu

        modalRecipeList.appendChild(recipeListItem);
      });

      // Dodanie nasłuchiwacza zdarzeń dla każdego przepisu w oknie modalnym
      modalRecipeList.querySelectorAll('.modal-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function(event) {
          event.preventDefault();
          const index = event.currentTarget.dataset.index;
          const selectedRecipe = favorites[index];
          // Ajoute la recette sélectionnée à la cellule correspondante du tableau de planification
          addRecipeToMealPlan(selectedRecipe, cell);

          // Aktualizacja local storage z aktualnymi informacjami o planie posiłków
          updateLocalStorage();

          // Zamknięcie okna modalnego
          recipeModal.hide();
        });
      });
    }
  });
});

// Dodanie nasłuchiwacza zdarzeń dla zamknięcia okna modalnego
const recipeModal = document.getElementById('recipeModal');
recipeModal.addEventListener('hidden.bs.modal', function() {
  // Aktualizacja local storage z aktualnymi informacjami o planie posiłków
  updateLocalStorage();
});

// Funkcja aktualizująca local storage z aktualnymi informacjami o planie posiłków
function updateLocalStorage() {
  // Sprawdzenie, czy istnieje tabela planu
  const mealPlanTable = document.querySelector('tbody');
  if (!mealPlanTable) {
    console.error("Tableau de planification introuvable.");
    return;
  }

  // Utworzenie obiektu JSON do przechowywania informacji o planie posiłków
  const mealPlanObject = {};

  // Przeglądanie wierszy tabeli planu
  const rows = mealPlanTable.querySelectorAll('tr');
  rows.forEach(row => {
    // Sprawdzenie, czy bieżący wiersz zawiera dzień tygodnia
    const dayCell = row.querySelector('th');
    if (!dayCell) return; // Pominięcie wierszy bez dnia tygodnia

    const day = dayCell.textContent.trim(); // Pobranie dnia tygodnia

    // Przeglądanie komórek posiłków w bieżącym wierszu
    const mealCells = row.querySelectorAll('td');
    mealCells.forEach(mealCell => {
      const mealType = mealCell.textContent.trim(); // Pobranie typu posiłku (Déjeuner, Dîner, itp.)
      const recipes = mealCell.querySelectorAll('.recipe');

      // Sprawdzenie, czy w komórce są jakieś przepisy
      if (recipes.length > 0) {
        const recipesArray = [];

        // Przeglądanie przepisów w komórce
        recipes.forEach(recipe => {
          const recipeName = recipe.querySelector('.recipe-name');
          const recipeImage = recipe.querySelector('.recipe img');

          // Sprawdzenie, czy istnieją nazwa przepisu i jego obraz przed dodaniem do obiektu
          if (recipeName && recipeImage) {
            recipesArray.push({ name: recipeName.textContent, image: recipeImage.src });
          }
        });

        // Sprawdzenie, czy obiekt mealPlanObject zawiera już klucz dla dnia tygodnia
        if (!mealPlanObject[day]) {
          mealPlanObject[day] = {};
        }

        // Dodanie przepisów do odpowiedniego typu posiłku w obiekcie mealPlanObject
        mealPlanObject[day][mealType] = recipesArray;
      }
    });
  });

  // Zapisanie informacji o planie posiłków w local storage
  localStorage.setItem('mealPlan', JSON.stringify(mealPlanObject));
  console.log(localStorage)
}

// Funkcja do generowania pliku PDF z planem posiłków
function generatePDF() {
  // Crée une nouvelle instance de jsPDF
  const doc = new jsPDF();

  let y = 20; // Position Y pour afficher les recettes

  // Parcours les jours de la semaine
  document.querySelectorAll('th').forEach(day => {
    // Récupère le nom du jour
    const dayName = day.textContent.trim();
    // Ajoute le nom du jour comme en-tête de section
    doc.text(dayName, 10, y);
    y += 10; // Augmente la position Y pour le prochain repas

    // Parcours les repas pour ce jour
    const dayIndex = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].indexOf(dayName);
    const meals = document.querySelectorAll(`td:nth-child(${dayIndex + 2}) .recipe-name`);

    meals.forEach(meal => {
      // Ajoute le nom du repas à la position Y actuelle
      doc.text(meal.textContent.trim(), 20, y);
      y += 10; // Augmente la position Y pour le prochain repas
    });

    y += 10; // Ajoute de l'espace entre les jours
  });

  // Télécharge le PDF avec le nom "planning.pdf"
  doc.save('planning.pdf');
}

// Fonction pour ajouter une recette au tableau de planification et mettre à jour le localStorage
function addRecipeToMealPlan(recipe, cell) {
  const recipeDiv = document.createElement('div');
  recipeDiv.classList.add('recipe');

  // Crée une balise img pour l'image de la recette avec une classe Bootstrap pour une image fluide
  const recipeImage = document.createElement('img');
  recipeImage.src = recipe.image;
  recipeImage.alt = recipe.nom;
  recipeImage.classList.add('img-fluid');

  // Limite la taille de l'image en ajustant les attributs width et height
  recipeImage.setAttribute('width', '100'); // Limite la largeur de l'image à 100 pixels
  recipeImage.setAttribute('height', '100'); // Limite la hauteur de l'image à 100 pixels

  // Ajoute l'image à la div de la recette
  recipeDiv.appendChild(recipeImage);

  // Ajoute le nom de la recette et le bouton Supprimer
  recipeDiv.innerHTML += `
    <div class="recipe-name">${recipe.nom}</div>
    <button type="button" class="btn btn-danger delete-recipe-btn">Supprimer</button>
  `;

  // Ajoute la div de la recette à la cellule du tableau
  cell.appendChild(recipeDiv);

  // Cacher le bouton "Ajouter une recette" après avoir ajouté une recette avec succès
  cell.querySelector('.add-recipe-btn').style.display = 'none';

  // Ajoute un écouteur d'événements 'click' au bouton "Supprimer"
  const deleteRecipeBtn = recipeDiv.querySelector('.delete-recipe-btn');
  deleteRecipeBtn.addEventListener('click', function() {
    // Supprime la recette du tableau de planification et met à jour le localStorage
    recipeDiv.remove();
    // Affiche à nouveau le bouton "Ajouter une recette" après la suppression de la recette
    cell.querySelector('.add-recipe-btn').style.display = 'block';
    updateLocalStorage();
  });

  // Met à jour le localStorage avec les informations de planification de repas actuelles
  updateLocalStorage();
}