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

p[0] = new Vertex(CW2 - 100, CH2 - 100, -100);
p[1] = new Vertex(CW2 + 100, CH2 - 100, -100);
p[2] = new Vertex(CW2, CH2 + 100, -100);

p[3] = new Vertex(CW2 - 100, CH2 - 100, 100);
p[4] = new Vertex(CW2 + 100, CH2 - 100, 100);
p[5] = new Vertex(CW2, CH2 + 100, 100);

const T = [
    [0, 1, 2], // front triangle
    [3, 4, 5], // back triangle
    [0, 3],    // connect 0 → 3
    [1, 4],    // connect 1 → 4
    [2, 5],    // connect 2 → 5
];


const engine = () => {
    angle += 0.008;

    ctx.clearRect(0, 0, CW, CH);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CW, CH);

    const projected = [];

    for (let v of p) {
        let translated = new Vertex(v.x - center.x, v.y - center.y, v.z - center.z);
        let rotated = multMat(rotZMat(angle), translated);
        rotated = multMat(rotXMat(angle), rotated);
        rotated = multMat(rotZMat(angle), rotated);
        let movedBack = new Vertex(rotated.x + center.x, rotated.y + center.y, rotated.z + center.z);
        let proj2D = multMat(proj, movedBack);

        projected.push(proj2D);
    }

    for (let t of T) {
        if (t.length === 2) {
            const a = projected[t[0]];
            const b = projected[t[1]];
            drawLine(a.x, a.y, b.x, b.y);
        } else if (t.length === 3) {
            const a = projected[t[0]];
            const b = projected[t[1]];
            const c = projected[t[2]];
            drawLine(a.x, a.y, b.x, b.y);
            drawLine(b.x, b.y, c.x, c.y);
            drawLine(c.x, c.y, a.x, a.y);
        }
    }

    requestAnimationFrame(engine);
};

engine();
