/*
**	Author: zerico2005 (2024)
**	Project: Finacial-Calculator
**	License: MIT License
**	A copy of the MIT License should be included with
**	this project. If not, see https://opensource.org/license/MIT
*/

const enum Operator {
	None,
	Addition,
	Subtraction,
	Multiplication,
	Division,
	nPr,
	nCr,
}

function set_Error(str: any): void {
	error_Flag = "Error: " + String(str);
}

/* Right Column */
	/* Primary */
	function func_Addition(): number {
		return arg_Param[0] + arg_Param[1];
	}

	function func_Subtraction(): number {
		return arg_Param[0] - arg_Param[1];
	}

	function func_Multiplication(): number {
		return arg_Param[0] * arg_Param[1];
	}

	function func_Division(): number {
		if (arg_Param[1] == 0.0) {
			set_Error("Division by 0");
		}
		return arg_Param[0] / arg_Param[1];
	}
	/* Secondary */
	// At some point I will add options to compute x! instead of just n!
	function math_Permutation(val: number): number {
		if (Number.isInteger(val) == false) {
			set_Error("Not an integer");
			return NaN;
		}
		if (val < 0) {
			set_Error("Negative value");
			return NaN;
		}
		let result = 1;
		for (let n: number = 2; n <= val; n++) {
			result *= n;
		}
		return result;
	}

	function func_nPr(): number {
		if (Number.isInteger(arg_Param[0]) == false || Number.isInteger(arg_Param[1]) == false) {
			set_Error("Not an integer");
			return NaN;
		}
		if (arg_Param[0] < 0 || arg_Param[1] < 0) {
			set_Error("Negative value");
			return NaN;
		}
		if (arg_Param[1] > arg_Param[0]) {
			return 0;
		}
		return math_Permutation(arg_Param[0]) / math_Permutation(arg_Param[0] - arg_Param[1])
	}
	function func_nCr(): number {
		if (Number.isInteger(arg_Param[0]) == false || Number.isInteger(arg_Param[1]) == false) {
			set_Error("Not an integer");
			return NaN;
		}
		if (arg_Param[0] < 0 || arg_Param[1] < 0) {
			set_Error("Negative value");
			return NaN;
		}
		if (arg_Param[1] > arg_Param[0]) {
			return 0;
		}
		return math_Permutation(arg_Param[0]) / (math_Permutation(arg_Param[0] - arg_Param[1]) * math_Permutation(arg_Param[1]));
	}

/* Evaluate */

	function func_Evaluate(func: Operator): number {
		switch (func) {
			case Operator.None:
				return arg_Param[arg_Pointer];
			case Operator.Addition:
				return func_Addition();
			case Operator.Subtraction:
				return func_Subtraction();
			case Operator.Multiplication:
				return func_Multiplication();
			case Operator.Division:
				return func_Division();
			case Operator.nPr:
				return func_nPr();
			case Operator.nCr:
				return func_nCr();
			default:
				console.log("Error: Unknown function");
				return arg_Param[arg_Pointer];
		}
	}