/*
**	Author: zerico2005 (2024)
**	Project: Finacial-Calculator
**	License: MIT License
**	A copy of the MIT License should be included with
**	this project. If not, see https://opensource.org/license/MIT
*/

const enum CalcFunc {
	None,

	Compute, Enter   , Scroll_Up, Scroll_Down, On_Off,
	Quit   , Set     , Delete   , Insert     ,
	
	Shift_2nd, Cash_Flow, Net_Present_Value, Internal_Rate_Of_Return, Backspace,
	
	Num_Periods        , Interest_Per_Year, Present_Value, Payment   , Future_Value             ,
	Compounding_Periods, Periods_Per_Year , Amortization , Begin_Mode, Clear_Time_Value_Of_Money,
	
	Percent    , Square_Root, Square, Reciprocal, 
	Coupon_Rate,

	Inverse   , Left_Parentheses, Right_Parentheses, Power  ,
	Hyperbolic, Sine            , Cosine           , Tangent,
	
	Natural_Logarithm, Store, Recall, Clear_Entry,
	Exponentiation   , Round,         Clear_Work,
	
	Division, Multiplication, Subtraction, Addition, Evalulate,
	Random  , Permutation   , nPr        , nCr     , Answer   ,

	Num_7       , Num_8              , Num_9     ,
	Data        , Statistics         , Bond      ,
	Num_4       , Num_5              , Num_6     ,
	Depreciation, Percent_Change     , Break_Even,
	Num_1       , Num_2              , Num_3     ,
	Date        , Interest_Conversion, Profit    ,
	Num_0       , Decimal_Point      , Negate    ,
	Memory      , Format             , Reset     ,
}

const CalcFunc_Text: string[] = [
	"None",

	"Compute", "Enter"   , "Scroll Up", "Scroll Down", "On|Off",
	"Quit"   , "Set"     , "Delete"   , "Insert"     ,
	
	"Shift 2nd", "CF (Cash Flow)", "NPV (Net Present_Value)", "IRR (Internal Rate of Return)", "Backspace",
	
	"N (Number of Periods)"  , "I/Y (Interest per Year)", "PV (Present Value)", "PMT (Payment)"   , "FV (Future Value)"                  ,
	"K (Compounding Periods)", "xP/Y (Periods per Year)", "Amortization"      , "BGN (Begin Mode)", "CLR TVM (Clear Time Value of Money)",
	
	"% Percent"      , "Square Root", "Square", "Reciprocal", 
	"K (Coupon Rate)",

	"Inverse"   , "Left Parentheses", "Right Parentheses", "y^x (Power)"  ,
	"Hyperbolic", "Sine"            , "Cosine"           , "Tangent"      ,
	
	"LN (Natural Logarithm)", "STO (Store)", "RCL (Recall)", "CE|C (Clear Entry)",
	"e^x (Exponentiation)"  , "Round",                       "Clear Work"        ,
	
	"/ Division", "* Multiplication", "- Subtraction", "+ Addition", "= Evalulate",
	"Random"    , "! Permutation"  , "nPr"          , "nCr"       , "Answer"     ,

	"7"           , "8"                          , "9"           ,
	"Data"        , "Statistics"                 , "Bond"        ,
	"4"           , "5"                          , "6"           ,
	"Depreciation", "◿% Percent-Change"          , "Break-Even"  ,
	"1"           , "2"                          , "3"           ,
	"Date"        , "ICONV (Interest Conversion)", "Profit"      ,
	"0"           , "Decimal Point"              , "+|- (Negate)",
	"Memory"      , "Format"                     , "Reset"       ,
];

function outputToDisplay(val: any): void {
    const Screen = document.getElementById("screen");
    if (Screen == null) { console.log("Error: #screen is null"); return; }
    Screen.innerHTML = String(val);
}

function formatValue(val: number): string {
	if (val < 1.0e9) {
		return String(val);
	}
	return val.toExponential(8);
}

function outputNumberToDisplay(val: number): void {
	outputToDisplay(formatValue(val));
	//outputToDisplay(val.toFixed(10));
}

function getCalcFuncName(val: CalcFunc): string {
	return CalcFunc_Text[val];
}

let current_Operator: Operator = Operator.None;
let modifier_Angle: Angle_Format = Angle_Format.Degrees;
let modifier_2ND: boolean = false;
let modifier_INV: boolean = false;
let modifier_HYP: boolean = false;

let error_Flag: string = "";

let arg_Input: number = 0.0;
let input_Decmial_Shift: number = 0;

let arg_Pointer: number = 0;
let arg_Param: number[] = [0,0,0,0];

function clear_Modifiers(): void {
	modifier_2ND = false;
	modifier_HYP = false;
	modifier_INV = false;
}

function clear_Arg_Input(): void {
	arg_Input = 0.0;
	input_Decmial_Shift = 0;
}

function reset_Arg_Param(num: number): void {
	clear_Modifiers();
	arg_Input = num;
	arg_Pointer = 0;
	arg_Param.fill(0);
	arg_Param[0] = num;
	input_Decmial_Shift = 0;
	
}
function clear_Arg_Param(): void {
	clear_Modifiers();
	arg_Input = 0.0;
	input_Decmial_Shift = 0;
	arg_Pointer = 0;
	arg_Param.fill(0);
}

