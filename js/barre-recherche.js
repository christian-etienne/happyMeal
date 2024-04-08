const searchInput = document.getElementById('search-input');
const searchResultsList = document.getElementById('search-results-list');

// Charge les recettes à partir du fichier JSON
fetch('data.json')
  .then((response) => response.json())
  .then((data) => {
    const recipes = data.recettes;

    searchInput.addEventListener('input', (event) => {
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
          // Ajoute ici la logique pour afficher le modal de la recette correspondante
        });
        resultItem.appendChild(resultLink);
        searchResultsList.appendChild(resultItem);
      });
    });
  })
  .catch((error) => console.error('Erreur lors du chargement des recettes :', error));