document.addEventListener('DOMContentLoaded', () => {
    
    const tabButtons = document.querySelectorAll('.recipe-tab-btn');
    const recipePanes = document.querySelectorAll('.recipe-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            try {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                recipePanes.forEach(pane => pane.classList.remove('active'));

                button.classList.add('active');

                // Получаем ID нужного рецепта из data-target и показываем его
                const targetId = button.getAttribute('data-target');
                const targetPane = document.getElementById(targetId);
                
                if (targetPane) {
                    targetPane.classList.add('active');
                    console.log(`Переключено на рецепт: ${targetId}`);
                }
            } catch (error) {
                console.error("Ошибка при переключении табов:", error);
            }
        });
    });

});