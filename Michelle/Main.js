
var canvas, ctx;
var currX = -1, currY = -1, currRing = 2;
var centerX = 330, centerY = 330, scaleFactor = .3;
var angles = new Array();

// from a stack overflow post, how to get the upper right coords of the canvas element.
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    canvasX = Math.round( canvasX * (this.width / this.offsetWidth) );
    canvasY = Math.round( canvasY * (this.height / this.offsetHeight) );

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

function initDiagram() {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");


    canvas.addEventListener("touchstart", function (e) { iEventHandler('down', e) }, false);
    canvas.addEventListener("touchmove", function (e) {
        iEventHandler('move', e);
        e.preventDefault();
    }, false);
    canvas.addEventListener("touchend", function (e) { iEventHandler('up', e) }, false);

    canvas.addEventListener("mousemove", function (e) { eventHandler('move', e) }, false);
    canvas.addEventListener("mousedown", function (e) { eventHandler('down', e) }, false);
    canvas.addEventListener("mouseup", function (e) { eventHandler('up', e) }, false);
    canvas.addEventListener("mouseout", function (e) { eventHandler('out', e) }, false);
    angles[1] = 0; angles[2] = 0; angles[3] = 0; angles[4] = 0;
    drawAllCircles();
}
function debugText(line1, line2, line3, line4, line5, line6) {
    ctx.fillStyle = "white";
    ctx.fillRect(1, 1, 200, 140);
    ctx.fillStyle = "blue";
    ctx.font = "bold 16px Arial";
    ctx.fillText(line1, 10, 20);
    ctx.fillText(line2, 10, 40);
    ctx.fillText(line3, 10, 60);
    ctx.fillText(line4, 10, 80);
    ctx.fillText(line5, 10, 100);
    ctx.fillText(line6, 10, 120);
}
var scrolling = 0;
function iEventHandler(res, e) {
    var ev = e.touches.item(0);
    //alert(res + ": " + ev.clientX + ", " + ev.clientY);
    handleUserEvent(res, ev.clientX, ev.clientY);
}
function eventHandler(res, e) {
    coords = canvas.relMouseCoords(e);
    //debugText(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, coords.x, coords.y, e.offsetX, e.offsetY);
    handleUserEvent(res, coords.x, coords.y);
}
var startAngle = 0;
function handleUserEvent(res, clientX, clientY) {

    if (res == 'down') {
        scrolling = 1;
        currX = clientX - centerX;
        currY = clientY - centerY;
        var tX = (clientX - centerX);
        var tY = (clientY - centerY);
        var dist = Math.sqrt(tX * tX + tY * tY);

        if (dist < 148)
            currRing = 1;
        else if (dist < 208)
            currRing = 2;
        else if (dist < 248)
            currRing = 3;
        else
            currRing = 4;
        startAngle = angles[currRing];
        return;
    }
    if (res == 'up') {
        scrolling = 0;
        //debugText(res, angles[1], angles[2], angles[3], currX, currY);
        return;
    }
    if (scrolling == 0) return;
    var deltaX = clientX - centerX;
    var deltaY = clientY - centerY;
    var sign = deltaY < 0 ? -1 : 1;
    //          var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * sign;
    //          var rotateRadians = Math.PI * 4 * distance/canvas.width;
    var rotateRadians = Math.atan2(deltaY, deltaX) - Math.atan2(currY, currX);
    angles[currRing] = rotateRadians + startAngle;
    drawAllCircles();
    //debugText(res, rotateRadians, angles[currRing], startAngle, currX, currY);
    //alert('hi');
}
function drawAllCircles() {
    // clear
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore(); // Store the current transformation matrix

    drawRotatedCircle(4);
    drawRotatedCircle(3);
    drawRotatedCircle(2);
    drawRotatedCircle(1);
}
function drawRotatedCircle(ringNo) {
    if (ringNo == 1)
        rotate(ringNo, 2641, 769, scaleFactor, angles[1]);
    if (ringNo == 2)
        rotate(ringNo, 673, 780, scaleFactor, angles[2]);
    if (ringNo == 3)
        rotate(ringNo, 796, 798, scaleFactor, angles[3]);
    if (ringNo == 4)
        rotate(ringNo, 1086, 1087, scaleFactor, angles[4]);
}
function rotate(ringNo, origX, origY, scale, rotateRadians) {
    //alert("start: " + x + ", " + y + ", scale = " + scale);

    var x = centerX / scaleFactor;    // these will be scaled later, so unscale now.
    var y = centerY / scaleFactor;

    ctx.save();
    ctx.rotate(rotateRadians);
    var r = Math.sqrt(x * x + y * y);
    var theta = Math.atan(y / x);
    theta = theta - rotateRadians;
    var newx = r * Math.cos(theta);
    var newy = r * Math.sin(theta);

    newx *= scale; newy *= scale;
    origX *= scale; origY *= scale;

    ctx.translate(-1 * origX + newx, -1 * origY + newy);
    //alert(newx + ", " + newy);
    ctx.save();
    ctx.scale(scale, scale);
    drawCircle(ctx, ringNo);
    ctx.restore();
    ctx.restore();
}
function drawCircle(ctx, ringNo) {

    if (ringNo == 1)
        drawInnerCircle(ctx);
    if (ringNo == 2)
        drawMiddleCircle(ctx);
    if (ringNo == 3)
        drawTextOnlyCircle(ctx);
    if (ringNo == 4)
        drawOuterCircle(ctx);
}
