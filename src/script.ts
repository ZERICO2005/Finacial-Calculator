/*
**	Author: zerico2005 (2024)
**	Project: Finacial-Calculator
**	License: MIT License
**	A copy of the MIT License should be included with
**	this project. If not, see https://opensource.org/license/MIT
*/

// Most of this code was from SDL-Keycode-Scancode-Tool

// import { CalcFunc } from './calc';

const CalcKey_PosX          = [0,4,8,12,16,0,4,8,12,16,0,4,8,12,16,0,4,8,12,0,4,8,12,0,0,0,0,16,16,16,16,16,4,8,12,4,8,12,4,8,12,4,8,12];
const CalcKey_PosY          = [0,0,0,0,0,4,4,4,4,4,8,8,8,8,8,12,12,12,12,16,16,16,16,20,24,28,33,13,18,23,28,33,20,20,20,25,25,25,30,30,30,35,35,35];
const CalcKey_SizeX         = [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];
const CalcKey_SizeY         = [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5];
const CalcKey_PrimaryText   = ["CPT","ENTER","^^^","vvv","On|Off","2nd","CF","NPV","IRR","-->","N","I/Y","PV","PMT","FV","%","sqrt","x^2","1/x","INV","(",")","y^x","LN","STO","RCL","CE|C","/","*","-","+","=","7","8","9","4","5","6","1","2","3","0",".","+|-"];
const CalcKey_SecondaryText = ["quit","set","del","ins","","","","","","","xP/Y","P/Y","AMORT","BGN","CLR TVM","K","","","","hyp","sin","cos","tan","e^x","round","","clr work","rand","x!","nPr","nCr","ans","data","stat","bond","depr","◿%","brkevn","date","iconv","profit","mem","format","reset"];
const CalcKey_Func: CalcFunc[]  = [
	/* First Row */
	CalcFunc.Compute    , CalcFunc.Quit  ,
	CalcFunc.Enter      , CalcFunc.Set   ,
	CalcFunc.Scroll_Up  , CalcFunc.Delete,
	CalcFunc.Scroll_Down, CalcFunc.Insert,
	CalcFunc.On_Off     , CalcFunc.None  ,
	/* Second Row */
	CalcFunc.Shift_2nd              , CalcFunc.None,
	CalcFunc.Cash_Flow              , CalcFunc.None,
	CalcFunc.Net_Present_Value      , CalcFunc.None,
	CalcFunc.Internal_Rate_Of_Return, CalcFunc.None,
	CalcFunc.Backspace              , CalcFunc.None,
	/* Third Row */
	CalcFunc.Num_Periods      , CalcFunc.Compounding_Periods      ,
	CalcFunc.Interest_Per_Year, CalcFunc.Periods_Per_Year         ,
	CalcFunc.Present_Value    , CalcFunc.Amortization             ,
	CalcFunc.Payment          , CalcFunc.Begin_Mode               ,
	CalcFunc.Future_Value     , CalcFunc.Clear_Time_Value_Of_Money,
	/* Fourth Row */
	CalcFunc.Percent    , CalcFunc.Coupon_Rate,
	CalcFunc.Square_Root, CalcFunc.None       ,
	CalcFunc.Square     , CalcFunc.None       ,
	CalcFunc.Reciprocal , CalcFunc.None       ,
	/* Fith Row */
	CalcFunc.Inverse          , CalcFunc.Hyperbolic,
	CalcFunc.Left_Parentheses , CalcFunc.Sine      ,
	CalcFunc.Right_Parentheses, CalcFunc.Cosine    ,
	CalcFunc.Power            , CalcFunc.Tangent   ,
	/* Left Column */
	CalcFunc.Natural_Logarithm, CalcFunc.Exponentiation,
	CalcFunc.Store            , CalcFunc.Round         ,
	CalcFunc.Recall           , CalcFunc.None          ,
	CalcFunc.Clear_Entry      , CalcFunc.Clear_Work    ,
	/* Right Column */
	CalcFunc.Division      , CalcFunc.Random     ,
	CalcFunc.Multiplication, CalcFunc.Permutation,
	CalcFunc.Subtraction   , CalcFunc.nPr        ,
	CalcFunc.Addition      , CalcFunc.nCr        ,
	CalcFunc.Evalulate     , CalcFunc.Answer     ,
	/* Number Pad */
	CalcFunc.Num_7        , CalcFunc.Data               ,
	CalcFunc.Num_8        , CalcFunc.Statistics         ,
	CalcFunc.Num_9        , CalcFunc.Bond               ,
	CalcFunc.Num_4        , CalcFunc.Depreciation       ,
	CalcFunc.Num_5        , CalcFunc.Percent_Change     ,
	CalcFunc.Num_6        , CalcFunc.Break_Even         ,
	CalcFunc.Num_1        , CalcFunc.Date               ,
	CalcFunc.Num_2        , CalcFunc.Interest_Conversion,
	CalcFunc.Num_3        , CalcFunc.Profit             ,
	CalcFunc.Num_0        , CalcFunc.Memory             ,
	CalcFunc.Decimal_Point, CalcFunc.Format             ,
	CalcFunc.Negate       , CalcFunc.Reset              ,	
];

