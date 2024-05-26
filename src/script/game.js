document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const pauseMenu = document.getElementById('pause-menu');
    const resumeButton = document.getElementById('resume-button');
    const backToMenuButton = document.getElementById('back-to-menu-button');

    let isPaused = false;

    const playerMovement = {
        step: 5,
        moveLeft() {
            const left = parseInt(window.getComputedStyle(player).left);
            player.style.left = `${left - this.step}px`;
        },
        moveRight() {
            const left = parseInt(window.getComputedStyle(player).left);
            player.style.left = `${left + this.step}px`;
        },
        moveUp() {
            const top = parseInt(window.getComputedStyle(player).top);
            player.style.top = `${top - this.step}px`;
        },
        moveDown() {
            const top = parseInt(window.getComputedStyle(player).top);
            player.style.top = `${top + this.step}px`;
        }
    };

    const togglePause = () => {
        isPaused = !isPaused;
        pauseMenu.style.display = isPaused ? 'block' : 'none';
    };

    const handleKeydown = (event) => {
        if (isPaused && event.key !== 'Escape') return;

        switch (event.key.toLowerCase()) {
            case 'a':
                playerMovement.moveLeft();
                break;
            case 'd':
                playerMovement.moveRight();
                break;
            case 'w':
                playerMovement.moveUp();
                break;
            case 's':
                playerMovement.moveDown();
                break;
            case 'escape':
                togglePause();
                break;
        }
    };

    const setupEventListeners = () => {
        document.addEventListener('keydown', handleKeydown);
        resumeButton.addEventListener('click', togglePause);
        backToMenuButton.addEventListener('click', () => {
            window.location.href = '../../index.html';
        });
    };

    setupEventListeners();
});
