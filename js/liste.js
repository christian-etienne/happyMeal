// Fonction pour supprimer un ingrédient de la liste de courses
function removeFromShoppingList(ingredient) {
  let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
  shoppingList = shoppingList.filter(item => item !== ingredient);
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  displayShoppingList();
}

// Fonction pour effacer toute la liste de courses
function clearShoppingList() {
  const shoppingListContainer = document.getElementById('shopping-list-container');
  shoppingListContainer.innerHTML = ''; // Supprime tous les éléments de la liste
  localStorage.removeItem('shoppingList'); // Efface également la liste du localStorage
}

// Fonction pour générer le PDF des ingrédients
function generatePDF() {
  // Crée une nouvelle instance de jsPDF
  const doc = new jsPDF();

  // Récupère la liste de courses depuis le localStorage
  const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

  // Ajoute les ingrédients à la liste du PDF
  doc.setFontSize(12);
  doc.text('Liste d\'ingrédients :', 10, 10);
  shoppingList.forEach((ingredient, index) => {
      doc.text(`${index + 1}. ${ingredient}`, 15, 20 + (index * 10));
  });

  // Télécharge le PDF
  doc.save('liste_ingredients.pdf');
}

// Afficher la liste de courses lors du chargement de la page liste.html
window.addEventListener('load', displayShoppingList);
