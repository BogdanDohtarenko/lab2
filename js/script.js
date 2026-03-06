import { fetchRecipes } from './api/apiService.js';
import { getFavorites, addFavorite, removeFavorite } from './storage/localStorage.js';
import { parseRecipeList } from './utils/dataParser.js';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    const resultsContainer = document.getElementById('results-container');
    const favoritesContainer = document.getElementById('favorites-container');
    const searchTitle = document.getElementById('search-title');
    const searchForm = document.querySelector('.nav-controls form');

    if (resultsContainer && favoritesContainer) {
        renderFavorites();

        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');

        if (query) {
            searchTitle.textContent = `Search Results for: "${query}"`;
            await handleSearch(query);
        } else {
            resultsContainer.innerHTML = '<p>Пожалуйста, введите название рецепта в строку поиска.</p>';
        }

        if (searchForm) {
            searchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const input = searchForm.querySelector('input[name="q"]');
                const newQuery = input.value.trim();
                
                if (newQuery) {
                    searchTitle.textContent = `Search Results for: "${newQuery}"`;
                    window.history.pushState({}, '', `search.html?q=${newQuery}`);
                    await handleSearch(newQuery); 
                }
            });
        }
    }
}

async function handleSearch(query) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '<p>Загрузка рецептов...</p>'; 

    try {
        const rawData = await fetchRecipes(query);
        
        if (!rawData) {
            resultsContainer.innerHTML = '<p>Рецепты не найдены или нет подключения к интернету.</p>';
            return;
        }

        const parsedRecipes = parseRecipeList(rawData);
        renderResults(parsedRecipes);

    } catch (error) {
        console.error('Ошибка поиска:', error);
        resultsContainer.innerHTML = '<p>Произошла ошибка при загрузке. Проверьте сеть.</p>';
    }
}

function renderResults(recipes) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    if (recipes.length === 0) {
        resultsContainer.innerHTML = '<p>По вашему запросу ничего не найдено.</p>';
        return;
    }

    const currentFavorites = getFavorites();

    recipes.forEach(recipe => {
        // Проверяем, есть ли этот рецепт уже в избранном
        const isFav = currentFavorites.some(fav => fav.id === recipe.id);
        const card = createRecipeCard(recipe, isFav);
        resultsContainer.appendChild(card);
    });
}

function renderFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    const favorites = getFavorites();
    
    favoritesContainer.innerHTML = ''; 
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>У вас пока нет сохраненных рецептов.</p>';
        return;
    }

    favorites.forEach(recipe => {
        const card = createRecipeCard(recipe, true);
        favoritesContainer.appendChild(card);
    });
}

function createRecipeCard(recipe, isFavorite) {
    const article = document.createElement('article');
    article.className = 'recipe-card';
    
    article.innerHTML = `
        <img src="${recipe.imageUrl}" alt="${recipe.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0;">
        <div class="recipe-info" style="padding: 15px;">
            <h3>${recipe.title}</h3>
            <p><strong>Category:</strong> ${recipe.category}</p>
            <p><strong>Area:</strong> ${recipe.area}</p>
            <button class="cta-button action-btn" style="margin-top: 10px; width: 100%; font-size: 14px; padding: 10px;">
                ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
        </div>
    `;

    const btn = article.querySelector('.action-btn');
    btn.addEventListener('click', () => {
        if (isFavorite) {
            removeFavorite(recipe.id);
        } else {
            addFavorite(recipe);
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        
        renderFavorites();
        if (query) {
            handleSearch(query); 
        }
    });

    return article;
}