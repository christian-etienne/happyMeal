// Fonction pour ajouter un ingrédient à la liste de courses
function addToShoppingList(ingredient) {
  const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

  // Vérifie si l'ingrédient n'est pas déjà présent dans la liste de courses
  if (!shoppingList.includes(ingredient)) {
      shoppingList.push(ingredient);
      localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
      displayShoppingList();
  } else {
      console.log(`L'ingrédient "${ingredient}" est déjà dans la liste de courses.`);
  }
}

// Fonction pour afficher la liste de courses
function displayShoppingList() {
  const shoppingListContainer = document.getElementById('shopping-list-container');
  shoppingListContainer.innerHTML = '';

  const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

  shoppingList.forEach(ingredient => {
      const listItem = document.createElement('li');
      listItem.textContent = ingredient;

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Supprimer';
      removeButton.classList.add('btn', 'btn-warning', 'btn-sm', 'ms-2');
      removeButton.addEventListener('click', function() {
          removeFromShoppingList(ingredient);
      });

      listItem.appendChild(removeButton);
      shoppingListContainer.appendChild(listItem);
  });
}

// Fonction pour supprimer un ingrédient de la liste de courses
function removeFromShoppingList(ingredient) {
  let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
  shoppingList = shoppingList.filter(item => item !== ingredient);
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  displayShoppingList();
}

// Afficher la liste de courses lors du chargement de la page liste.html
window.addEventListener('load', displayShoppingList);