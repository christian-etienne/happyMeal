 // Chargement des données JSON 
 fetch('../json/data.json')
 .then(response => response.json())
 .then(data => {
     const searchInput = document.getElementById('searchInput');
     const suggestionsList = document.getElementById('suggestions');
     const recetteDetailsContainer = document.getElementById('recetteDetailsContainer');

     // Fonction de filtrage des suggestions
     function filterSuggestions(input) {
         return data.recettes.filter(recette => recette.nom.toLowerCase().includes(input.toLowerCase()));
     }

     // Fonction pour afficher les suggestions
     function showSuggestions(suggestions) {
         suggestionsList.innerHTML = '';
         suggestions.forEach(recette => {
             const li = document.createElement('li');
             li.textContent = recette.nom;
             suggestionsList.appendChild(li);
         });
     }

     //Fonction pour affichage de details de la recette
     fonction

     // Gérer les événements de saisie dans le champ de recherche
     searchInput.addEventListener('input', () => {
         const inputValue = searchInput.value.trim();
         if (inputValue) {
             const filteredSuggestions = filterSuggestions(inputValue);
             showSuggestions(filteredSuggestions);
         } else {
             suggestionsList.innerHTML = ''; // Effacer les suggestions si le champ est vide
         }
     });

     // Gérer la sélection d'une suggestion
     suggestionsList.addEventListener('click', event => {
         if (event.target.tagName === 'LI') {
             searchInput.value = event.target.textContent;
             suggestionsList.innerHTML = ''; // Effacer les suggestions après la sélection
         }
     });
 })
 .catch(error => console.error('Erreur lors du chargement du fichier JSON :', error));

 /* Affichage des ingrediens et des etapes*/

