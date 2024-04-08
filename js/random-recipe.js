// Liste des recettes
const recipes = [
    { name: "Poulet rôti aux herbes", duration: "60 mins", image: "images/poulet-roti.jpg" },
    { name: "Ratatouille provençale", duration: "60 mins", image: "images/ratatouille.jpg" },
    { name: "Risotto aux champignons", duration: "40 mins", image: "images/risotto.webp" },
    { name: "Salade de quinoa aux légumes grillés", duration: "30 mins", image: "images/salade-quinoa.jpeg" },
    { name: "Tarte aux pommes", duration: "60 mins", image: "images/tarte-pomme.jpg" },
    { name: "Soupe de lentilles", duration: "60 mins", image: "images/soupe-lentille.jpg" },
    { name: "Pâtes Carbonara", duration: "20 mins", image: "images/pate-carbonara.jpg" },
    { name: "Salade de fruits frais", duration: "20 mins", image: "images/salade-fruit.jpg" },
    { name: "Salade César", duration: "20 mins", image: "images/salade-cesar.jpg" },
    { name: "Muffins aux myrtilles", duration: "30 mins", image: "images/muffin.webp" },
    { name: "Lasagnes végétariennes", duration: "90 mins", image: "images/lasagne-vege.png" },
    { name: "Tiramisu", duration: "30 mins", image: "images/tiramisu.jpg" }

    // Ajoutez d'autres recettes ici
];

// Nombre de recettes à afficher
const numberOfRecipesToShow = 3;

// Fonction pour afficher une sélection aléatoire de recettes
function displayRandomRecipes() {
    const recipeContainer = document.getElementById("recipe-container");
    recipeContainer.innerHTML = '';

    const randomIndex = Math.floor(Math.random() * (recipes.length - numberOfRecipesToShow + 1));
    const randomRecipes = recipes.slice(randomIndex, randomIndex + numberOfRecipesToShow);

    randomRecipes.forEach(recipe => {
        const col = document.createElement('div');
        col.classList.add('col');

        col.innerHTML = `
            <div class="card h-100 shadow-sm"> <!-- Ajoutez la classe h-100 pour définir une hauteur fixe pour la carte -->
                <img src="${recipe.image}" class="card-img-top" alt="Image de la recette"> <!-- Ajoutez la classe card-img-top pour contrôler le dimensionnement de l'image -->
                <div class="card-body">
                    <p class="card-text">${recipe.name}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">Voir la recette</button>
                        </div>
                        <small class="text-body-secondary">${recipe.duration}</small>
                    </div>
                </div>
            </div>
        `;

        recipeContainer.appendChild(col);
    });
}

// Appeler la fonction pour afficher les recettes aléatoires au chargement de la page
displayRandomRecipes();
