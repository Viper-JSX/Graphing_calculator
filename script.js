let x;
let y;
let functionString = "x^2";//x**2;
let scale = 3; //The bigger the scale the tinier change of x
let isScaling = false;
let step = 0.1/scale;
const range = {l: -10, h: 10};
const originOffset = {x: 0, y: 0};
const originMovedBy = {x: 0, y: 0};
const graphingCalculator = document.getElementById("graphingCalculator");
const functionInput = document.getElementById("functionInput");
const scaleInput = document.getElementById("scaleInput");
const graphDisplay = document.getElementById("graphDisplay");

functionInput.onchange = handleFunctionInputChnage;
scaleInput.onchange = handleScale;

graphDisplay.onmousedown = handleGraphDisplayDragStart;
graphDisplay.onmouseup = handleGraphDisplayDragEnd;

/* Scale
graphDisplay.ontouchstart = handleScaleStart;
graphDisplay.ontouchmove = handleScale;
graphDisplay.ontouchend = handleScaleEnd;
*/

function handleFunctionInputChnage(event){
    drawGraph(functionOfX, range);
}

function handleGraphDisplayDragStart(event){
    //show coord of clicked point
    const dragStartCoords = { x: event.clientX - event.target.offsetLeft, y:event.clientY - event.target.offsetTop /*offetLeft/Top are relatevely to parent (#graphingCalculator)*/};
    graphDisplay.onmousemove = (event) =>  handleOriginOffsetChange({event, dragStartCoords});
}

function handleGraphDisplayDragEnd(event){
    //show coord of clicked point
    graphDisplay.onmousemove = null;
    
    //originOffset.x += (-originMovedBy.x);
    //originOffset.y += (originMovedBy.y);
    //originMovedBy.x = 0;
    //originMovedBy.y = 0;
    //drawGraph(functionOfX, range);
}

function handleOriginOffsetChange({ event, dragStartCoords}){
    const dragEndCoords = { x: event.clientX - event.target.offsetLeft, y:event.clientY - event.target.offsetTop /*offetLeft/Top are relatevely to parent (#graphingCalculator)*/};
    const movedBy = {x: dragEndCoords.x - dragStartCoords.x, y: dragEndCoords.y - dragStartCoords.y };
    console.log(dragStartCoords)
    originMovedBy.x = movedBy.x / scale;
    originMovedBy.y = movedBy.y / scale;

    //need to set new start point after each time event fires cause it always take coords of dragging start
    originOffset.x += (-originMovedBy.x);
    originOffset.y += (originMovedBy.y);
    originMovedBy.x = 0;
    originMovedBy.y = 0;

    dragStartCoords.x = dragEndCoords.x;
    dragStartCoords.y = dragEndCoords.y;

    drawGraph(functionOfX, range);
}

function handleScale(event){
    scale = parseInt(event.target.value);
    step = 0.1 / scale;
    drawGraph(functionOfX, range);
}

/* Handle scale
function handleScaleStart(event){
    console.log(event.touches.lenght);
    ///if(event.touches.lenght == 2){
        
        console.log("ScalingStart");
        isScaling = true;
    //}
}

function handleScale(event){
    console.log(event)
    console.log("moving scale");
}

function handleScaleEnd(){
    console.log("End scalse");
    isScaling = false;
}
*/

function functionOfX(x, functionOfX = "x"){
    //turn func to x
    return (x**2);
}

function drawGraph(functionOfX, range){
    graphDisplay.textContent = "";
    for(let i = range.l; i <= range.h; i += step){
        const newPoint = document.createElement("div");
        newPoint.classList.add("graphPoint");
        x = i/*originOffset.x*/;
        y = functionOfX(x) + originOffset.y;
        x += originOffset.x;
        y += originOffset.y;
        x *= scale;
        y *= scale;

        newPoint.style.cssText = `margin-left: ${x}px; margin-top: ${-y}px`;
        graphDisplay.appendChild(newPoint);
    }
}

drawGraph(functionOfX, range);
