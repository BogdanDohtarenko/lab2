
const FAVORITES_KEY = 'tastyblog_favorites';

export function getFavorites() {
    try {
        const data = localStorage.getItem(FAVORITES_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Ошибка при чтении из LocalStorage:', error);
        return [];
    }
}

export function addFavorite(recipe) {
    try {
        const favorites = getFavorites();
        const isAlreadySaved = favorites.some(item => item.id === recipe.id);
        
        if (!isAlreadySaved) {
            favorites.push(recipe);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            console.log('Рецепт успешно добавлен в избранное!');
        }
    } catch (error) {
        console.error('Ошибка при сохранении в LocalStorage:', error);
    }
}

export function removeFavorite(recipeId) {
    try {
        let favorites = getFavorites();
        favorites = favorites.filter(item => item.id !== recipeId);
        
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        console.log('Рецепт удален из избранного.');
    } catch (error) {
        console.error('Ошибка при удалении из LocalStorage:', error);
    }
}