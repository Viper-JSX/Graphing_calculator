let x;
let y;
let functionString = "x^2";//x**2;
let scale = 3; //The bigger the scale the tinier change of x
let isScaling = false;
let step = 0.1/scale;

const originOffset = {x: 0, y: 0};
const originMovedBy = {x: 0, y: 0};
const graphFieldInitRange = {x: {l: -10, h: 10}, y: {l: -2, h: 10}};
const graphRange = {l: -10, h: 10};
const graphFieldRange = {
    x: {l: graphFieldInitRange.x.l / scale, h: graphFieldInitRange.x.h},
    y: {l: graphFieldInitRange.y.l / scale, h: graphFieldInitRange.y.h}
};

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
    drawGraph(functionOfX, graphRange);
}

function handleGraphDisplayDragStart(event){
    //show coord of clicked point
    const dragStartCoords = { x: event.clientX - event.target.offsetLeft, y:event.clientY - event.target.offsetTop /*offetLeft/Top are relatevely to parent (#graphingCalculator)*/};
    graphDisplay.onmousemove = (event) =>  handleOriginOffsetChange({event, dragStartCoords});
}

function handleGraphDisplayDragEnd(event){
    graphDisplay.onmousemove = null;
}

function handleOriginOffsetChange({ event, dragStartCoords}){
    if(event.target.classList[0] == "graphPoint"){ //When druring drag mouse on graph
        return;
    }
    
    const dragEndCoords = { x: event.clientX - event.target.offsetLeft, y:event.clientY - event.target.offsetTop /*offetLeft/Top are relatevely to parent (#graphingCalculator)*/};
    const movedBy = {x: dragEndCoords.x - dragStartCoords.x, y: dragEndCoords.y - dragStartCoords.y };
    originMovedBy.x = movedBy.x / scale;
    originMovedBy.y = movedBy.y / scale;

    //need to set new start point after each time event fires cause it always take coords of dragging start
    originOffset.x += (-originMovedBy.x);
    originOffset.y += (originMovedBy.y);
    originMovedBy.x = 0;
    originMovedBy.y = 0;

    dragStartCoords.x = dragEndCoords.x; //Setting coords so that i't a new 
    dragStartCoords.y = dragEndCoords.y; //refference point

    drawGraph(functionOfX, graphRange);
}

function handleScale(event){
    scale = parseInt(event.target.value);
    step = 0.1 / scale;
    //graphFieldRange.x = {l: graphFieldInitRange.x.l / scale, h: graphFieldInitRange.x.h / scale}, //consider origin desplacement
    //graphFieldRange.y = {l: graphFieldInitRange.y.l / scale, h: graphFieldInitRange.y.h / scale}; //consider origin desplacement
    //console.log(graphFieldRange);
    drawGraph(functionOfX, graphRange);
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

function drawGraph(functionOfX, graphRange){
    graphDisplay.textContent = "";
    for(let i = graphRange.l; i <= graphRange.h; i += step){
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

drawGraph(functionOfX, graphRange);
