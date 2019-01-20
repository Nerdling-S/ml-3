let movies;
let ratings = {};
let resultDivs = [];

function preload() {
    movies = loadJSON("./assets/movies.json");
}

function setup() {
    noCanvas();

    let titles = {};
    let sels = selectAll(".movie");
    let submit = select("#submit");
    submit.mousePressed(() => {
        let me = {};
        for (let i = 0; i < titles.length; i++) {
            me[titles[i]] = sels[i].value();
        }

        let notseen_titles = [];
        for (let t of titles) {
            if (me[t] == 0) {
                notseen_titles.push(t);
            }
        }

        let recommended = {};
        let nearest = calcNearest(5, me);

        for (let t of notseen_titles) {
            let sum = 0;
            let sim = 0;
            for (let n of nearest) {
                sum += n[t] * n.dist;
                sim += n.dist;
            }
            let stars = nf(sum / sim, 1, 2);
            recommended[t] = stars;
        }
        for (let d of resultDivs) {
            d.remove();
        }
        resultDivs = objToDivs(recommended);
    });

    titles = movies.titles;
    let users = movies.users;

    for (let u of users) {
        let v = Object.values(u).slice(2);
        let t = Object.keys(u).slice(2);

        ratings[u.name] = {};
        for (let i = 0; i < t.length; i++) {
            if (v[i] === null) {
                v[i] = 0;
            }
            ratings[u.name][t[i]] = v[i];
        }
    }
}

const objToDivs = function(obj) {
    let keys = Object.keys(obj);
    let divs = [];

    for (let k of keys) {
        let div = createDiv(`${k}: ${obj[k]}`);
        divs.push(div);
    }

    return divs;
};

const calcNearest = function(k, r) {
    let names = [];

    for (let u of movies.users) {
        names.push(u.name);
    }
    let dists = {};
    for (let d of names) {
        dists[d] = 1 / (1 + eDist(r, ratings[d]));
    }

    names.sort((n1, n2) => {
        let dist1 = dists[n1];
        let dist2 = dists[n2];

        return dist2 - dist1;
    });

    let out = [];

    for (let i = 0; i < k; i++) {
        out[i] = ratings[names[i]];
        out[i].dist = dists[names[i]];
    }

    return out;
};

const eDist = function(r1, r2) {
    let sum = 0;

    for (let key of Object.keys(r1)) {
        let diff = r2[key] - r1[key];

        sum += diff * diff;
    }

    let sumsqrt = sqrt(sum);

    return sumsqrt;
};

function draw() {}
