//---Variables---//
const graphingCalculator = document.getElementById("graphingCalculator");
const functionInput = document.getElementById("functionInput");
const scaleInput = document.getElementById("scaleInput");
const graphDisplay = document.getElementById("graphDisplay");
const graphContainer = document.getElementById("graphContainer");
const graphXMarkup = document.getElementById("graphXMarkup");
const markupXPoints = document.getElementById("markupXPoints");
const graphYMarkup = document.getElementById("graphYMarkup");
const markupYPoints = document.getElementById("markupYPoints");
graphDisplay.style.cssText = "width: 520px; height: 520px";

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
const graphContainerDimentions = {width: 520, height: 520};
const markupOffset = {xMarkup: 0, yMarkup: 0};

const graphFieldRange = {
    x: {l: -graphDisplay.offsetWidth / (2 * unitSizeInPixels), h: graphDisplay.offsetWidth / (2 * unitSizeInPixels)},
    y: {l: -graphDisplay.offsetHeight / (2 * unitSizeInPixels), h: graphDisplay.offsetHeight / (2 * unitSizeInPixels)},
};
const graphRange = {l: -20, h: 20};
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

renderMarkup();
drawGraph(functionOfX, graphRange);

//----------------------//


//---Functions---//

function functionOfX(x, functionOfX = "x*2"){
    //turn func to x
    let replacedFunc = functionOfX.replace("x", x);

    console.log(replacedFunc)
    return eval(replacedFunc);
    //return 1/x; //x**2/*x^3*///x**2 //1/x ? 1/x : null;//x**2 ? x**2 : null;
}


function handleFunctionInputChnage(event){
    let func = event.target.value;
    func = func.replace("^", "**");
    func = func.replace("sin", "Math.sin");
    func = func.replace("cos", "Math.cos");
    func = func.replace("tan", "Math.tan");
    func = func.replace("lg", "Math.log10");
    func = func.replace("ln", "Math.log");
    func = func.replace("e", "Math.E");

    console.log(func)
    functionOfX = function(x, functionOfX = func){
        return eval(func);
    }

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
    originMovedBy.x = movedBy.x /// scale;
    originMovedBy.y = movedBy.y /// scale;

    //need to set new start point after each time event fires cause it always take coords of dragging start
    originOffset.x += (originMovedBy.x); //You can inverse the drag
    originOffset.y += (-originMovedBy.y);  //You can inverse the drag
    originMovedBy.x = 0;
    originMovedBy.y = 0;

    dragStartCoords.x = dragEndCoords.x; //Setting coords so that i't a new refference point
    dragStartCoords.y = dragEndCoords.y; //Setting coords so that i't a new refference point

    graphContainer.style.marginLeft = `${originOffset.x}px`;    
    graphContainer.style.marginTop = `${-1 *originOffset.y}px`;
    
    positionTheMarkup(movedBy);

    //render the graph up
    //graphContainer.style.width = `${(}px`;
    //graphContainer.style.height = `${(Math.abs(graphRange.l) + Math.abs(graphRange.h)) * unitSizeInPixels * scale}px`;
    //console.log("Width: ", ((Math.abs(graphRange.l) + Math.abs(graphRange.h)) * unitSizeInPixels * scale) / 2,  originOffset.x)
    //if(graphContainerDimentions.width / 2 <= originOffset.x * scale /*|| ((Math.abs(graphRange.l) + Math.abs(graphRange.h)) * unitSizeInPixels * scale) / 2 >= originOffset.x*/){
    
    //console.log("Offset left: ", graphContainerDimentions.width / 2 - Math.abs(originOffset.x));
    if(graphContainerDimentions.width / 2 - Math.abs(originOffset.x) < 250){
        graphRange.l *= 1.2; //Increase field size when reaching the edge
        graphRange.h *= 1.2; //Increase field size when reaching the edge
        drawGraph(functionOfX, graphRange);
    }

    if(graphContainerDimentions.height / 2 - Math.abs(originOffset.y) < 250){
        graphRange.l *= 1.2; // Increase field size when reaching the edge
        graphRange.h *= 1.2; // Increase field size when reaching the edge
        drawGraph(functionOfX, graphRange);
    }

    //change background position too
    //markupXPoints.style.marginLeft = `${originOffset.x * scale}px`;
    //markupYPoints.style.marginTop = `${-1 * originOffset.y * scale}px`;
    //drawGraph(functionOfX, graphRange);
}


