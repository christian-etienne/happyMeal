const searchInput = document.getElementById('search-input');
const searchResultsList = document.getElementById('search-results-list');

// Attends que les recettes soient chargées dans random-recipe.js
let recipesLoaded = false;
window.addEventListener('load', () => {
  setInterval(() => {
    if (recipes.length) {
      recipesLoaded = true;
      searchInput.addEventListener('input', onSearchInput);
    }
  }, 100);
});

function onSearchInput(event) {
  if (!recipesLoaded) {
    return;
  }

  const searchTerm = event.target.value.toLowerCase();

  searchResultsList.innerHTML = '';

  if (!searchTerm) {
    return;
  }

  const filteredRecipes = recipes.filter((recipe) => recipe.nom.toLowerCase().includes(searchTerm));

  if (!filteredRecipes.length) {
    const noResultsMessage = document.createElement('li');
    noResultsMessage.classList.add('list-group-item');
    noResultsMessage.textContent = 'Aucune recette trouvée.';
    searchResultsList.appendChild(noResultsMessage);
    return;
  }

  filteredRecipes.forEach((recipe) => {
    const resultItem = document.createElement('li');
    resultItem.classList.add('list-group-item');
    const resultLink = document.createElement('a');
    resultLink.href = '#';
    resultLink.textContent = recipe.nom;
    resultLink.addEventListener('click', (event) => {
      event.preventDefault();
      displayRecipeDetails(recipe.nom); // Appelle la fonction displayRecipeDetails() avec la recette sélectionnée
    });
    resultItem.appendChild(resultLink);
    searchResultsList.appendChild(resultItem);
  });
}
