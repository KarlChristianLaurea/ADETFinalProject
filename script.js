const form = document.getElementById('ulamForm');
const appId = '7bbed00a';
const appKey = 'a2105e1880cf3fc83ecd540145106105';

document.addEventListener('DOMContentLoaded', function () {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const images = document.querySelectorAll('img.food-img');

  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', function () {
      const image = images[index];
      if (this.checked) {
        image.classList.add('selected');
        console.log('Image is selected:', image.src);
      } else {
        image.classList.remove('selected');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  $('#instructionsModal').modal('show');
});

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const proteinInputs = document.querySelectorAll(
    'input[name="protein"]:checked'
  );
  const vegetableInputs = document.querySelectorAll(
    'input[name="vegetables"]:checked'
  );
  const condimentInputs = document.querySelectorAll(
    'input[name="condiments"]:checked'
  );

  if (
    proteinInputs.length === 0 ||
    vegetableInputs.length === 0 ||
    condimentInputs.length === 0
  ) {
    alert(
      'Please select at least one item from each category: Protein, Vegetables, and Condiments.'
    );
    return;
  }

  const proteinValues = Array.from(proteinInputs).map((input) => input.value);
  const vegetableValues = Array.from(vegetableInputs).map(
    (input) => input.value
  );
  const condimentValues = Array.from(condimentInputs).map(
    (input) => input.value
  );

  const ingredients = [
    ...proteinValues,
    ...vegetableValues,
    ...condimentValues,
  ].join(', ');

  fetch(
    `https://api.edamam.com/search?q=${ingredients}+Filipino&app_id=${appId}&app_key=${appKey}&to=8`
  )
    .then((response) => response.json())
    .then((data) => {
      const recipes = data.hits.map((hit) => hit.recipe);

      if (recipes.length === 0) {
        alert(
          'No recipes found for the selected ingredients. Please change your selection and try again.'
        );
        return;
      }

      const newTab = window.open('', '_self');
      newTab.document.write(`
        <html>
          <head>
            <title>Recipe Suggestions</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

              *{
            font-family:"Poppins",sans-serif;
              }
              body {
                font-family:"Poppins",sans-serif;
                background-color: #fff4d7;
                padding: 20px;
              }
              #recipeResult {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                grid-gap: 10px;
                max-height: 90vh;
                overflow-y: auto;
                background-color: #fff4d7;
              }
                .recipe-option {
    height: 350px; /* Adjust the height as needed */
    overflow: hidden; /* Ensure content does not overflow the card */
  }
  .recipe-option img {
    height: 200px; /* Adjust the height of the image */
    object-fit: cover; /* Ensure the image covers the specified height without distortion */
  }
  .recipe-option h3 {
    margin: 10px 0;
    height: 50px; /* Adjust height to ensure consistency in card layout */
    overflow: hidden; /* Prevent title overflow */
    text-overflow: ellipsis; /* Add ellipsis if title overflows */
    white-space: nowrap; /* Prevent text from wrapping */
  }
              .card {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                text-align: center;
              }
              .card img {
                margin-bottom: 10px;
                width: 100%;
                height: auto;
              }
              #recipeDetailsContainer {
                display: grid;
                justify-content: center;
                align-items: center;
                width: 100%;
                margin-top: 40px; 
              }
              #recipeDetails {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-gap: 20px;
                max-width: 800px;
                width: 100%;
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
              }
              .recipe-info {
                background-color: #fff;
                padding: 10px;
              }
              .image-buttons {
                padding: 10px;
              }
              .image-buttons img {
                width: 100%;
                height: auto;
                margin-bottom: 10px;
              }
              .buttons {
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              .buttons button {
                margin: 5px 0;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
              }
              .buttons button:hover {
                background-color: #45a049;
              }
              h2{
              font-family:"Poppins",sans-serif;
              font-weight: bold;
              color: #e09c00;
              }
            </style>
          </head>
          <body>
            <h2 class="text-center mb-4">Select a Recipe</h2>
            <div id="recipeResult" class="container">
              <div class="row">
      `);

      recipes.forEach((recipe) => {
        newTab.document.write(`
          <div class="col-md-4 mb-4">
            <div class="card">
              <img src="${recipe.image}" class="card-img-top" alt="${
          recipe.label
        }">
              <div class="card-body">
                <h5 class="card-title">${recipe.label}</h5>
                <button class="btn btn-success" onclick="showRecipeDetails('${encodeURIComponent(
                  JSON.stringify(recipe)
                )}')">View Recipe</button>
              </div>
            </div>
          </div>
        `);
      });

      newTab.document.write(`
              </div>
            </div>
            <div id="recipeDetailsContainer" class="container">
              <div id="recipeDetails"></div>
            </div>
            <script>
              function showRecipeDetails(recipeData) {
                const decodedRecipeData = JSON.parse(decodeURIComponent(recipeData));

                const recipeInfo = document.createElement('div');
                recipeInfo.classList.add('recipe-info');
                const instructions = decodedRecipeData.instructions
                  ? decodedRecipeData.instructions
                  : \`<a href="https://www.google.com/search?q=\${encodeURIComponent(decodedRecipeData.label + ' step by step instructions')}" target="_blank">Search for step-by-step instructions</a>\`;

                recipeInfo.innerHTML = \`
                  <h2>\${decodedRecipeData.label}</h2>
                  <p>Ingredients: \${decodedRecipeData.ingredientLines.join(', ')}</p>
                  <p>\${instructions}</p>
                  <h3>Nutritional Information</h3>
                  <p>Calories: \${decodedRecipeData.calories.toFixed(0)}</p>
                  <p>Total Fat: \${decodedRecipeData.totalNutrients.FAT.quantity.toFixed(2)} \${decodedRecipeData.totalNutrients.FAT.unit}</p>
                  <p>Saturated Fat: \${decodedRecipeData.totalNutrients.FASAT.quantity.toFixed(2)} \${decodedRecipeData.totalNutrients.FASAT.unit}</p>
                  <p>Cholesterol: \${decodedRecipeData.totalNutrients.CHOLE.quantity.toFixed(2)} \${decodedRecipeData.totalNutrients.CHOLE.unit}</p>
                  <p>Sodium: \${decodedRecipeData.totalNutrients.NA.quantity.toFixed(2)} \${decodedRecipeData.totalNutrients.NA.unit}</p>
                  <p>Total Carbohydrates: \${decodedRecipeData.totalNutrients.CHOCDF.quantity.toFixed(2)} \${decodedRecipeData.totalNutrients.CHOCDF.unit}</p>
                  <p>Dietary Fiber: \${decodedRecipeData.totalNutrients.FIBTG.quantity.toFixed(2)} \${decodedRecipeData.totalNutrients.FIBTG.unit}</p>
                  <p>Sugars: \${decodedRecipeData.totalNutrients.SUGAR.quantity.toFixed(2)} \${decodedRecipeData.totalNutrients.SUGAR.unit}</p>
                  <p>Protein: \${decodedRecipeData.totalNutrients.PROCNT.quantity.toFixed(2)} \${decodedRecipeData.totalNutrients.PROCNT.unit}</p>
                \`;

                const imageButtons = document.createElement('div');
                imageButtons.classList.add('image-buttons');
                imageButtons.innerHTML = \`
                  <img src="\${decodedRecipeData.image}" alt="\${decodedRecipeData.label}" class="img-fluid"/>
                  <div class="buttons mt-3">
                    <button class="btn btn-primary" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })">Select Another Recipe</button>
<button class="btn btn-secondary" onclick="window.location.href = 'index.html'">Go Back to Home</button>

                  </div>
                \`;

                const recipeDetailsDiv = document.getElementById('recipeDetails');
                recipeDetailsDiv.innerHTML = '';
                recipeDetailsDiv.appendChild(recipeInfo);
                recipeDetailsDiv.appendChild(imageButtons);

                // Scroll to recipe details
                recipeDetailsDiv.scrollIntoView({ behavior: 'smooth' });
              }
            </script>
          </body>
        </html>
      `);
    })
    .catch((error) => console.error('Error fetching recipes:', error));
});
