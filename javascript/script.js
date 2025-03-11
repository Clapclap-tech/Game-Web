const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const canvasSize = 400;
const gridSize = 20;
let snake, direction, food, gameRunning;

initializeGame();
document.addEventListener("keydown", changeDirection);

function initializeGame() {
    snake = [{x: 200, y: 200}];
    direction = "RIGHT";
    food = getRandomFoodPosition();
    gameRunning = true;
    gameLoop();
}

// keybinds
function changeDirection(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (event.key.toLowerCase() === "r") gameOver();
}

function gameLoop() {
    if (!gameRunning) return;

    let head = {x: snake[0].x, y: snake[0].y};

    // move direction
    if (direction === "UP") head.y -= gridSize;
    if (direction === "DOWN") head.y += gridSize;
    if (direction === "LEFT") head.x -= gridSize;
    if (direction === "RIGHT") head.x += gridSize;

    // Wrap around the canvas edges
    if (head.x < 0) head.x = canvasSize - gridSize;
    if (head.x >= canvasSize) head.x = 0;
    if (head.y < 0) head.y = canvasSize - gridSize;
    if (head.y >= canvasSize) head.y = 0;

    // lose condition
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // food check
    if (head.x === food.x && head.y === food.y) {
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }

    // pass through wall
    snake.unshift(head);

    // canvas draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, gridSize, gridSize));
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    setTimeout(gameLoop, 100); // snake speed
}

function getRandomFoodPosition() {
    return {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
    };
}

function gameOver() {
    gameRunning = false;
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvasSize / 2, canvasSize / 2);
    showResetButton();
}

function showResetButton() {
    let resetButton = document.getElementById("resetButton");
    if (!resetButton) {
        resetButton = document.createElement("button");
        resetButton.id = "resetButton";
        resetButton.innerText = "Restart Game";
        resetButton.style.position = "absolute";
        resetButton.style.top = canvas.offsetTop + canvasSize / 2 + 30 + "px";
        resetButton.style.left = canvas.offsetLeft + canvasSize / 2 - 50 + "px";
        resetButton.style.padding = "10px";
        resetButton.style.fontSize = "16px";
        resetButton.style.cursor = "pointer";
        resetButton.onclick = () => {
            resetButton.remove();
            initializeGame();
        };
        document.body.appendChild(resetButton);
    }
}

gameLoop();
