// Fonction pour ajouter un ingrédient à la liste de courses
function addToShoppingList(ingredient) {
  const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
  shoppingList.push(ingredient);
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  displayShoppingList();
}

// Fonction pour afficher la liste de courses
function displayShoppingList() {
  const shoppingListContainer = document.getElementById('shopping-list-container');
  shoppingListContainer.innerHTML = '';

  const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

  shoppingList.forEach(ingredient => {
      const listItem = document.createElement('li');
      listItem.textContent = ingredient;
      shoppingListContainer.appendChild(listItem);
  });
}

// Fonction pour effacer la liste de courses
function clearShoppingList() {
  localStorage.removeItem('shoppingList');
  displayShoppingList();
}

// Afficher la liste de courses lors du chargement de la page liste.html
window.addEventListener('load', displayShoppingList);