function calc_Reset(): void {
	current_Operator = Operator.None;
	clear_Modifiers();
	clear_Arg_Param();
	outputNumberToDisplay(arg_Input);
}
window.addEventListener("load", function() { calc_Reset(); } );

function calc_Evaluate() {
	arg_Param[arg_Pointer] = arg_Input;
	reset_Arg_Param(func_Evaluate(current_Operator));
	current_Operator = Operator.None;
}
function set_Operation(oper: Operator): void {
	if (oper != Operator.None) {
		calc_Evaluate();
		current_Operator = oper;
		return;
	}
}
function set_Arg_Param(arg_Index: number): void {
	arg_Param[arg_Pointer] = arg_Input;
	clear_Modifiers();
	arg_Pointer = arg_Index;
	arg_Pointer = (arg_Pointer < arg_Param.length && arg_Pointer > 0) ? arg_Pointer : 0;
	input_Decmial_Shift = 0;
	arg_Input = arg_Param[arg_Pointer];
}
function next_Arg_Param(): void {
	arg_Param[arg_Pointer] = arg_Input;
	clear_Modifiers();
	arg_Pointer++;
	arg_Pointer = (arg_Pointer < arg_Param.length) ? arg_Pointer : arg_Param.length;
	input_Decmial_Shift = 0;
	arg_Input = arg_Param[arg_Pointer];
}
function previous_Arg_Param(): void {
	arg_Param[arg_Pointer] = arg_Input;
	clear_Modifiers();
	arg_Input = 0.0;
	input_Decmial_Shift = 1;
	arg_Pointer--;
	arg_Pointer = (arg_Pointer >= 0) ? arg_Pointer : 0;
	arg_Input = arg_Param[arg_Pointer];
}

function process_Digit(num: number): void {
	if (num < 0 || num > 9) {
		console.log("Error: Cannot process digit `" + num + "`, out of bounds");
		return;
	}
	if (arg_Input < 0.0) {
		num = -num;
	}
	if (input_Decmial_Shift > 0) {
		clear_Arg_Input();
		return;
	}
	if (input_Decmial_Shift == 0) {
		arg_Input *= 10.0;
		arg_Input += num;
		return;
	}
	if (input_Decmial_Shift < 0) {
		arg_Input += num * Math.pow(10, input_Decmial_Shift);
		input_Decmial_Shift--;
		return;
	}
}

function remove_Digit(): void {
	if (input_Decmial_Shift > 0) {
		clear_Arg_Input();
		return
	}
	if (input_Decmial_Shift == 0) {
		arg_Input = Math.trunc(arg_Input / 10.0);
		return;
	}
	if (input_Decmial_Shift == -1) {
		arg_Input = Math.trunc(arg_Input);
		input_Decmial_Shift++;
		return;
	}
	if (input_Decmial_Shift < -1) {
		let mask: number = arg_Input - Math.trunc(arg_Input);
		mask *= Math.pow(10, -(input_Decmial_Shift + 2));
		mask = mask - Math.trunc(mask);
		mask *= Math.pow(10, (input_Decmial_Shift + 2));
		arg_Input -= mask;
		input_Decmial_Shift++;
		return;
	}
}

function get_Numpad_Value(num: CalcFunc) {
	switch (num) {
		case CalcFunc.Num_0: return 0;
		case CalcFunc.Num_1: return 1;
		case CalcFunc.Num_2: return 2;
		case CalcFunc.Num_3: return 3;
		case CalcFunc.Num_4: return 4;
		case CalcFunc.Num_5: return 5;
		case CalcFunc.Num_6: return 6;
		case CalcFunc.Num_7: return 7;
		case CalcFunc.Num_8: return 8;
		case CalcFunc.Num_9: return 9;
		default: return NaN;
	}
}


