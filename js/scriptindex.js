fetch('../json/data.json')
.then(response => response.json())
.then(data => {
    const searchInput = document.getElementById('searchInput');
    const suggestionsList = document.getElementById('suggestions');
    const recetteDetailleeDiv = document.getElementById('recettedetailée');
    const carte1 = document.getElementById('carte1');
    const carte2 = document.getElementById('carte2');
    const carte3 = document.getElementById('carte3');
    const boutton1 = document.getElementById('boutton1');
    const boutton2 = document.getElementById('boutton2');
    const boutton3 = document.getElementById('boutton3');
    
    const recette = data.recettes.find(recette => recette.nom === 'Poulet rôti aux herbes');
    const recette2 = data.recettes.find(recette => recette.nom === 'Salade de quinoa aux légumes grillés');
    const recette3 = data.recettes.find(recette => recette.nom === 'Pâtes Carbonara');

    /* Affichage de Texts dans le cards en utilisant JSON */
    if (recette) {
        // Affichage des ingrédients "Poulet rôti aux herbes"
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
        // Affichage des ingrédients "Salade de quinoa aux légumes grillés"
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
    
    // Affichage des ingrédients "Pâtes Carbonara"
    if (recette3) {
        const listeIngredients = document.createElement('ul');
        recette3.ingredients.forEach(ingredient => {
            const uneListe = document.createElement('li');
            uneListe.textContent = `${ingredient.nom} ${ingredient.quantite}`;
            listeIngredients.appendChild(uneListe);  
        });
        carte3.appendChild(listeIngredients);
    } else {
        carte3.textContent = " La recette n'a pas été retrouvée ";
    }


        
    /* Affichage des éléments dans le bar de recherche */
   
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
            li.style.cursor = 'pointer'; // Ustawienie kształtu kursora
            li.addEventListener('click', () => afficheRecette(recette, recetteDetailleeDiv));
            li.addEventListener('mouseover', () => li.style.backgroundColor = '#c0c0c0'); // Zmiana koloru tła po najechaniu myszką
            li.addEventListener('mouseout', () => li.style.backgroundColor = 'inherit'); // Powrót do pierwotnego koloru tła po opuszczeniu myszką
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
            const selectedRecetteName = event.target.textContent;
            const selectedRecette = data.recettes.find(recette => recette.nom === selectedRecetteName);
            afficheRecette(selectedRecette);
            suggestionsList.innerHTML = ''; // Effacer les suggestions après la sélection
        }
    });
    
    // Fonction pour afficher les détails de la recette sélectionnée
    function afficheRecette(selectedRecette) {
        if (selectedRecette) {
            recetteDetailleeDiv.innerHTML = ''; // Effacer le contenu précédent
            const listeIngredients = document.createElement('ul');
            selectedRecette.ingredients.forEach(ingredient => {
                const uneListe = document.createElement('li');
                uneListe.textContent = `${ingredient.nom} : ${ingredient.quantite}`;
                listeIngredients.appendChild(uneListe);
            });

            const detailsHTML = `
                <h2>${selectedRecette.nom}</h2>
                <img src="${selectedRecette.image}" alt="${selectedRecette.nom}" style="max-width: 100%; height: auto;">
                <p>Catégorie: ${selectedRecette.categorie}</p>
                <p>Temps de préparation: ${selectedRecette.temps_preparation}</p>
                <p>Ingrédients:</p>
                ${listeIngredients.outerHTML}
                <p>Étapes: ${selectedRecette.etapes}</p>
            `;
            recetteDetailleeDiv.innerHTML = detailsHTML; // Afficher la recette
        } else {
            console.error('La recette demandée n\'a pas été trouvée.');
            recetteDetailleeDiv.textContent = "La recette demandée n'a pas été trouvée.";
        }
    }
    
    // Gérer le clic sur le bouton 1
    boutton1.addEventListener('click', () => {
        afficheRecette(recette);
    });
    
    // Gérer le clic sur le bouton 2
    boutton2.addEventListener('click', () => {
        afficheRecette(recette2);
    });

    // Gérer le clic sur le bouton 3
    boutton3.addEventListener('click', () => {
        afficheRecette(recette3);
    });
})
.catch(error => {
    console.error('Erreur lors du chargement des données JSON:', error);
    document.getElementById('jsonContent').textContent = 'Erreur lors du chargement des données JSON.';
});
