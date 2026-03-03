document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.recipe-tab-btn');
    const recipePanes = document.querySelectorAll('.recipe-pane');

    const recipeTimes = {
        'recipe-chicken': 2400,
        'recipe-mousse': 7200
    };

    let currentTimerInterval;
    let timeLeft = 0;
    let initialTime = 0;

    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-timer');
    const resetBtn = document.getElementById('reset-timer');

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const updateTimerDisplay = (time) => {
        timerDisplay.textContent = formatTime(time);
    };

    const setTimerForRecipe = (targetId) => {
        clearInterval(currentTimerInterval);
        startBtn.textContent = 'Start Timer';
        startBtn.disabled = false;

        initialTime = recipeTimes[targetId] || 0;
        timeLeft = initialTime;
        updateTimerDisplay(timeLeft);
    };

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            try {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                recipePanes.forEach(pane => pane.classList.remove('active'));

                button.classList.add('active');
                const targetId = button.getAttribute('data-target');
                const targetPane = document.getElementById(targetId);

                if (targetPane) {
                    targetPane.classList.add('active');
                    console.log(`Переключено на рецепт: ${targetId}`);
                    setTimerForRecipe(targetId);
                }
            } catch (error) {
                console.error("Ошибка при переключении табов:", error);
            }
        });
    });

    const initialActiveTab = document.querySelector('.recipe-tab-btn.active');
    if (initialActiveTab) {
        setTimerForRecipe(initialActiveTab.getAttribute('data-target'));
    }

    startBtn.addEventListener('click', () => {
        if (timeLeft > 0 && startBtn.textContent === 'Start Timer') {
            startBtn.textContent = 'Running...';
            startBtn.disabled = true;

            currentTimerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(currentTimerInterval);
                    timerDisplay.textContent = "00:00";
                    startBtn.textContent = 'Done!';
                    alert("Время вышло! Ваше блюдо готово!");
                }
            }, 1000);
        }
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(currentTimerInterval);
        timeLeft = initialTime;
        updateTimerDisplay(timeLeft);
        startBtn.textContent = 'Start Timer';
        startBtn.disabled = false;
    });

    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');
    const authorInput = document.getElementById('comment-author');
    const textInput = document.getElementById('comment-text');

    if (commentForm) {
        commentForm.addEventListener('submit', (event) => {
            event.preventDefault();

            try {
                console.log('Попытка отправки комментария...');

                const author = authorInput.value.trim();
                const text = textInput.value.trim();

                if (!author || !text) {
                    console.warn('Валидация не пройдена: поля не могут быть пустыми.');
                    return;
                }

                const newComment = document.createElement('div');
                newComment.classList.add('comment-item');

                const currentDate = new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                newComment.innerHTML = `
                    <strong>${author}</strong>
                    <span class="comment-date">${currentDate}</span>
                    <p>${text}</p>
                `;

                commentsList.appendChild(newComment);

                console.log(`Комментарий успешно добавлен`);
                console.dir({ author: author, text: text, date: currentDate });

                commentForm.reset();

            } catch (error) {
                console.error('Ошибка при добавлении комментария:', error);
            }
        });
    }
});