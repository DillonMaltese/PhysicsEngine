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

class Cube {
    constructor({ x, y, z, size }) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.z = z;

        this.V = []; // vertices
        this.T = [
            [0, 1, 2], [1, 3, 2],
            [5, 4, 7], [4, 6, 7],
            [4, 0, 6], [0, 2, 6],
            [1, 5, 3], [5, 7, 3],
            [4, 5, 0], [5, 1, 0],
            [2, 3, 6], [3, 7, 6]
        ];; // triangles
        this.setUp();
    }
    setUp() {
        this.V[0] = new Vertex(-this.size + this.x, -this.size + this.y, -this.size + this.z);
        this.V[1] = new Vertex(this.size + this.x, -this.size + this.y, -this.size + this.z);
        this.V[2] = new Vertex(-this.size + this.x, this.size + this.y, -this.size + this.z);
        this.V[3] = new Vertex(this.size + this.x, this.size + this.y, -this.size + this.z);
        this.V[4] = new Vertex(-this.size + this.x, -this.size + this.y, this.size + this.z);
        this.V[5] = new Vertex(this.size + this.x, -this.size + this.y, this.size + this.z);
        this.V[6] = new Vertex(-this.size + this.x, this.size + this.y, this.size + this.z);
        this.V[7] = new Vertex(this.size + this.x, this.size + this.y, this.size + this.z);
    }
}

const cube1 = new Cube({x: 100, y: 100, z: 0, size: 50});
const cube2 = new Cube({x: -200, y: 100, z: 0, size: 150});
const cube3 = new Cube({x: 300, y: 200, z: 0, size: 100});

const cubes = [cube1, cube2, cube3];

const engine = () => {
    angle += 0.008;

    ctx.clearRect(0, 0, CW, CH);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CW, CH);

    cubes.forEach((c) => {
        const projected = [];

        for (let v of c.V) {
            let rotated = multMat(rotZMat(angle), v);
            rotated = multMat(rotXMat(angle), rotated);
            rotated = multMat(rotYMat(angle), rotated);
            let movedBack = new Vertex(rotated.x + CW2, rotated.y + CH2, rotated.z);
            let proj2D = multMat(proj, movedBack);
            projected.push(proj2D);
        }

        for (let tri of c.T) {
            const p1 = projected[tri[0]];
            const p2 = projected[tri[1]];
            const p3 = projected[tri[2]];

            drawLine(p1.x, p1.y, p2.x, p2.y);
            drawLine(p2.x, p2.y, p3.x, p3.y);
            drawLine(p3.x, p3.y, p1.x, p1.y);
        }
    });


    requestAnimationFrame(engine);
};

engine();