function calcMinMaxRatio(val: any, min: any, max: any, ratio: any) {
    if (val < min) {
        val = min;
    }
    if (val <= max) {
        return val;
    }
    val *= ratio;
    if (val < max) {
        val = max;
    }
    return val;
}

var Clicked_Key = 0;

const keyboardElement = document.getElementById("keyboard");

if (keyboardElement != null) {
    keyboardElement.addEventListener("mouseout", function(event) { 

    });
} else {
    console.error("Element with id 'keyboard' not found");
}

function generateKeyboard() {
	let scaleMultX = 1.5;
	let scaleMultY = 1.0;

    const container = document.getElementById("keyboard");
	if (container == null) {
		console.log("Error: Unable to get #keyboard")
		return;
	}
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
 
    const Key_Size = 4;
    let corX = 9999; let corY = 9999; // Negative coordinates
    let dimX = -9999; let dimY = -9999; // Maximum coordinate
    for (let i = 0; i < CalcKey_PrimaryText.length; i++) {
		let keyPosX = CalcKey_PosX[i] * scaleMultX;
		let keyPosY = CalcKey_PosY[i] * scaleMultY;
		let keySizeX = CalcKey_SizeX[i] * scaleMultX;
		let keySizeY = CalcKey_SizeY[i] * scaleMultY;
		if (keyPosX + keySizeX > dimX) {
			dimX = keyPosX + keySizeX;
		}
		if (keyPosY + keySizeY > dimY) {
			dimY = keyPosY + keySizeY;
		}
		if (keyPosX < corX) { corX = keyPosX; }
		if (keyPosY < corY) { corY = keyPosY; }
    }
    corX = -corX; corY = -corY;
    dimX += corX; dimY += corY;

    let Keyboard_Border = 0.5 * Key_Size;
    let Key_Spacing = 0.075 * Key_Size;
    let Key_Offset_Value = Keyboard_Border * 2 - Key_Spacing;

    let resX = window.innerWidth - 24; let resY = window.innerHeight - 24;
    resY = calcMinMaxRatio(resY, 288, 576, 0.6);
    resX = resY * (dimX + Key_Offset_Value) / (dimY + Key_Offset_Value);
    if (resX < 96) { resX = 96; }
    container.style.width = resX + "px";
    container.style.height = resY + "px";


    let scaleFactorX = ((resX) / (dimX + Key_Offset_Value)) * scaleMultX;
    let scaleFactorY = ((resY) / (dimY + Key_Offset_Value)) * scaleMultY;
	
    let scaleFactorZ = Math.min(scaleFactorX, scaleFactorY);
    let Key_Border = 0.06 * scaleFactorZ * Key_Size;
    let cornerRadius = scaleFactorZ * Key_Size * 0.2;
    container.style.borderRadius = `${cornerRadius * Keyboard_Border}px`;
    let fontScale = scaleFactorZ * 1.0;
    if (fontScale < 4) {
        fontScale = 4;
    }
    //console.log(scaleFactorZ);
	let offsetX = Keyboard_Border * scaleFactorZ;
	let offsetY = Keyboard_Border * scaleFactorZ;
    let offsetX0 = corX;
    let offsetY0 = corY;
    let offsetX1 = -Key_Spacing;
    let offsetY1 = -Key_Spacing;
    for (let i = 0; i < CalcKey_PrimaryText.length; i++) {
            let x0 = CalcKey_PosX[i] + offsetX0; let y0 = CalcKey_PosY[i] + offsetY0;
            let x1 = CalcKey_SizeX[i] + offsetX1; let y1 = CalcKey_SizeY[i] + offsetY1;
            x0 *= scaleFactorX; y0 *= scaleFactorY;
            x1 *= scaleFactorX; y1 *= scaleFactorY;
            let box = document.createElement("button");
            box.classList.add("keyboard-key");
            let posX = x0 + offsetX;
            let posY = y0 + offsetY;
            box.style.left = `${posX}px`;
            box.style.top = `${posY}px`;
            if (CalcKey_PrimaryText[i].length == 1) {
                box.style.fontSize = `${fontScale * Math.sqrt(2.0)}px`;
            } else {
                box.style.fontSize = `${fontScale}px`;
            }

            let sizeX = x1;
            let sizeY = y1;
            box.style.width = `${sizeX}px`;
            box.style.height = `${sizeY}px`;
            box.style.borderRadius = `${cornerRadius}px`;
            box.style.borderWidth = `${Key_Border}px`;
            box.addEventListener("click", function() { process_Input(CalcKey_Func[i * 2], CalcKey_Func[i * 2 + 1]) });
            box.addEventListener("mouseover", function() {  });
            container.appendChild(box);
            box.innerHTML = CalcKey_PrimaryText[i] + "<br>" + CalcKey_SecondaryText[i];
    }
}

let STATIC_WindowResX = window.innerWidth;
let STATIC_WindowResY = window.innerHeight;

function checkWindowResize() {
    const resX = window.innerWidth;
    const resY = window.innerHeight;

    if (resX !== STATIC_WindowResX) { // Veritcal resolution does not affect the keyboard
        STATIC_WindowResX = resX;
        STATIC_WindowResX = resY;
        generateKeyboard();
    }
}

// document.getElementById("Keyboard_Select").addEventListener("change", function(event) { generateKeyboard(); });
window.addEventListener("resize", checkWindowResize);

window.addEventListener("load", function() { generateKeyboard(); });