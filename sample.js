var vote, rect;
var two = new Two({
    fullscreen: true,
    autostart: true
}).appendTo(document.body);

var red = {
    r: 255,
    g: 0,
    b: 0
};
var blue = {
    r: 0,
    g: 0,
    b: 255
};

setup();

function setup() {

    var domElement = document.querySelector('svg#vote');
    vote = two.interpret(domElement);
    vote.subdivide();
    vote.center();
    rect = vote.getBoundingClientRect();

    for (var i = 0; i < vote.children.length; i++) {
        var path = vote.children[i];
        for (var j = 0; j < path.vertices.length; j++) {
            var v = path.vertices[j];
            v.origin = new Two.Vector(v.x, v.y);
        }
    }

    two.bind('resize', resize);
    two.bind('update', update);
    resize();

}

function resize() {
    var x = two.width / 2;
    var y = two.height / 2;
    two.scene.position.set(x, y);
    two.scene.scale = 1;
    var rect = two.scene.getBoundingClientRect();
    two.scene.scale = Math.min(
        rect.width > two.width ? rect.width / two.width : two.width / rect.width,
        rect.height > two.height ? rect.height / two.height : two.height / rect.height
    );
    two.scene.scale *= 0.75;
}

var elapsed = 0;

function update(frameCount, timeDelta) {

    var tick = (250 + frameCount) / 60;
    tick += Math.sin(Math.PI * 0.125 * frameCount / 15) * 0.15;
    tick += Math.sin(Math.PI * 0.001 * frameCount / 15) * 0.33;

    if (timeDelta) {
        elapsed += timeDelta;
    }

    vote.fill = getColor(elapsed);

    for (var i = 0; i < vote.children.length; i++) {
        var path = vote.children[i];

        for (var j = 0; j < path.vertices.length; j++) {

            var v = path.vertices[j];

            var xpct = v.origin.x / rect.width + tick;
            var ypct = v.origin.y / rect.height + tick;

            v.x = v.origin.x + 25 * fieldX(ypct * 0.33);
            v.y = v.origin.y + 25 * fieldY(xpct * 1.25);
        }
    }
}

function getColor(millis) {
    var duration = 5000;
    var t = (millis % duration) / duration;
    t = Math.sin(t * Math.PI);
    var r = t * (blue.r - red.r) + red.r;
    var g = t * (blue.g + red.g) + red.g;
    var b = t * (blue.b + red.b) + red.b;
    return `rgb(${r}, ${g}, ${b})`;
}

function fieldX(v) {
    return Math.sin(v * Math.PI);
}

function fieldY(v) {
    return Math.sin(v * Math.PI);
}