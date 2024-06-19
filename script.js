const form = document.getElementById('ulamForm');
const appId = '7bbed00a';
const appKey = 'a2105e1880cf3fc83ecd540145106105';

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

      const newTab = window.open('', '_blank');
      newTab.document.write(`
        <html>
          <head>
            <title>Recipe Suggestions</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              #recipeResult {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              grid-template-columns: repeat(4, 1fr); /* Ensure only up to 4 items per row */
              grid-gap: 10px;
              max-height: 90vh; /* Limit to 90% of the viewport height */
              overflow-y: auto;
              }

              .recipe-option {
                background-color: #f5f5f5;
                padding: 20px;
                border-radius: 5px;
                text-align: center;
                justify-content: center;
                align-items: center;
              }
              .recipe-option button {
                all: unset;
                cursor: pointer;
                width: 100%;
                text-align: center;
              }
              .recipe-option img {
                margin-bottom: 10px;
                width: 100%;
                height: 100%;
              }
              #recipeDetailsContainer {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              margin: 20px 0;
              }
              #recipeDetails {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-gap: 20px;
                max-width: 800px;
                width: 100%;
                background-color: black;
                padding: 20px;
                border-radius: 10px;
              }
              .recipe-info {
                background-color: yellow;
                padding: 10px;
              }
              .image-buttons {
                background-color: red;
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
            </style>
          </head>
          <body>
            <h2>Select a Recipe</h2>
            <div id="recipeResult">
      `);

      recipes.forEach((recipe) => {
        newTab.document.write(`
          <div class="recipe-option">
            <button onclick="showRecipeDetails('${encodeURIComponent(
              JSON.stringify(recipe)
            )}')">
              <h3>${recipe.label}</h3>
              <img src="${recipe.image}" alt="${recipe.label}"/>
            </button>
          </div>
        `);
      });

      newTab.document.write(`
            </div>
            <div id="recipeDetailsContainer">
              <div id="recipeDetails"></div>
            </div>
            <script>
              function showRecipeDetails(recipeData) {
                const decodedRecipeData = JSON.parse(decodeURIComponent(recipeData));

                const recipeInfo = document.createElement('div');
                recipeInfo.classList.add('recipe-info');
                const instructions = decodedRecipeData.instructions
                  ? decodedRecipeData.instructions
                  : \`<a href="https://www.google.com/search?q=\${encodeURIComponent(decodedRecipeData.label + ' recipe')}" target="_blank">Search for step-by-step instructions</a>\`;

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
                  <img src="\${decodedRecipeData.image}" alt="\${decodedRecipeData.label}" style="width:100%;height:auto;"/>
                  <div class="buttons">
                    <button onclick="window.history.back()">Select Another Recipe</button>
                    <button onclick="window.close()">Go Back to Home</button>
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
