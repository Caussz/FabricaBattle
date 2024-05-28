document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const gameField = document.querySelector('.game-field');
    const pauseMenu = document.getElementById('pause-menu');
    const shopMenu = document.getElementById('shop-menu');
    const resumeButton = document.getElementById('resume-button');
    const backToMenuButton = document.getElementById('back-to-menu-button');
    const closeShopButton = document.getElementById('close-shop-button');
    const specialPowerIndicator = document.getElementById('special-power-indicator');

    let isPaused = false;
    let isShopOpen = false;
    let lastDirection = 'right';
    let bulletId = 0;
    let bulletCount = 0;
    let coinCount = 0;
    let specialPowerAvailable = true;

    const coinCounter = document.createElement('div');
    coinCounter.style.position = 'absolute';
    coinCounter.style.top = '10px';
    coinCounter.style.right = '10px';
    coinCounter.style.color = 'white';
    coinCounter.style.fontSize = '20px';
    coinCounter.style.fontFamily = 'Arial, sans-serif';
    coinCounter.innerText = `Moedas: ${coinCount}`;
    document.body.appendChild(coinCounter);

    const updateCoinCounter = () => {
        coinCounter.innerText = `Moedas: ${coinCount}`;
    };

    const playerMovement = {
        step: 5,
        directions: { left: false, right: false, up: false, down: false },
        move() {
            const left = parseInt(window.getComputedStyle(player).left);
            const top = parseInt(window.getComputedStyle(player).top);
            if (this.directions.left && left > 0 && !isCollidingWithObstacle(left - this.step, top)) {
                player.style.left = `${left - this.step}px`;
                lastDirection = 'left';
            }
            if (this.directions.right && left < gameField.offsetWidth - player.offsetWidth && !isCollidingWithObstacle(left + this.step, top)) {
                player.style.left = `${left + this.step}px`;
                lastDirection = 'right';
            }
            if (this.directions.up && top > 0 && !isCollidingWithObstacle(left, top - this.step)) {
                player.style.top = `${top - this.step}px`;
                lastDirection = 'up';
            }
            if (this.directions.down && top < gameField.offsetHeight - player.offsetHeight && !isCollidingWithObstacle(left, top + this.step)) {
                player.style.top = `${top + this.step}px`;
                lastDirection = 'down';
            }
            checkCoinCollision();
        }
    };

    const togglePause = () => {
        isPaused = !isPaused;
        pauseMenu.style.display = isPaused ? 'block' : 'none';
    };

    const toggleShop = () => {
        isShopOpen = !isShopOpen;
        shopMenu.style.display = isShopOpen ? 'block' : 'none';
    };

    const handleKeydown = (event) => {
        if (isPaused && event.key !== 'Escape') return;

        switch (event.key.toLowerCase()) {
            case 'a':
                playerMovement.directions.left = true;
                break;
            case 'd':
                playerMovement.directions.right = true;
                break;
            case 'w':
                playerMovement.directions.up = true;
                break;
            case 's':
                playerMovement.directions.down = true;
                break;
            case 'escape':
                togglePause();
                break;
            case 'b':
                toggleShop();
                break;
            case 'e':
                if (specialPowerAvailable) {
                    useSpecialPower();
                }
                break;
        }
    };

    const handleKeyup = (event) => {
        switch (event.key.toLowerCase()) {
            case 'a':
                playerMovement.directions.left = false;
                break;
            case 'd':
                playerMovement.directions.right = false;
                break;
            case 'w':
                playerMovement.directions.up = false;
                break;
            case 's':
                playerMovement.directions.down = false;
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
                return;
            }

            const obstacles = document.querySelectorAll('.obstacle');
            for (const obstacle of obstacles) {
                const obstacleRect = obstacle.getBoundingClientRect();
                if (
                    bulletRect.left < obstacleRect.right &&
                    bulletRect.right > obstacleRect.left &&
                    bulletRect.top < obstacleRect.bottom &&
                    bulletRect.bottom > obstacleRect.top
                ) {
                    clearInterval(interval);
                    bullet.remove();
                    handleObstacleDamage(obstacle);
                    break;
                }
            }
        }, 50);
    };

    const createSpecialPower = () => {
        const specialPower = document.createElement('div');
        specialPower.classList.add('special-power');
        gameField.appendChild(specialPower);

        const playerRect = player.getBoundingClientRect();
        specialPower.style.left = `${playerRect.left + playerRect.width / 2 - 5}px`;
        specialPower.style.top = `${playerRect.top + playerRect.height / 2 - 5}px`;

        return specialPower;
    };

    const moveSpecialPower = (specialPower) => {
        const specialPowerSpeed = 15;
        const interval = setInterval(() => {
            if (isPaused) return;

            let specialPowerRect = specialPower.getBoundingClientRect();

            switch (specialPower.dataset.direction) {
                case 'left':
                    specialPower.style.left = `${specialPowerRect.left - specialPowerSpeed}px`;
                    break;
                case 'right':
                    specialPower.style.left = `${specialPowerRect.left + specialPowerSpeed}px`;
                    break;
                case 'up':
                    specialPower.style.top = `${specialPowerRect.top - specialPowerSpeed}px`;
                    break;
                case 'down':
                    specialPower.style.top = `${specialPowerRect.top + specialPowerSpeed}px`;
                    break;
            }

            specialPowerRect = specialPower.getBoundingClientRect();
            if (
                specialPowerRect.left < 0 ||
                specialPowerRect.right > window.innerWidth ||
                specialPowerRect.top < 0 ||
                specialPowerRect.bottom > window.innerHeight
            ) {
                clearInterval(interval);
                specialPower.remove();
                return;
            }

            const obstacles = document.querySelectorAll('.obstacle');
            for (const obstacle of obstacles) {
                const obstacleRect = obstacle.getBoundingClientRect();
                if (
                    specialPowerRect.left < obstacleRect.right &&
                    specialPowerRect.right > obstacleRect.left &&
                    specialPowerRect.top < obstacleRect.bottom &&
                    specialPowerRect.bottom > obstacleRect.top
                ) {
                    clearInterval(interval);
                    specialPower.remove();
                    obstacle.remove();
                    generateCoins(obstacle);
                    break;
                }
            }
        }, 50);
    };

    const useSpecialPower = () => {
        const specialPower = createSpecialPower();
        specialPower.dataset.direction = lastDirection;
        moveSpecialPower(specialPower);
        specialPowerAvailable = false;
        specialPowerIndicator.classList.add('disabled');
        specialPowerIndicator.innerText = 'E não disponível';

        setTimeout(() => {
            specialPowerAvailable = true;
            specialPowerIndicator.classList.remove('disabled');
            specialPowerIndicator.innerText = 'E disponível';
        }, 90000);
    };

    const handleObstacleDamage = (obstacle) => {
        let health = parseInt(obstacle.dataset.health);
        health -= 1;
        obstacle.dataset.health = health;

        const healthBar = obstacle.querySelector('.health-bar');
        healthBar.style.width = `${(health / 10) * 100}%`;

        if (health <= 0) {
            generateCoins(obstacle);
            obstacle.remove();
        }
    };

    const createObstacle = () => {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.dataset.health = 10;
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
        gameField.appendChild(obstacle);

        const healthBarContainer = document.createElement('div');
        healthBarContainer.classList.add('health-bar-container');
        healthBarContainer.style.position = 'absolute';
        healthBarContainer.style.width = '100%';
        healthBarContainer.style.height = '5px';
        healthBarContainer.style.bottom = '0';
        healthBarContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        obstacle.appendChild(healthBarContainer);

        const healthBar = document.createElement('div');
        healthBar.classList.add('health-bar');
        healthBar.style.width = '100%';
        healthBar.style.height = '100%';
        healthBar.style.backgroundColor = 'green';
        healthBarContainer.appendChild(healthBar);
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

    const checkCoinCollision = () => {
        const playerRect = player.getBoundingClientRect();
        const coins = document.querySelectorAll('.coin');
        coins.forEach(coin => {
            const coinRect = coin.getBoundingClientRect();
            if (
                playerRect.left < coinRect.right &&
                playerRect.right > coinRect.left &&
                playerRect.top < coinRect.bottom &&
                playerRect.bottom > coinRect.top
            ) {
                coin.remove();
                coinCount++;
                updateCoinCounter();
            }
        });
    };

    const handleMouseClick = () => {
        if (isPaused || isShopOpen) return;

        const bullet = createBullet();
        bullet.dataset.direction = lastDirection;
        moveBullet(bullet);
        bulletCount++;
    };

    const createCoin = (left, top) => {
        const coin = document.createElement('div');
        coin.classList.add('coin');
        coin.style.width = '20px';
        coin.style.height = '20px';
        coin.style.backgroundColor = 'gold';
        coin.style.position = 'absolute';
        coin.style.borderRadius = '50%';
        coin.style.left = `${left}px`;
        coin.style.top = `${top}px`;
        gameField.appendChild(coin);
    };

    const generateCoins = (obstacle) => {
        const numCoins = Math.floor(Math.random() * 3) + 1;
        const obstacleRect = obstacle.getBoundingClientRect();
        for (let i = 0; i < numCoins; i++) {
            const left = obstacleRect.left + Math.random() * obstacleRect.width;
            const top = obstacleRect.top + Math.random() * obstacleRect.height;
            createCoin(left, top);
        }
    };

    const createRandomCoins = (numCoins) => {
        for (let i = 0; i < numCoins; i++) {
            let left, top;
            do {
                left = Math.floor(Math.random() * (gameField.offsetWidth - 20));
                top = Math.floor(Math.random() * (gameField.offsetHeight - 20));
            } while (isTooClose(left, top, 20));
            createCoin(left, top);
        }
    };

    const setupEventListeners = () => {
        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('keyup', handleKeyup);
        resumeButton.addEventListener('click', togglePause);
        backToMenuButton.addEventListener('click', () => {
            window.location.href = '../../index.html';
        });
        closeShopButton.addEventListener('click', toggleShop);
    };

    const setupGame = () => {
        for (let i = 0; i < 10; i++) {
            createObstacle();
        }
        createRandomCoins(10);
        setupEventListeners();
        setInterval(() => {
            if (!isPaused) playerMovement.move();
        }, 20);
    };

    setupGame();
});
