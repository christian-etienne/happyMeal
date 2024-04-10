// Variables globales
let shoppingList = [];

// Fonction pour charger la liste de courses depuis le localStorage
function loadShoppingList() {
  shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
}

// Fonction pour afficher la liste de courses sur la page liste.html
function displayShoppingList() {
  const shoppingListContainer = document.getElementById('shopping-list');
  shoppingListContainer.innerHTML = '';

  shoppingList.forEach(ingredient => {
    const listItem = document.createElement('li');
    listItem.textContent = `${ingredient.nom} - ${ingredient.quantite}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'delete-from-list-btn');
    deleteBtn.setAttribute('data-ingredient-name', ingredient.nom);
    listItem.appendChild(deleteBtn);

    shoppingListContainer.appendChild(listItem);
  });

  // Ajoute un écouteur d'événements pour les boutons "Supprimer"
  const deleteFromListBtns = document.querySelectorAll('.delete-from-list-btn');
  deleteFromListBtns.forEach(btn => {
    btn.addEventListener('click', function(event) {
      const ingredientName = event.target.getAttribute('data-ingredient-name');
      shoppingList = shoppingList.filter(ingredient => ingredient.nom !== ingredientName);

      // Stocke la liste de courses mise à jour dans le localStorage
      localStorage.setItem('shoppingList', JSON.stringify(shoppingList));

      // Supprime l'ingrédient de la liste affichée sur la page
      event.target.parentElement.remove();
    });
  });
}

// Fonction pour ajouter un ingrédient à la liste de courses depuis la page favoris.html
function addIngredientToShoppingList(ingredientName) {
  const ingredientIndex = shoppingList.findIndex(ingredient => ingredient.nom === ingredientName);

  if (ingredientIndex === -1) {
    // L'ingrédient n'est pas dans la liste, on l'ajoute
    shoppingList.push({ nom: ingredientName, quantite: 1 });
  } else {
    // L'ingrédient est déjà dans la liste, on incremente la quantité
    shoppingList[ingredientIndex].quantite++;
  }

  // Stocke la liste de courses dans le localStorage
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

// Charger la liste de courses depuis le localStorage lors du chargement de la page
loadShoppingList();

// Écouteur d'événements pour les boutons "Ajouter à la liste" sur la page favoris.html
document.querySelectorAll('.add-to-list-btn').forEach(btn => {
  btn.addEventListener('click', function(event) {
    const ingredientName = event.target.getAttribute('data-ingredient-name');
    addIngredientToShoppingList(ingredientName);
  });
});

// Afficher la liste de courses sur la page liste.html lors du chargement de la page
if (window.location.pathname === '/liste.html') {
  displayShoppingList();
}
