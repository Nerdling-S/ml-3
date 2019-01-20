let points = [];

let m = 1;
let b = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
}

function draw() {
    gradDesc();
    drawLine();
}

function mousePressed() {
    points.push({ x: map(mouseX, 0, width, 0, 1), y: map(mouseY, height, 0, 0, 1) });

    noStroke();
    fill(255);
    ellipse(mouseX, mouseY, 10, 10);

}

function keyPressed() {
    if (key === " ") {
        points = [];
        background(0);
    }
}

const linReg = function() {
    let xbar = 0;
    let ybar = 0;
//xbar, ybar{
    let xsum = 0;
    let ysum = 0;

    for(let p of points) {
        xsum += p.x;
        ysum += p.y
    }
//}
    xbar = xsum / points.length;
    ybar = ysum / points.length;

//m{
    let num = 0;
    let den = 0;
    
    for (let p of points) {
        num += (p.x - xbar) * (p.y - ybar);

        den += (p.x - xbar) * (p.x - xbar)
    }
//}
    m = num / den

    b = ybar - m * xbar;
}

const drawLine = function() {
    let x1 = 0;
    let y1 = m * x1 + b;
    let x2 = 1;
    let y2 = m * x2 + b;

    x1 = map(x1, 0, 1, 0, width);
    y1 = map(y1, 0, 1, height, 0);
    x2 = map(x2, 0, 1, 0, width);
    y2 = map(y2, 0, 1, height, 0);


    background(0);
    for (let p of points) {
        let x = map(p.x, 0, 1, 0, width);
        let y = map(p.y, 0, 1, height, 0);
        noStroke();
        ellipse(x, y, 10, 10);
    }
    stroke(0, 255, 255);
    line(x1, y1, x2, y2);
};

const gradDesc = function() {
    let rate = 0.5;
    for (let p of points) {
        let x = p.x;
        let y = p.y

        let guess = m * x + b;

        let error = y - guess;

        m += error * x * rate;
        b += error * rate;
    }
}
