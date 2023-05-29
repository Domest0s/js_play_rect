"use strict";
var SVGCanvas = undefined;
var canvClientRect = {};

function initScript() {
    SVGCanvas = document.getElementById("playSVGCanvas");
    canvClientRect.width = SVGCanvas.getClientRects()[0].width;
    canvClientRect.height = SVGCanvas.getClientRects()[0].height;
}

function createRect() {
    var newRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    var rectX0 = 20;
    var rectY0 = 20;
    var rectWidth = 100;
    var rectHeight = 50;

    newRect.setAttributeNS(null, "x", rectX0);
    newRect.setAttributeNS(null, "y", rectY0);
    newRect.setAttributeNS(null, "width", rectWidth);
    newRect.setAttributeNS(null, "height", rectHeight);
    newRect.setAttributeNS(null, "class", "draggable rect inactive");
    newRect.setAttributeNS(null, "onmousedown", "selectElement(evt)");
    newRect.setAttributeNS(null, "onclick", "clickHandler(evt)");
    SVGCanvas.appendChild(newRect);
}

var currentX = 0;
var currentY = 0;
var shapeWidth = undefined;
var shapeHeight = undefined;

var wasMoved = false;


function selectElement(evt) {
    evt.preventDefault();
    var targetEl = evt.target;
    currentX = evt.clientX;
    currentY = evt.clientY;
    shapeWidth = targetEl.getAttributeNS(null, "width");
    shapeHeight = targetEl.getAttributeNS(null, "height");

    if (SVGCanvas.childElementCount >= 2) {
        // change element's order to show selected item on the top
        SVGCanvas.appendChild(targetEl);
    }

    targetEl.setAttributeNS(null, "onmousemove", "moveElement(evt)");
    targetEl.setAttributeNS(null, "onmouseout", "deselectElement(evt)");
    targetEl.setAttributeNS(null, "onmouseup", "deselectElement(evt)");

    wasMoved = false;
}

function moveElement(evt) {
    evt.preventDefault();
    var targetEl = evt.target;

    var dx = evt.clientX - currentX;
    var dy = evt.clientY - currentY;
    currentX = evt.clientX;
    currentY = evt.clientY;
    var newX = parseInt(targetEl.getAttributeNS(null, "x")) + dx;
    var newY = parseInt(targetEl.getAttributeNS(null, "y")) + dy;

    if(newX < 0) {
        targetEl.setAttributeNS(null, "x", 0);
    } else if (newX > canvClientRect.width - shapeWidth) {
        targetEl.setAttributeNS(null, "x", canvClientRect.width - shapeWidth);
    } else {
        targetEl.setAttributeNS(null, "x", newX);
    }

    if (newY < 0) {
        targetEl.setAttributeNS(null, "y", 0);
    } else if (newY > canvClientRect.height - shapeHeight) {
        targetEl.setAttributeNS(null, "y", canvClientRect.height - shapeHeight);
    } else {
        targetEl.setAttributeNS(null, "y", newY);
    }

    wasMoved = true;
}

function deselectElement(evt) {
    if (evt == null) {
        console.log("Event == null");
        return;
    }
    evt.target.removeAttributeNS(null, "onmousemove");
    evt.target.removeAttributeNS(null, "onmouseout");
    evt.target.removeAttributeNS(null, "onmouseup");
}

function clickHandler(evt) {
    // click event fires even element was moved
    // we don't handle click if element was moved
    if (wasMoved) { return; }

    var targetEl = evt.target;
    if (targetEl.classList.contains("active")) {
        deActivateElm(targetEl);
    } else {
        activateElm(targetEl);
    }
}

function activateElm(elm) {
    elm.classList.remove("inactive");
    elm.classList.add("active");
}

function deActivateElm(elm) {
    elm.classList.remove("active");
    elm.classList.add("inactive");
}