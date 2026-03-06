import { API_BASE_URL } from './config.js';

export async function fetchRecipes(query) {
    try {
        const url = `${API_BASE_URL}/search.php?s=${query}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data.meals; 
        
    } catch (error) {
        console.error('Ошибка при загрузке рецептов:', error);
        return null;
    }
}