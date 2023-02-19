// TODO:
// Visually indicate when you win
// Add a game as a loss if you quit midway
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Widget = /** @class */ (function () {
    function Widget(x, y) {
        this.x = x;
        this.y = y;
    }
    Widget.prototype.draw = function (ctx, satisfied) {
    };
    Widget.prototype.block = function (g, target) {
        return false;
    };
    Widget.prototype.satisfied = function (g) {
        return true;
    };
    return Widget;
}());
// returns 1 if p2 is clockwise from p1, -1 if counterclockwise, 0 if collinear
function rotation(p1, p2, center) {
    var x1 = p1[0], y1 = p1[1];
    var x2 = p2[0], y2 = p2[1];
    var cx = center[0], cy = center[1];
    var val = (y2 - cy) * (x1 - cx) - (y1 - cy) * (x2 - cx);
    if (val === 0)
        return 0;
    return val > 0 ? 1 : -1;
}
function bothAdjacent(p1, p2, center) {
    return Math.abs(p1[0] - center[0]) < 0.7 && Math.abs(p1[1] - center[1]) < 0.7 &&
        Math.abs(p2[0] - center[0]) < 0.7 && Math.abs(p2[1] - center[1]) < 0.7;
}
var Rotation = /** @class */ (function (_super) {
    __extends(Rotation, _super);
    function Rotation(x, y, orientation) {
        var _this = _super.call(this, x, y) || this;
        _this.orientation = orientation;
        return _this;
    }
    Rotation.prototype.draw = function (ctx, satisfied) {
        ctx.strokeStyle = color(satisfied);
        ctx.fillStyle = color(satisfied);
        ctx.lineWidth = 0.03;
        var scale = 0.07; // TODO: fix
        var size = 3 * scale;
        var arrowSize = scale * 0.8;
        for (var i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, i * Math.PI / 2, (i - 0.6 * this.orientation) * Math.PI / 2, this.orientation > 0);
            ctx.stroke();
        }
        for (var i = 0; i < 4; i++) {
            ctx.translate(this.x, this.y);
            ctx.rotate(Math.PI / 2);
            ctx.translate(-this.x, -this.y);
            ctx.lineWidth = 0.01;
            ctx.beginPath();
            ctx.moveTo(this.x + size + arrowSize, this.y - arrowSize * this.orientation);
            ctx.lineTo(this.x + size, this.y + arrowSize * this.orientation);
            ctx.lineTo(this.x + size - arrowSize, this.y - arrowSize * this.orientation);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    };
    Rotation.prototype.block = function (g, target) {
        var line = g.line;
        if (line.length == 0)
            return false;
        var prev = line[line.length - 1];
        return bothAdjacent(prev, target, [this.x, this.y]) && rotation(prev, target, [this.x, this.y]) !== this.orientation;
    };
    Rotation.prototype.satisfied = function (g) {
        for (var i = 0; i < g.line.length - 1; i++) {
            var p1 = g.line[i];
            var p2 = g.line[i + 1];
            if (bothAdjacent(p1, p2, [this.x, this.y]))
                return true;
        }
        return false;
    };
    return Rotation;
}(Widget));
var Square = /** @class */ (function (_super) {
    __extends(Square, _super);
    function Square() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Square.prototype.draw = function (ctx, satisfied) {
        ctx.strokeStyle = color(satisfied);
        ctx.lineWidth = 0.02;
        var scale = 0.075; // TODO: fix
        var size = 2 * scale;
        ctx.strokeRect(this.x - size, this.y - size, 2 * size, 2 * size);
    };
    Square.prototype.block = function (g, target) {
        var line = g.line;
        if (line.length == 0)
            return false;
        var _a = line[line.length - 1], x = _a[0], y = _a[1];
        var dx = target[0] - x;
        var dy = target[1] - y;
        var moveCrooked = line.length > 1 && (line[line.length - 2][0] !== x - dx || line[line.length - 2][1] !== y - dy);
        return x === this.x && y === this.y && moveCrooked;
    };
    Square.prototype.satisfied = function (g) {
        for (var _i = 0, _a = g.line; _i < _a.length; _i++) {
            var _b = _a[_i], x = _b[0], y = _b[1];
            if (x === this.x && y === this.y)
                return true;
        }
        return false;
    };
    return Square;
}(Widget));
var Diamond = /** @class */ (function (_super) {
    __extends(Diamond, _super);
    function Diamond() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Diamond.prototype.draw = function (ctx, satisfied) {
        ctx.strokeStyle = color(satisfied);
        var scale = 0.075; // TOOD: fix
        var size = scale * 3;
        ctx.lineWidth = 0.02;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - size);
        ctx.lineTo(this.x + size, this.y);
        ctx.lineTo(this.x, this.y + size);
        ctx.lineTo(this.x - size, this.y);
        ctx.closePath();
        ctx.stroke();
    };
    Diamond.prototype.block = function (g, target) {
        var line = g.line;
        if (line.length == 0)
            return false;
        var _a = line[line.length - 1], x = _a[0], y = _a[1];
        var dx = target[0] - x;
        var dy = target[1] - y;
        var moveCrooked = line.length > 1 && (line[line.length - 2][0] !== x - dx || line[line.length - 2][1] !== y - dy);
        return x === this.x && y === this.y && (line.length == 1 || !moveCrooked);
    };
    Diamond.prototype.satisfied = function (g) {
        for (var _i = 0, _a = g.line; _i < _a.length; _i++) {
            var _b = _a[_i], x = _b[0], y = _b[1];
            if (x === this.x && y === this.y)
                return true;
        }
        return false;
    };
    return Diamond;
}(Widget));
// interpolate color between black and red
function color(satisfied) {
    var r = Math.round(255 * (1 - satisfied));
    return "rgb(" + r + ", 0, 0)";
}
function adjacentSegments(line, target) {
    var count = 0;
    for (var i = 0; i < line.length - 1; i++) {
        var _a = [line[i], line[i + 1]], _b = _a[0], x = _b[0], y = _b[1], _c = _a[1], x2 = _c[0], y2 = _c[1];
        if (Math.abs(x - target[0]) < 1 && Math.abs(y - target[1]) < 1 && Math.abs(x2 - target[0]) < 1 && Math.abs(y2 - target[1]) < 1) {
            count += 1;
        }
    }
    return count;
}
//TODO: probably these should be triangles?
var EdgeNumber = /** @class */ (function (_super) {
    __extends(EdgeNumber, _super);
    function EdgeNumber(x, y, number) {
        var _this = _super.call(this, x, y) || this;
        _this.number = number;
        return _this;
    }
    EdgeNumber.prototype.draw = function (ctx, satisfied) {
        var scale = 0.1; // TODO: fix
        ctx.strokeStyle = color(satisfied);
        ctx.fillStyle = color(satisfied);
        ctx.lineWidth = 0.01;
        ctx.font = 'bold 0.3px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.number.toString(), this.x, this.y);
    };
    EdgeNumber.prototype.block = function (g, target) {
        return (bothAdjacent(target, last(g.line), [this.x, this.y]) && adjacentSegments(g.line, [this.x, this.y]) >= this.number);
    };
    EdgeNumber.prototype.satisfied = function (g) {
        return adjacentSegments(g.line, [this.x, this.y]) === this.number;
    };
    return EdgeNumber;
}(Widget));
function drawGame(ctx, pixels, g, animation) {
    ctx.save();
    var width = 0.07;
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.01;
    ctx.clearRect(0, 0, pixels, pixels);
    var margin = Math.max(pixels / (3 * g.grid.size), 30);
    ctx.translate(margin, margin);
    var scaleFactor = (pixels - 2 * margin) / (g.grid.size - 1);
    ctx.scale(scaleFactor, scaleFactor);
    for (var i = 0; i < g.grid.size; i += 1) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, g.grid.size - 1);
    }
    for (var i = 0; i < g.grid.size; i += 1) {
        ctx.moveTo(0, i);
        ctx.lineTo(g.grid.size - 1, i);
    }
    ctx.stroke();
    var allSatisfied = 1;
    for (var _i = 0, _a = g.grid.widgets; _i < _a.length; _i++) {
        var widget = _a[_i];
        var satisfied = 0;
        if (animation == null) {
            if (widget.satisfied(g))
                satisfied += 1;
        }
        else {
            var move = animation[0], newGame = animation[1], progress = animation[2];
            if (widget.satisfied(newGame)) {
                satisfied += progress;
            }
            if (widget.satisfied(newGame)) {
                satisfied += 1 - progress;
            }
        }
        allSatisfied = Math.min(allSatisfied, satisfied);
        widget.draw(ctx, satisfied);
    }
    ctx.beginPath();
    ctx.strokeStyle = color(allSatisfied);
    ctx.fillStyle = color(allSatisfied);
    ctx.arc(g.grid.target[0], g.grid.target[1], width, 0, 2 * Math.PI);
    ctx.fill();
    function drawCircle(x, y, color) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, width / 2, 0, 2 * Math.PI);
        ctx.fill();
    }
    var grey = 'rgba(128, 128, 128, 0.5)';
    ctx.strokeStyle = grey;
    ctx.lineWidth = width;
    ctx.beginPath();
    for (var i = 0; i < g.ghostLine.length; i += 1) {
        var _b = g.ghostLine[i], x = _b[0], y = _b[1];
        if (i === 0) {
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    if (g.ghostLine.length > 0) {
        drawCircle(g.ghostLine[g.ghostLine.length - 1][0], g.ghostLine[g.ghostLine.length - 1][1], grey);
    }
    if (g.line.length > 0) {
        var _c = g.line[0], x = _c[0], y = _c[1];
        drawCircle(x, y, 'orange');
    }
    var _d = g.line[g.line.length - 1], finalX = _d[0], finalY = _d[1];
    if (animation != null) {
        var move = animation[0], newGame = animation[1], progress = animation[2];
        if (move.kind === 'extend' || move.kind === 'retract') {
            var _e = (move.kind == 'extend') ? move.target : g.line[g.line.length - 2], nextX = _e[0], nextY = _e[1];
            var _f = g.line[g.line.length - 1], lastX = _f[0], lastY = _f[1];
            finalX = lastX + (nextX - lastX) * progress;
            finalY = lastY + (nextY - lastY) * progress;
        }
        else if (move.kind === 'abort') {
            var _g = move.target, nextX = _g[0], nextY = _g[1];
            var _h = g.line[g.line.length - 1], lastX = _h[0], lastY = _h[1];
            var d = 0.5 * Math.sin(progress * Math.PI);
            finalX = lastX + (nextX - lastX) * d;
            finalY = lastY + (nextY - lastY) * d;
        }
    }
    ctx.lineWidth = width;
    ctx.strokeStyle = 'orange';
    ctx.beginPath();
    for (var i = 0; i < g.line.length; i += 1) {
        var _j = g.line[i], x = _j[0], y = _j[1];
        if (i === 0) {
            ctx.moveTo(x, y);
        }
        else if (i < g.line.length - 1 || animation === null || animation[0].kind !== 'retract') {
            ctx.lineTo(x, y);
        }
    }
    ctx.lineTo(finalX, finalY);
    ctx.stroke();
    drawCircle(finalX, finalY, 'orange');
    ctx.restore();
}
function drawGameInWindow(window, canvas, game, animation) {
    if (animation === void 0) { animation = null; }
    var documentHeight = window.innerHeight - 30;
    var documentWidth = window.innerWidth;
    var size = Math.min(documentHeight, documentWidth);
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');
    if (ctx != null) {
        drawGame(ctx, size, game, animation);
    }
}
function animate(window, f, duration) {
    var startTime = Date.now();
    function step() {
        var now = Date.now();
        var elapsed = now - startTime;
        var progress = Math.min(1, elapsed / duration);
        f(progress);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    }
    step();
}
function dfs(start, path, visited, end, size) {
    var x = start[0], y = start[1];
    if (x == end[0] && y == end[1])
        return true;
    visited.add([x, y].toString());
    var directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    directions.sort(function () { return Math.random() - 0.5; });
    for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
        var _a = directions_1[_i], dx = _a[0], dy = _a[1];
        var newX = x + dx;
        var newY = y + dy;
        if (!visited.has([newX, newY].toString()) && newX >= 0 && newX < size && newY >= 0 && newY < size) {
            path.push([newX, newY]);
            if (dfs([newX, newY], path, visited, end, size)) {
                return true;
            }
            path.pop();
        }
    }
    visited["delete"](start.toString());
    return false;
}
;
function randomPath(start, end, size) {
    while (true) {
        var path = [start];
        var visited = new Set();
        dfs(start, path, visited, end, size);
        if (path.length > size * size / 2)
            return path;
    }
}
;
function randomWidgets(size) {
    var result = [];
    var targetPath = randomPath([0, Math.round((size - 1) / 2)], [size - 1, Math.round((size - 1) / 2)], size);
    var widgetPoints = Array.from(randomIntegerSet(size, targetPath.length - 2));
    for (var _i = 0, widgetPoints_1 = widgetPoints; _i < widgetPoints_1.length; _i++) {
        var j = widgetPoints_1[_i];
        var dx1 = targetPath[j + 1][0] - targetPath[j][0];
        var dy1 = targetPath[j + 1][1] - targetPath[j][1];
        var dx2 = targetPath[j + 2][0] - targetPath[j + 1][0];
        var dy2 = targetPath[j + 2][1] - targetPath[j + 1][1];
        if (dx1 == dx2 && dy1 == dy2) {
            result.push(new Square(targetPath[j + 1][0], targetPath[j + 1][1]));
        }
        else {
            result.push(new Diamond(targetPath[j + 1][0], targetPath[j + 1][1]));
        }
    }
    var edgenumbers = 0;
    var taken = new Set();
    while (edgenumbers < size) {
        var _a = [Math.floor(Math.random() * (size - 1)) + 0.5, Math.floor(Math.random() * (size - 1)) + 0.5], a = _a[0], b = _a[1];
        var count = adjacentSegments(targetPath, [a, b]);
        if (count > 0 && !taken.has([a, b].toString())) {
            result.push(new EdgeNumber(a, b, count));
            taken.add([a, b].toString());
            edgenumbers += 1;
        }
    }
    var onRotations = 0;
    var tries = 0;
    while ((onRotations < size) && tries < 1000) {
        var center = [Math.floor(Math.random() * (size - 1)) + 0.5, Math.floor(Math.random() * (size - 1)) + 0.5];
        var orientation_1 = null;
        var adjacent = false;
        var consistent = true;
        if (taken.has(center.toString()))
            continue;
        for (var i = 0; i < targetPath.length - 1; i++) {
            var p1 = targetPath[i];
            var p2 = targetPath[i + 1];
            if (bothAdjacent(p1, p2, center)) {
                adjacent = true;
                var newRotation = rotation(p1, p2, center);
                if (orientation_1 == null) {
                    orientation_1 = newRotation;
                }
                else if (orientation_1 != newRotation) {
                    consistent = false;
                }
            }
        }
        if (adjacent && consistent) {
            result.push(new Rotation(center[0], center[1], orientation_1));
            onRotations += 1;
            taken.add(center.toString());
        }
        tries += 1;
    }
    return [result, targetPath];
}
function sortedSet(items) {
    var result = Array.from(items);
    result.sort(function (a, b) { return a - b; });
    return result;
}
function randomIntegerSet(n, max) {
    var indices = new Set();
    while (indices.size < n) {
        indices.add(Math.floor(Math.random() * max));
    }
    return indices;
}
function randomSubset(n, universe) {
    var indices = randomIntegerSet(n, universe.size);
    var result = new Set();
    var items = Array.from(universe);
    for (var _i = 0, _a = Array.from(indices); _i < _a.length; _i++) {
        var i = _a[_i];
        result.add(items[i]);
    }
    return result;
}
function heartbeat(state) {
    console.log("Heartbeat!", state.time);
    if (!state.paused) {
        state.time -= 1;
        if (state.time <= 0) {
            loseGame(state);
        }
        else {
            drawInfo(state);
        }
    }
}
var allKeys = ['time', 'winrate'];
function saveLast(score) {
    localStorage.setItem('last', JSON.stringify(score));
}
function getLast() {
    var score = localStorage.getItem('last');
    if (score !== null) {
        var result = JSON.parse(score);
        if (isGameOpen())
            result.games += 1;
        return result;
    }
    else {
        return { games: 0, wins: 0, totalTime: 0 };
    }
}
// Serialize the value of score into local storage 
function saveScore(score, key) {
    localStorage.setItem(key, JSON.stringify(score));
}
function getScore(key) {
    var score = localStorage.getItem(key);
    if (score !== null) {
        return JSON.parse(score);
    }
    else {
        return { games: 0, wins: 0, totalTime: 0 };
    }
}
function lowerBoundScore(successes, total) {
    var failures = total - successes;
    var m = (successes + 2) / (successes + failures + 4);
    var stdev = Math.sqrt(m * (1 - m) / (successes + failures + 4));
    return Math.max(m - 2 * stdev, 0);
}
function scoreBy(key, score) {
    if (score.games == 0)
        return 0;
    /*switch (key) {
        case 'time': return 60 - (score.totalTime / score.games + 60 / Math.sqrt(score.games))
        case 'winrate': return (score.wins / score.games) - 1 / Math.sqrt(score.games)
    }*/
    switch (key) {
        case 'time': return 60 * lowerBoundScore(score.games - score.totalTime / 60, score.games);
        case 'winrate': return lowerBoundScore(score.wins, score.games);
    }
}
function markGameDone() {
    localStorage.setItem('gameState', 'closed');
}
function markGameOpen() {
    localStorage.setItem('gameState', 'open');
}
function isGameOpen() {
    return localStorage.getItem('gameState') === 'open';
}
function recordScore(score) {
    saveLast(score);
    markGameDone();
    for (var _i = 0, allKeys_1 = allKeys; _i < allKeys_1.length; _i++) {
        var key = allKeys_1[_i];
        var oldScore = getScore(key);
        if (scoreBy(key, score) > scoreBy(key, oldScore)) {
            saveScore(score, key);
        }
    }
}
function drawInfo(state) {
    var e = document.getElementById('time');
    if (e !== null)
        e.innerText = state.time.toString();
    var e2 = document.getElementById('games');
    if (e2 !== null)
        e2.innerText = state.score.games.toString();
    var e3 = document.getElementById('points');
    if (e3 !== null)
        e3.innerText = state.score.totalTime.toString();
    var e4 = document.getElementById('winrate');
    var winRate = (state.score.wins / state.score.games);
    if (e4 !== null && state.score.games > 0)
        e4.innerText = "(" + (100 * winRate).toFixed(0) + "%)";
    var e5 = document.getElementById('average');
    if (e5 !== null && state.score.games > 0) {
        e5.innerText = (state.score.totalTime / state.score.games).toFixed(1) + "s";
    }
    var e7 = document.getElementById('wins');
    if (e7 !== null)
        e7.innerText = state.score.wins.toString();
    var e8 = document.getElementById('continue');
    if (e8 !== null) {
        if (state.paused)
            e8.innerText = '(Space or Enter to start)';
        else
            e8.innerText = '';
    }
    var e9 = document.getElementById('highscore');
    if (e9 !== null) {
        var highScore = getScore('winrate');
        var scoreBound = "(> " + (scoreBy('winrate', highScore) * 100).toFixed(0) + "%)";
        e9.innerText = "Personal best: " + highScore.wins + " / " + highScore.games + " " + scoreBound;
    }
    var e10 = document.getElementById('speedscore');
    if (e10 !== null) {
        var highScore = getScore('time');
        if (highScore.games > 0) {
            var scoreBound = "< " + (60 - scoreBy('time', highScore)).toFixed(1) + "s";
            var meanTime = (highScore.totalTime / highScore.games).toFixed(1);
            e10.innerText = "Personal fastest: " + meanTime + "s / " + highScore.games + " (" + scoreBound + ")";
        }
    }
}
function init() {
    var _a = randomWidgets(7), widgets = _a[0], solution = _a[1];
    return { line: [[0, 3]], ghostLine: [], grid: { size: 7, widgets: widgets, target: [6, 3] }, solution: solution, widgetLookup: lookupForWidgets(widgets, 7) };
}
function emptyGame() {
    return { line: [[0, 3]], ghostLine: [], grid: { size: 7, widgets: [], target: [6, 3] }, solution: [], widgetLookup: lookupForWidgets([], 7) };
}
function lookupForWidgets(widgets, size) {
    var result = [];
    for (var i = 0; i < 2 * size - 1; i++) {
        var row = [];
        for (var j = 0; j < 2 * size - 1; j++) {
            row.push(null);
        }
        result.push(row);
    }
    for (var _i = 0, widgets_1 = widgets; _i < widgets_1.length; _i++) {
        var widget = widgets_1[_i];
        result[Math.round(2 * widget.x)][Math.round(2 * widget.y)] = widget;
    }
    return result;
}
function deltaToMove(g, d) {
    var _a = g.line[g.line.length - 1], x = _a[0], y = _a[1];
    var newX = x + d[0];
    var newY = y + d[1];
    var target = [newX, newY];
    if (newX >= 7 || newX < 0 || newY >= 7 || newY < 0) {
        return { kind: 'none' };
    }
    if (g.line.length > 1) {
        var _b = g.line[g.line.length - 2], lastX = _b[0], lastY = _b[1];
        if (lastX === newX && lastY === newY) {
            return { kind: 'retract' };
        }
    }
    for (var _i = 0, _c = g.grid.widgets; _i < _c.length; _i++) {
        var widget = _c[_i];
        if (widget.block(g, target)) {
            return { kind: 'abort', target: target };
        }
    }
    for (var i = 0; i < g.line.length - 1; i += 1) {
        var _d = g.line[i], otherX = _d[0], otherY = _d[1];
        if (otherX === newX && otherY === newY) {
            return { kind: 'abort', target: target };
        }
    }
    return { kind: 'extend', target: target };
}
function updateGame(g, m) {
    var newLine = g.line.slice();
    switch (m.kind) {
        case 'extend':
            newLine.push(m.target);
            break;
        case 'retract':
            newLine.pop();
    }
    return __assign(__assign({}, g), { line: newLine });
}
function executeAndAnimateMove(state, m) {
    var oldGame = state.game;
    var newGame = updateGame(state.game, m);
    animate(state.window, function (progress) {
        if (!state.abortAnimation) {
            drawGameInWindow(state.window, state.canvas, oldGame, [m, newGame, progress]);
        }
    }, 100);
    state.game = newGame;
    if (isVictory(state.game))
        winGame(state, false);
}
function isVictory(g) {
    var _a = g.line[g.line.length - 1], x = _a[0], y = _a[1];
    for (var _i = 0, _b = g.grid.widgets; _i < _b.length; _i++) {
        var widget = _b[_i];
        if (!widget.satisfied(g)) {
            return false;
        }
    }
    return x === g.grid.target[0] && y === g.grid.target[1];
}
var gameTime = 60;
function winGame(state, drawResult) {
    state.score.wins += 1;
    state.score.totalTime += gameTime - state.time;
    state.score.games += 1;
    recordScore(state.score);
    state.paused = true;
    if (drawResult) {
        draw(state);
        state.abortAnimation = true;
    }
    else
        drawInfo(state);
}
function draw(state) {
    drawInfo(state);
    var gameToDraw = state.showSolution ? __assign(__assign({}, state.game), { line: state.game.solution }) : state.game;
    drawGameInWindow(state.window, state.canvas, gameToDraw);
}
function loseGame(state, drawResult) {
    if (drawResult === void 0) { drawResult = true; }
    state.abortAnimation = false;
    state.score.games += 1;
    state.score.totalTime += gameTime;
    state.paused = true;
    state.showSolution = true;
    recordScore(state.score);
    state.abortAnimation = true;
    state.game.ghostLine = [];
    if (drawResult) {
        draw(state);
        state.abortAnimation = true;
    }
    else
        drawInfo(state);
}
function startGame(state) {
    state.paused = false;
    state.showSolution = false;
    state.game.ghostLine = [];
    state.game = init();
    state.time = gameTime;
    state.abortAnimation = false;
    markGameOpen();
    draw(state);
}
function resetScore(state) {
    state.score = { games: 0, wins: 0, totalTime: 0 };
    recordScore(state.score);
    drawInfo(state);
}
document.addEventListener('DOMContentLoaded', function () {
    var window = document.defaultView;
    var canvas = document.getElementById('canvas');
    var state = {
        game: emptyGame(),
        score: getLast(),
        time: gameTime,
        window: window,
        abortAnimation: false,
        showSolution: false,
        canvas: canvas,
        paused: true
    };
    draw(state);
    window.addEventListener('resize', function () { return draw(state); });
    setInterval(function () { return heartbeat(state); }, 1000);
    var button = document.getElementById('reset');
    button.addEventListener('click', function () { return resetScore(state); });
    var instructionBotton = document.getElementById('instructionsButton');
    instructionBotton.addEventListener('click', function () {
        var instructions = document.getElementById('instructions');
        if (instructions.style.display === 'none') {
            instructions.style.display = 'block';
        }
        else {
            instructions.style.display = 'none';
        }
    });
    document.addEventListener('keydown', function (event) {
        var doDiff = function (dx, dy) { return executeAndAnimateMove(state, deltaToMove(state.game, [dx, dy])); };
        console.log("Keydown!", state.paused, state.showSolution);
        if (event.key === 'ArrowRight' && !state.paused) {
            doDiff(1, 0);
            event.preventDefault();
        }
        else if (event.key == 'ArrowLeft' && !state.paused) {
            doDiff(-1, 0);
            event.preventDefault();
        }
        else if (event.key == 'ArrowUp' && !state.paused) {
            doDiff(0, -1);
            event.preventDefault();
        }
        else if (event.key == 'ArrowDown' && !state.paused) {
            doDiff(0, 1);
            event.preventDefault();
        }
        else if ((event.key == 'z' || event.key == 'Backspace' || event.key == 'Delete') && !state.paused) {
            if (state.game.line.length > 1) {
                executeAndAnimateMove(state, { kind: 'retract' });
            }
        }
        else if (event.key == 'Enter') {
            if (state.paused)
                startGame(state);
            event.preventDefault();
        }
        else if (event.key == 'Escape') {
            loseGame(state);
        }
        else if (event.key == ' ' && !state.paused) {
            state.game.ghostLine = state.game.line;
            state.game.line = [[0, 3]];
            draw(state);
            event.preventDefault();
        }
        else if (event.key == ' ' && state.paused) {
            startGame(state);
            event.preventDefault();
        }
        else if (event.key == 'x' && !state.paused) {
            if (state.game.ghostLine.length > 0) {
                var current = last(state.game.line);
                for (var i = 0; i < state.game.ghostLine.length - 1; i++) {
                    if (pairEqual(state.game.ghostLine[i], current)) {
                        var dx = state.game.ghostLine[i + 1][0] - current[0];
                        var dy = state.game.ghostLine[i + 1][1] - current[1];
                        doDiff(dx, dy);
                    }
                }
            }
        }
    });
});
function pairEqual(a, b) {
    return a[0] === b[0] && a[1] === b[1];
}
function last(a) {
    return a[a.length - 1];
}
//TODO
// Make corners nice
// If you try to move through your own path, make a "ty then undo" animation
//# sourceMappingURL=main.js.map