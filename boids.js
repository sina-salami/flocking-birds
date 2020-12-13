const WIDTH = 1200,
    HEIGHT = 700,
    BOIDS_NUM = 250,
    AVOIDING_DIST = 35;

let CENTERING_DIST = 55;

let boids = [];

window.onload = () => {
    window.addEventListener("resize", createFrame, false);
    createFrame();
    init();
    window.requestAnimationFrame(handleMovement);
}

const createFrame = () => {
    const frame = document.getElementById("frame");
    frame.style = "background: #0D1F2D;";
    frame.width = WIDTH;
    frame.height = HEIGHT;
};

const init = () => {
    for (i = 0; i < BOIDS_NUM; i++) {
        boids[i] = {
            x: Math.random() * WIDTH,
            y: Math.random() * HEIGHT,
            vx: -5 + (Math.random() * 10),
            vy: -5 + (Math.random() * 10),
            moves: [],
        }
    }
};

const handleMovement = () => {
    CENTERING_DIST = 105 + (Math.random() * 10);
    for (let boid of boids) {
        keepInsideFrame(boid);
        centering(boid);
        keepAwayFromOthers(boid);
        alignment(boid);
        handleSpeed(boid);

        boid.x = boid.x + boid.vx;
        boid.y = boid.y + boid.vy;
        boid.moves.push([boid.x, boid.y])
        boid.moves = boid.moves.slice(-50);
    }

    const context = document.getElementById("frame").getContext("2d");
    context.clearRect(0, 0, WIDTH, HEIGHT);
    for (let boid of boids) {
        createBoid(context, boid);
    }
    window.requestAnimationFrame(handleMovement);
}

const keepInsideFrame = (boid) => {
    if (boid.x - AVOIDING_DIST < 0) {
        boid.vx = boid.vx + 1;
    }
    if (boid.x > WIDTH - AVOIDING_DIST) {
        boid.vx = boid.vx - 1;
    }
    if (boid.y - AVOIDING_DIST < 0) {
        boid.vy = boid.vy + 1;
    }
    if (boid.y > HEIGHT - AVOIDING_DIST) {
        boid.vy = boid.vy - 1;
    }
};

const distance = (boid1, boid2) => {
    return Math.sqrt(
        Math.pow((boid1.x - boid2.x), 2) + Math.pow((boid1.y - boid2.y), 2)
    );
};

const keepAwayFromOthers = (boid) => {
    const effect = 0.005;
    let vxAvoiding = 0;
    let vyAvoiding = 0;

    for (let other of boids) {
        if (other !== boid && distance(boid, other) < AVOIDING_DIST) {
            vxAvoiding = vxAvoiding + boid.x - other.x;
            vyAvoiding = vyAvoiding + boid.y - other.y;
        }
    }
    boid.vx = boid.vx + vxAvoiding * effect;
    boid.vy = boid.vy + vyAvoiding * effect;
};

const centering = (boid) => {
    const effect = 0.005;
    let neighborsSum = 0;
    let xCenter = 0;
    let yCenter = 0;

    for (let other of boids) {
        if (distance(boid, other) < CENTERING_DIST) {
            xCenter = xCenter + other.x;
            yCenter = yCenter + other.y;
            neighborsSum = neighborsSum + 1;
        }
    }

    if (neighborsSum) {
        xCenter = xCenter / neighborsSum;
        yCenter = yCenter / neighborsSum;

        boid.vx = boid.vx + (xCenter - boid.x) * effect;
        boid.vy = boid.vy + (yCenter - boid.y) * effect;
    }
}

const alignment = (boid) => {
    const effect = 0.1;
    let neighborsSum = 0;
    let vxCenter = 0;
    let vyCenter = 0;

    for (let other of boids) {
        if (distance(boid, other) < CENTERING_DIST) {
            vxCenter = vxCenter + other.vx;
            vyCenter = vyCenter + other.vy;
            neighborsSum = neighborsSum + 1;
        }
    }

    if (neighborsSum) {
        vxCenter = vxCenter / neighborsSum;
        vyCenter = vyCenter / neighborsSum;

        boid.vx += (vxCenter - boid.vx) * effect;
        boid.vy += (vyCenter - boid.vy) * effect;
    }
}

const handleSpeed = (boid) => {
    const maxSpeed = 10;
    const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
    if (speed > maxSpeed) {
        boid.vx = (boid.vx / speed) * maxSpeed;
        boid.vy = (boid.vy / speed) * maxSpeed;
    }
}

const createBoid = (context, boid) => {
    const dir = Math.atan2(boid.vy, boid.vx);
    context.translate(boid.x, boid.y);
    context.rotate(dir);
    context.translate(-boid.x, -boid.y);
    context.fillStyle = "#FFCF9C";
    context.beginPath();
    context.moveTo(boid.x, boid.y);
    context.lineTo(boid.x - 10, boid.y + 4);
    context.lineTo(boid.x - 10, boid.y - 4);
    context.fill();
    context.setTransform(1, 0, 0, 1, 0, 0);
}
