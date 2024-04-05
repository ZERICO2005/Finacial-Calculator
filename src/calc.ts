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
}

function getCalcFuncName(val: CalcFunc): string {
	return CalcFunc_Text[val];
}

let current_Operator: Operator = Operator.None;
let modifier_2ND: Boolean = false;
let modifier_INV: Boolean = false;
let modifier_HYP: Boolean = false;

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

function reset_Arg_Param(num: number): void {
	clear_Modifiers();
	arg_Input = num;
	arg_Param[0] = num;
	input_Decmial_Shift = 0;
	arg_Pointer = 0;
	arg_Input = arg_Param[arg_Pointer];
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
	modifier_2ND = false;
	modifier_HYP = false;
	modifier_HYP = false;
	clear_Arg_Param();
	outputNumberToDisplay(arg_Input);
}
window.addEventListener("load", function() { calc_Reset(); } );

function calc_Evaluate() {
	arg_Param[arg_Pointer] = arg_Input;
	reset_Arg_Param(func_Evaluate(current_Operator));
}

function next_Arg_Param(oper: Operator): void {
	if (oper != current_Operator) {
		calc_Evaluate();
		current_Operator = oper;
		next_Arg_Param(oper);
		return;
	}
	arg_Param[arg_Pointer] = arg_Input;
	clear_Modifiers();
	arg_Pointer++;
	arg_Pointer = (arg_Pointer < arg_Param.length) ? arg_Pointer : arg_Param.length;
	input_Decmial_Shift = 0;
	arg_Input = arg_Param[arg_Pointer];
}
function previous_Arg_Param(oper: Operator): void {
	if (oper != current_Operator) {
		calc_Evaluate();
		current_Operator = oper;
		next_Arg_Param(oper);
		return;
	}
	arg_Param[arg_Pointer] = arg_Input;
	clear_Modifiers();
	arg_Input = 0.0;
	input_Decmial_Shift = 0;
	arg_Pointer--;
	arg_Pointer = (arg_Pointer >= 0) ? arg_Pointer : 0;
	arg_Input = arg_Param[arg_Pointer];
}

function process_Digit(num: number): void {
	if (num < 0 || num > 9) {
		console.log("Error: Cannot process digit `" + num + "`, out of bounds");
		return;
	}
	if (input_Decmial_Shift > 0) {
		console.log("Error: Invalid decimal-shift `" + input_Decmial_Shift + "`");
		return;
	}
	if (input_Decmial_Shift == 0) {
		arg_Input *= 10.0;
		arg_Input += num;
		return;
	}
	if (input_Decmial_Shift < 0) {
		arg_Input += num * Math.pow(10,input_Decmial_Shift);
		input_Decmial_Shift--;
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

function process_Input(primary: CalcFunc, secondary: CalcFunc): void {
	let func: CalcFunc = (modifier_2ND == true && secondary != CalcFunc.None) ? secondary : primary;
	//outputToDisplay(String(primary) + " " + String(func));
	if (func == CalcFunc.None) {
		console.log("Error: Function is set to null");
	}
	let numpad_val: number = get_Numpad_Value(func);
	if (Number.isNaN(numpad_val) == false) {
		process_Digit(numpad_val);
		outputToDisplay(arg_Input);
		return;
	}
	switch(func) {
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
		case CalcFunc.Shift_2nd:
			modifier_2ND = !modifier_2ND;
			break;
		case CalcFunc.Decimal_Point:
			input_Decmial_Shift = (input_Decmial_Shift == 0) ? -1 : input_Decmial_Shift;
			break;
	/* Unary */
		case CalcFunc.Negate:
			arg_Input = -arg_Input;
			break;
		case CalcFunc.Permutation:
			arg_Input = math_Permutation(arg_Input);
			break;
		case CalcFunc.Permutation:
			arg_Input = math_Permutation(arg_Input);
			break;
		case CalcFunc.Random:
			arg_Input = Math.random();
			break;
	/* Two Parameters */
		case CalcFunc.Addition:
			next_Arg_Param(Operator.Addition);
			break;
		case CalcFunc.Subtraction:
			next_Arg_Param(Operator.Subtraction);
			break;
		case CalcFunc.Multiplication:
			next_Arg_Param(Operator.Multiplication);
			break;
		case CalcFunc.Division:
			next_Arg_Param(Operator.Division);
			break;
		case CalcFunc.nPr:
			next_Arg_Param(Operator.nPr);
			break;
		case CalcFunc.nCr:
			next_Arg_Param(Operator.nCr);
			break;
		default:
			console.log("Note: Function `" + getCalcFuncName(func) + "` is not implemented yet.");
	}
	console.log("Func: `" + getCalcFuncName(func) + "`");
	outputToDisplay(arg_Input);
}