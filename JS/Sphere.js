const cvs = document.querySelector('#c');
const ctx = cvs.getContext('2d');

cvs.width = 1080;
cvs.height = 620; 

const CW = cvs.width;
const CH = cvs.height;
const CW2 = CW / 2;
const CH2 = CH / 2; 

let angle = 0;

const proj = [
    [1, 0, 0],
    [0, 1, 0], 
    [0, 0, 1]
];

const rotZMat = (angle) => {
    return [
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ]
}

const rotXMat = (angle) => {
    return [
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, Math.sin(angle), Math.cos(angle)]
    ]
}

const rotYMat = (angle) => {
    return [
        [Math.cos(angle), 0, Math.sin(angle)],
        [0, 1, 0],
        [-Math.sin(angle), 0, Math.cos(angle)]
    ]
}

function multMat(m, v) {
    const {x, y, z} = v;

    return {
        x: m[0][0] * x + m[0][1] * y + m[0][2] * z,
        y: m[1][0] * x + m[1][1] * y + m[1][2] * z,
        z: m[2][0] * x + m[2][1] * y + m[2][2] * z
    }
} 

class Vertex {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

const drawVertex = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fillStyle = "white";
    ctx.fill();
}

// const drawVertex1 = (x, y) => {
//     ctx.beginPath();
//     ctx.arc(x, y, 5, 0, 2 * Math.PI)
//     ctx.fillStyle = "red";
//     ctx.fill();
// }

const drawLine = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "white";
    ctx.stroke();
}

const p = [];
const center = new Vertex(CW2, CH2, 0);
const T = [];

const radius = 300;
const segments = 30;

for(let i = 0; i <= segments; i++) {
    const theta = i * Math.PI / segments;
    for(let j = 0; j <= segments; j++) {
        const phi = j * 2 * Math.PI / segments;

        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);

        p.push(new Vertex(x, y, z));
    }
}

const pointsPerRow = segments + 1;

for(let i = 0; i < segments; i++) {
    for(let j = 0; j < segments; j++) {
        const a = i * pointsPerRow + j;
        const b = a + 1;
        const c = a + pointsPerRow;
        const d = a + pointsPerRow + 1;

        T.push([a, b, c]);
        T.push([b, d, c]);
    }
}

const engine = () => {
    angle += 0.01; 

    ctx.clearRect(0, 0, CW, CH);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CW, CH); 

    const projected = [];

    for(let v of p) {

        let rotated = multMat(rotZMat(angle), v);
        rotated = multMat(rotXMat(angle), rotated);
        // rotated = multMat(rotYMat(angle), rotated);
        rotated = multMat(rotZMat(angle), rotated);

        const scale = 300 / (rotated.z + radius + 200); // avoid divide by 0

        let proj2D = {
            x: rotated.x * scale,
            y: rotated.y * scale,
            z: rotated.z
        };

        proj2D.x += CW2;
        proj2D.y += CH2;

        projected.push(proj2D);
    }

    for(let tri of T) {
        const p1 = projected[tri[0]];
        const p2 = projected[tri[1]];
        const p3 = projected[tri[2]];

        drawLine(p1.x, p1.y, p2.x, p2.y);
        drawLine(p2.x, p2.y, p3.x, p3.y);
        drawLine(p3.x, p3.y, p1.x, p1.y);
    }

    requestAnimationFrame(engine);
}

engine();