document.getElementById('regenerateMaze').addEventListener('click', () => {
    window.location.reload();
});

document.getElementById('lifetimeScore').innerText = localStorage.getItem('lifetimeScore') ? `Lifetime Score: ${localStorage.getItem('lifetimeScore')}` : 'Lifetime Score: 0';

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const score = parseInt(localStorage.getItem('lifetimeScore')) 
let rows = 0;
let cols = 0;
if (score >= 2) {
    canvas.width = 840;
    canvas.height = 840;
    rows = 21
    cols = 21
} else if (score == 1) {
    canvas.width = 600;
    canvas.height = 600;
    rows = 15
    cols = 15
} else {
    canvas.width = 440;
    canvas.height = 440;
    rows = 11
    cols = 11
}

const cellSize = canvas.width / cols;
const maze = [];

for (let y = 0; y < rows; y++) {
    maze[y] = [];
    for (let x = 0; x < cols; x++) {
        maze[y][x] = 1;
    }
}

const player = {
    x: 0,
    y: 0,
    size: cellSize / 2,
    color: 'red'
};

let exit = {
    x: cols - 1,
    y: rows - 1,
    size: cellSize,
    color: 'blue'
};

function carvePassagesFrom(x, y) {
    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];

    directions.sort(() => Math.random() - 0.5);

    for (let i = 0; i < directions.length; i++) {
        const dx = directions[i][0];
        const dy = directions[i][1];
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] === 1) {
            maze[y + dy][x + dx] = 0;
            maze[ny][nx] = 0;
            carvePassagesFrom(nx, ny);
        }
    }
}

maze[0][0] = 0;
carvePassagesFrom(0, 0);
maze[rows - 1][cols - 1] = 0;

function drawMaze() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? 'black' : 'white';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function drawPlayer() {
    var background = new Image();
    background.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpr9mKvegQ7ibIh5fbFkZHmkiGTs_U42GvJjizL-SEJg&s";
    ctx.fillStyle = player.color;
    ctx.drawImage(background, player.x * cellSize + (cellSize - player.size) / 2, player.y * cellSize + (cellSize - player.size) / 2, player.size, player.size);
}

function drawExit() {
    ctx.fillStyle = exit.color;
    ctx.fillRect(exit.x * cellSize, exit.y * cellSize, exit.size, exit.size);
}

function checkCollision(x, y) {
    return maze[y][x] === 1;
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && !checkCollision(newX, newY)) {
        player.x = newX;
        player.y = newY;
    }
}

function checkWin() {
    console.log("win")
    if (player.x === exit.x && player.y === exit.y) {
        
        localStorage.getItem('lifetimeScore') ? localStorage.setItem('lifetimeScore', parseInt(localStorage.getItem('lifetimeScore')) + 1) : localStorage.setItem('lifetimeScore', 1);
        if (localStorage.getItem('lifetimeScore') >= 3) {
            alert("Where our first kiss was a bit amiss,\nSearch there, it's not a place you'd miss.\nA keyhole waits, for your key's bliss,\nUnlock the secret, reveal what's beneath this.");
        } else if (localStorage.getItem('lifetimeScore') == 2) {
            alert("Congratulations, you've escaped the second maze! One more left, do you take the chanllenge?");
        } else if (localStorage.getItem('lifetimeScore') == 1) {
            alert("Congratulations, you've escaped the first maze! Now we dare you to do it again!");
        }
        window.location.reload();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPlayer();
    drawExit();
    requestAnimationFrame(draw);
}

draw();

window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            e.preventDefault();
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            e.preventDefault();
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            e.preventDefault();
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            e.preventDefault();
            break;
    }
    checkWin();
});

document.getElementById('moveUp').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('moveDown').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('moveLeft').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('moveRight').addEventListener('click', () => movePlayer(1, 0));
