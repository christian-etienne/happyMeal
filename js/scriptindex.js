 // Chargement des données JSON 
 fetch('../json/data.json')
 .then(response => response.json())
 .then(data => {
     const searchInput = document.getElementById('searchInput');
     const suggestionsList = document.getElementById('suggestions');
     
     const carte1 = document.getElementById('carte1');
     const carte2 = document.getElementById('carte2');
     const carte3 = document.getElementById('carte3');
     const recette = data.recettes.find(recette => recette.nom === 'Poulet rôti aux herbes');
     const recette2 = data.recettes.find(recette => recette.nom === 'Salade de quinoa aux légumes grillés');
     const recette3 = data.recettes.find(recette => recette.nom === 'Pâtes Carbonara');
     

     if (recette) {
        // Affichage des ingredients "Poulet rôti aux herbes"
        const listeIngredients = document.createElement('ul');
        recette.ingredients.forEach(ingredient => {
            const uneListe = document.createElement('li');
            uneListe.textContent = `${ingredient.nom} : ${ingredient.quantite}`;
            listeIngredients.appendChild(uneListe);
        });
        carte1.appendChild(listeIngredients);

    } else {
        carte1.textContent = "La recette n'a pas été retrouvée";
    }

    if (recette2) {
        // Affichage des ingredients "Poulet rôti aux herbes"
        const listeIngredients = document.createElement('ul');
        recette2.ingredients.forEach(ingredient => {
            const uneListe = document.createElement('li');
            uneListe.textContent = `${ingredient.nom} : ${ingredient.quantite}`;
            listeIngredients.appendChild(uneListe);
        });
        carte2.appendChild(listeIngredients);

    } else {
        carte2.textContent = "La recette n'a pas été retrouvée";
    }
       // Affichage des ingredients "Pâtes Carbonara"
    if (recette3) {
            const listeIngredients = document.createElement('ul');
            recette3.ingredients.forEach(ingredient => {
                const uneListe = document.createElement('li');
                uneListe.textContent = `${ingredient.nom} ${ingredient.quantite}`;
                listeIngredients.appendChild(uneListe);  
        });
        carte3.appendChild(listeIngredients);

    } else{
        carte3.textContent = " La recette n'a pas été retrouvé ";
        }
        

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