function handleScale(event){
    if(parseInt(event.target.value) > 0){
        scale = parseInt(event.target.value);
    }
    else if(parseInt(event.target.value) < 0){
        scale = parseFloat(1 / (-1 * parseInt(event.target.value)));
    }
    
    unitSizeInPixels = 20 * scale;
    step = step / scale > 0.1 ?  parseFloat((0.1 / scale).toFixed(2)) : 0.1;//.toFixed(1)); //> 0.01 ? 1/scale : 0.01;

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
function drawGraph(functionOfX, graphRange){
    graphContainer.textContent = ""; 
    updateGraphContainerDimentions();
    updateOriginCoordinates();

    graphContainer.appendChild(xAxis);
    graphContainer.appendChild(yAxis);


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

        newPoint.style.cssText = `left: ${x}px; top: ${y}px`;
        graphContainer.appendChild(newPoint);

        //rotation and tangents
        if(i < graphRange.h){
            let followPoint = functionOfX(i + step) * unitSizeInPixels;
            let xDist = step * unitSizeInPixels;
            let yDist = followPoint - functionOfX(i) * unitSizeInPixels;
            let length = 0;
            let rotationAngle = Math.atan(yDist / xDist);
    
        
            rotationAngle *= -1;

            length = Math.hypot(yDist, xDist);
            newPoint.style.width = `${length + 1}px`;
            newPoint.style.height = `${lineThikness}px`;
            newPoint.style.transform = `rotate(${rotationAngle * 57.296}deg)`;
        }
        /////////////////////////////////////////////
    }

    xAxis.style.top =  `${originCoords.x}px`;
    yAxis.style.left = `${originCoords.y}px`;
}

function renderMarkup(){
    markupXPoints.textContent = "";
    markupYPoints.textContent = "";
    for(let i = graphFieldRange.x.l, j = -400; i <= graphFieldRange.x.h, j <= 400; i += step, j++ ){
        let newMarkXPoint = document.createElement("span");
        newMarkXPoint.className = "markXPoint";
        newMarkXPoint.textContent = (j / scale).toFixed(1);           
        newMarkXPoint.style.width = `${/*unitSizeInPixels*/20}px`;

        markupXPoints.appendChild(newMarkXPoint);
        markupXPoints.style.marginLeft = `${originOffset.x}px`;
    }

    for(let i = graphFieldRange.y.h, j = 400; i >= graphFieldRange.y.l, j >= -400; i -= step, j-- ){
        let newMarkYPoint = document.createElement("span");
        newMarkYPoint.className = "markYPoint";
        newMarkYPoint.textContent = (j / scale).toFixed(1);        
        newMarkYPoint.style.height = `${/*unitSizeInPixels*/20}px`;

        markupYPoints.appendChild(newMarkYPoint);
    }
}

function positionTheMarkup(movedBy){
    markupOffset.xMarkup += movedBy.x;
    markupOffset.yMarkup += movedBy.y;
    markupXPoints.style.marginLeft = `${markupOffset.xMarkup}px`;
    markupYPoints.style.marginTop = `${markupOffset.yMarkup}px`;
}

function centerCurrentPoint(timesDifferenceFromPrevious){
    let generalOffset = ((Math.abs(graphRange.l) + Math.abs(graphRange.h)) * unitSizeInPixels * scale) - ((Math.abs(graphRange.l) + Math.abs(graphRange.h)) * unitSizeInPixels * scale) / (timesDifferenceFromPrevious);

    console.log("generalXOffset: ", generalOffset);
    originOffset.x -= generalOffset;
    originOffset.y += generalOffset;
}

function updateOriginCoordinates(){    
    originCoords.x = graphContainer.offsetWidth / 2;
    originCoords.y = graphContainer.offsetHeight / 2;
    //console.log("X: ", originCoords.x , "Y: ", originCoords.y)
    //console.log("updating origin coords:", graphDisplay.offsetWidth / 2, graphDisplay.offsetHeight / 2)
}

function updateGraphContainerDimentions(){
    graphContainerDimentions.width = (Math.abs(graphRange.l) + Math.abs(graphRange.h)) * unitSizeInPixels * scale;
    graphContainerDimentions.height = (Math.abs(graphRange.l) + Math.abs(graphRange.h)) * unitSizeInPixels * scale;

    graphContainerDimentions.width = graphContainerDimentions.width > 520 ? graphContainerDimentions.width : 520;
    graphContainerDimentions.height = graphContainerDimentions.height > 520 ? graphContainerDimentions.height : 520;

    graphContainerDimentions.width = graphContainerDimentions.width < 12800 ? graphContainerDimentions.width : 12800;
    graphContainerDimentions.height = graphContainerDimentions.height < 12800 ? graphContainerDimentions.height : 12800;

    graphContainer.style.width = `${graphContainerDimentions.width}px`;
    graphContainer.style.height = `${graphContainerDimentions.height}px`;

}

//-------------//