document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const gameField = document.querySelector('.game-field');
    const pauseMenu = document.getElementById('pause-menu');
    const resumeButton = document.getElementById('resume-button');
    const backToMenuButton = document.getElementById('back-to-menu-button');

    let isPaused = false;
    let lastDirection = 'right';
    let bulletId = 0;

    const playerMovement = {
        step: 5,
        moveLeft() {
            const left = parseInt(window.getComputedStyle(player).left);
            player.style.left = `${left - this.step}px`;
            lastDirection = 'left';
        },
        moveRight() {
            const left = parseInt(window.getComputedStyle(player).left);
            player.style.left = `${left + this.step}px`;
            lastDirection = 'right';
        },
        moveUp() {
            const top = parseInt(window.getComputedStyle(player).top);
            player.style.top = `${top - this.step}px`;
            lastDirection = 'up';
        },
        moveDown() {
            const top = parseInt(window.getComputedStyle(player).top);
            player.style.top = `${top + this.step}px`;
            lastDirection = 'down';
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

    const createBullet = () => {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        bullet.id = `bullet-${bulletId++}`;
        gameField.appendChild(bullet);

        const playerRect = player.getBoundingClientRect();
        bullet.style.left = `${playerRect.left + playerRect.width / 2 - 2.5}px`;
        bullet.style.top = `${playerRect.top + playerRect.height / 2 - 2.5}px`;

        return bullet;
    };

    const moveBullet = (bullet) => {
        const bulletSpeed = 10;
        const interval = setInterval(() => {
            if (isPaused) return;

            let bulletRect = bullet.getBoundingClientRect();

            switch (bullet.dataset.direction) {
                case 'left':
                    bullet.style.left = `${bulletRect.left - bulletSpeed}px`;
                    break;
                case 'right':
                    bullet.style.left = `${bulletRect.left + bulletSpeed}px`;
                    break;
                case 'up':
                    bullet.style.top = `${bulletRect.top - bulletSpeed}px`;
                    break;
                case 'down':
                    bullet.style.top = `${bulletRect.top + bulletSpeed}px`;
                    break;
            }

            bulletRect = bullet.getBoundingClientRect();
            if (
                bulletRect.left < 0 ||
                bulletRect.right > window.innerWidth ||
                bulletRect.top < 0 ||
                bulletRect.bottom > window.innerHeight
            ) {
                clearInterval(interval);
                bullet.remove();
            }
        }, 1000 / 60);
    };

    const handleMouseClick = () => {
        if (isPaused) return;

        const bullet = createBullet();
        bullet.dataset.direction = lastDirection;
        moveBullet(bullet);
    };

    const setupEventListeners = () => {
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('click', handleMouseClick);
        resumeButton.addEventListener('click', togglePause);
        backToMenuButton.addEventListener('click', () => {
            window.location.href = '../../index.html';
        });
    };

    setupEventListeners();
});