function process_Arg2(func: CalcFunc): void {
	switch(func) {
		default:
			console.log("Note: Arg2 Function `" + getCalcFuncName(func) + "` is not implemented yet.");
	}
}
function process_Arg1(func: CalcFunc): void {
	switch(func) {
		case CalcFunc.Addition:
			calc_Evaluate();
			current_Operator = Operator.Addition;
			next_Arg_Param();
			break;
		case CalcFunc.Subtraction:
			calc_Evaluate();
			current_Operator = Operator.Subtraction;
			next_Arg_Param();
			break;
		case CalcFunc.Multiplication:
			calc_Evaluate();
			current_Operator = Operator.Multiplication;
			next_Arg_Param();
			break;
		case CalcFunc.Division:
			calc_Evaluate();
			current_Operator = Operator.Division;
			next_Arg_Param();
			break;
		case CalcFunc.Power:
			calc_Evaluate();
			current_Operator = Operator.Power;
			next_Arg_Param();
			break;
		case CalcFunc.nPr:
			calc_Evaluate();
			current_Operator = Operator.nPr;
			next_Arg_Param();
			break;	
		case CalcFunc.nCr:
			calc_Evaluate();
			current_Operator = Operator.nCr;
			next_Arg_Param();
			break;
		default:
			console.log("Note: Arg1 Function `" + getCalcFuncName(func) + "` is not implemented yet.");
	}
}
function process_Arg0(func: CalcFunc): void {
	switch(func) {
		case CalcFunc.Addition:
			current_Operator = Operator.Addition;
			next_Arg_Param();
			break;
		case CalcFunc.Subtraction:
			current_Operator = Operator.Subtraction;
			next_Arg_Param();
			break;
		case CalcFunc.Multiplication:
			current_Operator = Operator.Multiplication;
			next_Arg_Param();
			break;
		case CalcFunc.Division:
			current_Operator = Operator.Division;
			next_Arg_Param();
			break;
		case CalcFunc.Power:
			current_Operator = Operator.Power;
			next_Arg_Param();
			break;
		case CalcFunc.nPr:
			current_Operator = Operator.nPr;
			next_Arg_Param();
			break;	
		case CalcFunc.nCr:
			current_Operator = Operator.nCr;		
			next_Arg_Param();
			break;
		default:
			console.log("Note: Arg0 Function `" + getCalcFuncName(func) + "` is not implemented yet.");
	}
}

function process_Arg(func: CalcFunc): void {
	switch (arg_Pointer) {
		case 0:
			process_Arg0(func);
			break;
		case 1:
			process_Arg1(func);
			break;
		case 2:
			process_Arg2(func);
			break;
		default:
			console.log("Cannot process arg_Pointer: " + arg_Pointer);
	}
}

function process_Input(primary: CalcFunc, secondary: CalcFunc): void {
	let func: CalcFunc = (modifier_2ND == true && secondary != CalcFunc.None) ? secondary : primary;
	outputToDisplay(String(primary) + " " + String(func));
	if (func == CalcFunc.None) {
		console.log("Error: Function is set to null");
	}
	let numpad_val: number = get_Numpad_Value(func);
	if (Number.isNaN(numpad_val) == false) {
		process_Digit(numpad_val);
		outputToDisplay(arg_Input);
		return;
	}
	console.log("Func: `" + getCalcFuncName(func) + "`");
	switch(func) {
	/* Modifier Keys */
		case CalcFunc.Shift_2nd:
			modifier_2ND = !modifier_2ND;
			return;
		case CalcFunc.Inverse:
			modifier_INV = !modifier_INV;
			return;
		case CalcFunc.Hyperbolic:
			modifier_HYP = !modifier_HYP;
			modifier_2ND = false;
			return;
	/* Control */
		case CalcFunc.None:
			console.log("Error: Function is set to null");
			break;
		case CalcFunc.On_Off:
			calc_Reset();
			break;
		case CalcFunc.Clear_Entry:
			clear_Arg_Param();
			break;
		case CalcFunc.Evalulate:
			calc_Evaluate();
			break;
		case CalcFunc.Decimal_Point:
			input_Decmial_Shift = (input_Decmial_Shift == 0) ? -1 : input_Decmial_Shift;
			break;
		case CalcFunc.Backspace:
			remove_Digit();
			break;
	/* Unary Operators */
		/* Primary */
		case CalcFunc.Negate:
			arg_Input = func_Negate(arg_Input);
			break;
		case CalcFunc.Reciprocal:
			arg_Input = func_Reciprocal(arg_Input);
			input_Decmial_Shift = 1;
			break;
		/* Powers and Roots */
		case CalcFunc.Square_Root:
			arg_Input = func_Square_Root(arg_Input);
			input_Decmial_Shift = 1;
			break;
		case CalcFunc.Square:
			arg_Input = func_Square(arg_Input);
			input_Decmial_Shift = 1;
			break;
		/* Exponents and Logarithms */
		case CalcFunc.Exponentiation:
			arg_Input = func_Exponentiation(arg_Input);
			input_Decmial_Shift = 1;
			break;
		case CalcFunc.Natural_Logarithm:
			arg_Input = func_Natural_Logarithm(arg_Input);
			input_Decmial_Shift = 1;
			break;
		case CalcFunc.Sine:
			arg_Input = func_General_Sine(arg_Input, modifier_Angle, modifier_INV, modifier_HYP, false);
			input_Decmial_Shift = 1;
			break;
		case CalcFunc.Cosine:
			arg_Input = func_General_Cosine(arg_Input, modifier_Angle, modifier_INV, modifier_HYP, false);
			input_Decmial_Shift = 1;
			break;
		case CalcFunc.Tangent:
			arg_Input = func_General_Tangent(arg_Input, modifier_Angle, modifier_INV, modifier_HYP, false);
			input_Decmial_Shift = 1;
			break;
		/* Statistics */
		case CalcFunc.Permutation:
			arg_Input = func_Permutation(arg_Input);
			input_Decmial_Shift = 1;
			break;
		case CalcFunc.Random:
			arg_Input = Math.random();
			input_Decmial_Shift = 1;
			break;
		default:
			process_Arg(func);
	}
	clear_Modifiers();
	//outputNumberToDisplay(arg_Input);
	outputToDisplay(arg_Input);
}