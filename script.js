//---Variables---//
const graphingCalculator = document.getElementById("graphingCalculator");
const functionInput = document.getElementById("functionInput");
const scaleInput = document.getElementById("scaleInput");
const graphDisplay = document.getElementById("graphDisplay");
const graphXMarkup = document.getElementById("graphXMarkup");
const graphYMarkup = document.getElementById("graphYMarkup");
graphDisplay.style.cssText = "width: 520px; height: 500px";

const xAxis = document.createElement("div");
const yAxis = document.createElement("div");

let x;
let y;
let functionString = "x^2"; //x**2;
let scale = 1; //The bigger the scale the tinier change of x
//let isScaling = false;
let step = 0.1 / scale;
let lineThikness = 1;
let unitSizeInPixels = 20; //distance of one unit of coordinates

const originCoords = {x: graphDisplay.offsetWidth / 2, y: graphDisplay.offsetHeight / 2 };
const originOffset = {x: 0, y: 0};
const originMovedBy = {x: 0, y: 0};
//const graphFieldRange = {x: {l: -10, h: 10}, y: {l: -10, h: 10}};
const graphFieldRange = {
    x: {l: -graphDisplay.offsetWidth / (2 * unitSizeInPixels), h: graphDisplay.offsetWidth / (2 * unitSizeInPixels)},
    y: {l: -graphDisplay.offsetHeight / (2 * unitSizeInPixels), h: graphDisplay.offsetHeight / (2 * unitSizeInPixels)},
};
const graphRange = {l: -10, h: 10};
//const graphFieldRange = {
//    x: {l: graphFieldInitRange.x.l / scale, h: graphFieldInitRange.x.h},
//    y: {l: graphFieldInitRange.y.l / scale, h: graphFieldInitRange.y.h}
//};

//---------------//


//---Initial start set---//

xAxis.id = "xAxis";
yAxis.id = "yAxis";

functionInput.onchange = handleFunctionInputChnage;
scaleInput.onchange = handleScale;

graphDisplay.onmousedown = handleGraphDisplayDragStart;
graphDisplay.onmouseup = handleGraphDisplayDragEnd;

/* Scale
graphDisplay.ontouchstart = handleScaleStart;
graphDisplay.ontouchmove = handleScale;
graphDisplay.ontouchend = handleScaleEnd;
*/

drawGraph(functionOfX, graphRange);

//----------------------//



//---Functions---//

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
    originOffset.x += (originMovedBy.x); //You can inverse the drag
    originOffset.y += (-originMovedBy.y);  //You can inverse the drag
    originMovedBy.x = 0;
    originMovedBy.y = 0;

    dragStartCoords.x = dragEndCoords.x; //Setting coords so that i't a new 
    dragStartCoords.y = dragEndCoords.y; //refference point

    //graphFieldRange = {
    //    x: {l: (-graphDisplay.offsetWidth + originOffset.x) / (2 * unitSizeInPixels), h: (graphDisplay.offsetWidth + originOffset.x) / (2 * unitSizeInPixels)},
    //    y: {l: (-graphDisplay.offsetHeight + originOffset.y) / (2 * unitSizeInPixels), h: (graphDisplay.offsetHeight + originOffset.y) / (2 * unitSizeInPixels)},
    //};
    //change background position too
    renderMarkup();
    drawGraph(functionOfX, graphRange);
}

function handleScale(event){
    scale = parseInt(event.target.value);
    step = 0.1 / scale //> 0.01 ? 1/scale : 0.01;
    renderMarkup();
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
    return 1/x ? 1/x : null;//x**2 ? x**2 : null;
}

function drawGraph(functionOfX, graphRange){
    graphDisplay.textContent = "";
     
    graphDisplay.appendChild(xAxis);
    graphDisplay.appendChild(yAxis);


    for(let i = graphRange.l; i <= graphRange.h; i += step){
        const newPoint = document.createElement("div");
        newPoint.classList.add("graphPoint");
        x = i;
        y = -1 * functionOfX(x);

        if(!y || y === -Infinity || y === Infinity) continue; 

        x *= unitSizeInPixels;
        y *= unitSizeInPixels;

        x += originCoords.x;
        y += originCoords.y;

        x += originOffset.x;
        y -= originOffset.y;

        x *= scale;
        y *= scale;

        newPoint.style.cssText = `left: ${x}px; top: ${y}px`;
        graphDisplay.appendChild(newPoint);

        //rotation and tangents
        if(i < graphRange.h){
            let followPoint = functionOfX(i + step) * unitSizeInPixels;
            let xDist = step * unitSizeInPixels;
            let yDist = followPoint - functionOfX(i) * unitSizeInPixels;
            let length = 0;
            let rotationAngle = Math.atan(yDist / xDist);
    
        
            rotationAngle *= -1;

            length = Math.hypot(yDist, xDist);
            newPoint.style.width = `${length * scale + 1}px`;
            newPoint.style.height = `${lineThikness}px`;
            newPoint.style.transform = `rotate(${rotationAngle * 57.296}deg)`;
        }
        /////////////////////////////////////////////
    }

    xAxis.style.top =  `${(originCoords.y - originOffset.y) * scale}px`;
    yAxis.style.left = `${(originCoords.x + originOffset.x) * scale}px`;
}

function renderMarkup(){
    for(let i = graphFieldRange.x.l; i <= graphFieldRange.x.h; i++ ){
        let newMarkPoint = document.createElement("span");
        newMarkPoint.textContent = i /// unitSizeInPixels;
        newMarkPoint.style.display = "inline-block"
        newMarkPoint.style.marginLeft = `${10 - newMarkPoint.offsetWidth}px`;
        graphXMarkup.appendChild(newMarkPoint);
    }
}
//-------------//