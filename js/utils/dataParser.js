export function parseRecipeData(rawData) {
    if (!rawData) return null;

    const parsedRecipe = {
        id: rawData.idMeal,
        title: rawData.strMeal,
        category: rawData.strCategory,
        area: rawData.strArea,
        instructions: rawData.strInstructions,
        imageUrl: rawData.strMealThumb,
        tags: rawData.strTags ? rawData.strTags.split(',') : [], 
        ingredients: []
    };

    for (let i = 1; i <= 20; i++) {
        const ingredient = rawData[`strIngredient${i}`];
        const measure = rawData[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== '') {
            parsedRecipe.ingredients.push(`${ingredient.trim()} - ${measure ? measure.trim() : ''}`);
        }
    }

    return parsedRecipe;
}

export function parseRecipeList(rawList) {
    if (!Array.isArray(rawList)) return [];
    
    return rawList.map(recipe => parseRecipeData(recipe));
}