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
            if (left > 0 && !isCollidingWithObstacle(left - this.step, parseInt(window.getComputedStyle(player).top))) {
                player.style.left = `${left - this.step}px`;
                lastDirection = 'left';
            }
        },
        moveRight() {
            const left = parseInt(window.getComputedStyle(player).left);
            if (left < gameField.offsetWidth - player.offsetWidth && !isCollidingWithObstacle(left + this.step, parseInt(window.getComputedStyle(player).top))) {
                player.style.left = `${left + this.step}px`;
                lastDirection = 'right';
            }
        },
        moveUp() {
            const top = parseInt(window.getComputedStyle(player).top);
            if (top > 0 && !isCollidingWithObstacle(parseInt(window.getComputedStyle(player).left), top - this.step)) {
                player.style.top = `${top - this.step}px`;
                lastDirection = 'up';
            }
        },
        moveDown() {
            const top = parseInt(window.getComputedStyle(player).top);
            if (top < gameField.offsetHeight - player.offsetHeight && !isCollidingWithObstacle(parseInt(window.getComputedStyle(player).left), top + this.step)) {
                player.style.top = `${top + this.step}px`;
                lastDirection = 'down';
            }
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
                bullet                .Rect.right > window.innerWidth ||
                bulletRect.top < 0 ||
                bulletRect.bottom > window.innerHeight
            ) {
                clearInterval(interval);
                bullet.remove();
            }
        }, 1000 / 60);
    };

    const createObstacle = () => {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.backgroundColor = 'brown';

        const obstacleSize = Math.floor(Math.random() * 50) + 30;
        obstacle.style.width = `${obstacleSize}px`;
        obstacle.style.height = `${obstacleSize}px`;
        obstacle.style.position = 'absolute';

        let left, top;
        do {
            left = Math.floor(Math.random() * (gameField.offsetWidth - obstacleSize));
            top = Math.floor(Math.random() * (gameField.offsetHeight - obstacleSize));
        } while (isTooClose(left, top, obstacleSize));

        obstacle.style.left = `${left}px`;
        obstacle.style.top = `${top}px`;
console.log(left);
        gameField.appendChild(obstacle);
    };

    const isTooClose = (left, top, size) => {
        const obstacles = document.querySelectorAll('.obstacle');
        for (const obstacle of obstacles) {
            const rect = obstacle.getBoundingClientRect();
            const obstacleCenterX = rect.left + rect.width / 2;
            const obstacleCenterY = rect.top + rect.height / 2;

            const distance = Math.sqrt((left - obstacleCenterX) ** 2 + (top - obstacleCenterY) ** 2);
            if (distance < size + rect.width / 2 + 50) {
                return true;
            }
        }
        return false;
    };



    const isCollidingWithObstacle = (left, top) => {
        const playerRect = player.getBoundingClientRect();
        const playerCenterX = playerRect.left + playerRect.width / 2;
        const playerCenterY = playerRect.top + playerRect.height / 2;

        const obstacles = document.querySelectorAll('.obstacle');
        for (const obstacle of obstacles) {
            const obstacleRect = obstacle.getBoundingClientRect();
            if (
                left < obstacleRect.right &&
                left + playerRect.width > obstacleRect.left &&
                top < obstacleRect.bottom &&
                top + playerRect.height > obstacleRect.top
            ) {
                return true;
            }
        }
        return false;
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

    const setupGame = () => {
        for (let i = 0; i < 10; i++) {
            createObstacle();
        }
        setupEventListeners();
    };

    setupGame();
});

