/*
**	Author: zerico2005 (2024)
**	Project: Finacial-Calculator
**	License: MIT License
**	A copy of the MIT License should be included with
**	this project. If not, see https://opensource.org/license/MIT
*/

const enum Operator {
	None,
	/* Primary */
	Addition,
	Subtraction,
	Multiplication,
	Division,
	Negate,
	Sign,
	Absolute_Value,
	Reciprocal,
	/* Powers and Roots */
	Power,
	Power_Root,
	Square_Root,
	Cube_Root,
	Square,
	Cube,
	/* Exponents and Logarithms */
	Exponentiation,
	Natural_Logarithm,
	Base_Logarithm,
	Logarithm_Base2,
	Logarithm_Base10,
	/* Trigonometry */
	Sine,
	Cosine,
	Tangent,
	ArcTangent2,
	/* Integers */
	Floor,
	Ceiling,
	Round,
	/* Statistics */
	Permutation,
	nPr,
	nCr,
	Random,
}

function set_Error(str: any): void {
	error_Flag = "Error: " + String(str);
}

/* Primary */
	function func_Addition(x: number, y: number): number {
		return x + y;
	}

	function func_Subtraction(x: number, y: number): number {
		return x - y;
	}

	function func_Multiplication(x: number, y: number): number {
		return x * y;
	}

	function func_Division(dividend: number, divisor: number): number {
		if (divisor == 0.0) {
			set_Error("Division by 0");
		}
		return dividend / divisor;
	}
	function func_Negate(x: number) {
		return -x;
	}
	function func_Sign(x: number) {
		return Math.sign(x);
	}
	function func_Absolute_Value(x: number) {
		return Math.abs(x);
	}
	function func_Reciprocal(x: number): number {
		if (x == 0.0) {
			set_Error("Division by 0");
		}
		return 1.0 / x;
	}

/* Powers and Roots */
	function func_Power(x: number, y: number): number {
		return Math.pow(x, y);
	}
	function func_Power_Root(x: number, y: number): number {
		return Math.pow(x, 1.0 / y);
	}
	function func_Square_Root(x: number): number {
		if (x < 0.0) {
			set_Error("Negative Square Root");
		}
		return Math.sqrt(x);
	}
	function func_Cube_Root(x: number): number {
		return Math.cbrt(x);
	}
	function func_Square(x: number): number {
		return x * x;
	}
	function func_Cube(x: number): number {
		return x * x * x;
	}

/* Exponents and Logarithms */
	function func_Exponentiation(x: number): number {
		return Math.exp(x);
	}
	function func_Natural_Logarithm(x: number): number {
		if (x <= 0.0) {
			set_Error("Non-positve logarithm");
		}
		return Math.log(x);
	}
	function func_Base_Logarithm(x: number, b: number): number {
		if (x <= 0.0 || b <= 0.0) {
			set_Error("Non-positve logarithm");
		}
		return Math.log(x) / Math.log(b);
	}
	function func_Logarithm_Base2(x: number): number {
		if (x <= 0.0) {
			set_Error("Non-positve logarithm");
		}
		return Math.log2(x);
	}
	function func_Logarithm_Base10(x: number): number {
		if (x <= 0.0) {
			set_Error("Non-positve logarithm");
		}
		return Math.log10(x);
	}

/* Trigonometry */
	const enum Angle_Format {
		Radians,
		Turns,
		Degrees,
		ArcMinute,
		ArcSecond,
		Gradians,
	}
	function convert_From_Radians(theta: number, angle_format: Angle_Format): number {
		const TAU: number = (2.0 * Math.PI);
		switch (angle_format) {
			case Angle_Format.Turns:
				return theta / TAU;
			case Angle_Format.Degrees:
				return theta * (360.0 / TAU);
			case Angle_Format.ArcMinute:
				return theta * (21600.0 / TAU);
			case Angle_Format.ArcSecond:
				return theta * (1296000.0 / TAU);
			case Angle_Format.Gradians:
				return theta * (400.0 / TAU);
			case Angle_Format.Radians:
			default:
				return theta;
		}
	}
	function convert_To_Radians(theta: number, angle_format: Angle_Format): number {
		const TAU: number = (2.0 * Math.PI);
		switch (angle_format) {
			case Angle_Format.Turns:
				return theta * TAU;
			case Angle_Format.Degrees:
				return theta * (TAU / 360.0);
			case Angle_Format.ArcMinute:
				return theta * (TAU / 21600.0);
			case Angle_Format.ArcSecond:
				return theta * (TAU / 1296000.0);
			case Angle_Format.Gradians:
				return theta * (TAU / 400.0);
			case Angle_Format.Radians:
			default:
				return theta;
		}
	}


	const enum Trigonometry_Shift {
		None = 0,
		Inverse = (1 << 0),
		Hyperbolic = (1 << 1),
		Reciprocal = (1 << 2)
	}
	const enum Trigonometry_Operation {
		None = Trigonometry_Shift.None,
		Inverse = Trigonometry_Shift.Inverse,
		Hyperbolic = Trigonometry_Shift.Hyperbolic,
		Inverse_Hyperbolic = Trigonometry_Shift.Inverse | Trigonometry_Shift.Hyperbolic,
		Reciprocal = Trigonometry_Shift.Reciprocal,
		Inverse_Reciprocal = Trigonometry_Shift.Inverse | Trigonometry_Shift.Reciprocal,
		Hyperbolic_Reciprocal = Trigonometry_Shift.Hyperbolic | Trigonometry_Shift.Reciprocal,
		Inverse_Hyperbolic_Reciprocal = Trigonometry_Shift.Inverse | Trigonometry_Shift.Hyperbolic | Trigonometry_Shift.Reciprocal
	}
	function get_Trigonometry_Operation(inverse: boolean, hyperbolic: boolean, reciprocal: boolean): Trigonometry_Operation {
		let trig_oper: Trigonometry_Operation = Trigonometry_Operation.None;
		trig_oper |= inverse ? Trigonometry_Shift.Inverse : Trigonometry_Shift.None;
		trig_oper |= hyperbolic ? Trigonometry_Shift.Hyperbolic : Trigonometry_Shift.None;
		trig_oper |= reciprocal ? Trigonometry_Shift.Reciprocal : Trigonometry_Shift.None;
		return trig_oper;
	}

	function func_General_Sine(theta: number, angle_format: Angle_Format,
		inverse: boolean, hyperbolic: boolean, reciprocal: boolean, 
	): number {
		let trig_oper: Trigonometry_Operation = get_Trigonometry_Operation(inverse, hyperbolic, reciprocal);
		switch (trig_oper) {
			default:
			case Trigonometry_Operation.None:
				return Math.sin(convert_To_Radians(theta, angle_format));
			case Trigonometry_Operation.Inverse:
				return convert_From_Radians(Math.asin(theta), angle_format);
			case Trigonometry_Operation.Hyperbolic:
				return Math.sinh(theta);
			case Trigonometry_Operation.Inverse_Hyperbolic:
				return Math.asinh(theta);
			case Trigonometry_Operation.Reciprocal:
				return 1.0 / Math.sin(convert_To_Radians(theta, angle_format));
			case Trigonometry_Operation.Inverse_Reciprocal:
				return convert_From_Radians(Math.asin(1.0 / theta), angle_format);
			case Trigonometry_Operation.Hyperbolic_Reciprocal:
				return 1.0 / Math.sinh(theta);
			case Trigonometry_Operation.Inverse_Hyperbolic_Reciprocal:
				return Math.asinh(1.0 / theta);
		}
	}
	function func_General_Cosine(theta: number, angle_format: Angle_Format,
		inverse: boolean, hyperbolic: boolean, reciprocal: boolean, 
	): number {
		theta = convert_To_Radians(theta, angle_format);
		let trig_oper: Trigonometry_Operation = get_Trigonometry_Operation(inverse, hyperbolic, reciprocal);
		switch (trig_oper) {
			default:
			case Trigonometry_Operation.None:
				return Math.cos(convert_To_Radians(theta, angle_format));
			case Trigonometry_Operation.Inverse:
				return convert_From_Radians(Math.acos(theta), angle_format);
			case Trigonometry_Operation.Hyperbolic:
				return Math.cosh(theta);
			case Trigonometry_Operation.Inverse_Hyperbolic:
				return Math.acosh(theta);
			case Trigonometry_Operation.Reciprocal:
				return 1.0 / Math.cos(convert_To_Radians(theta, angle_format));
			case Trigonometry_Operation.Inverse_Reciprocal:
				return convert_From_Radians(Math.acos(1.0 / theta), angle_format);
			case Trigonometry_Operation.Hyperbolic_Reciprocal:
				return 1.0 / Math.cosh(theta);
			case Trigonometry_Operation.Inverse_Hyperbolic_Reciprocal:
				return Math.acosh(1.0 / theta);
		}
	}
	function func_General_Tangent(theta: number, angle_format: Angle_Format,
		inverse: boolean, hyperbolic: boolean, reciprocal: boolean, 
	): number {
		theta = convert_To_Radians(theta, angle_format);
		let trig_oper: Trigonometry_Operation = get_Trigonometry_Operation(inverse, hyperbolic, reciprocal);
		switch (trig_oper) {
			default:
			case Trigonometry_Operation.None:
				return Math.tan(convert_To_Radians(theta, angle_format));
			case Trigonometry_Operation.Inverse:
				return convert_From_Radians(Math.atan(theta), angle_format);
			case Trigonometry_Operation.Hyperbolic:
				return Math.tanh(theta);
			case Trigonometry_Operation.Inverse_Hyperbolic:
				return Math.atanh(theta);
			case Trigonometry_Operation.Reciprocal:
				return 1.0 / Math.tan(convert_To_Radians(theta, angle_format));
			case Trigonometry_Operation.Inverse_Reciprocal:
				return convert_From_Radians(Math.atan(1.0 / theta), angle_format);
			case Trigonometry_Operation.Hyperbolic_Reciprocal:
				return 1.0 / Math.tanh(theta);
			case Trigonometry_Operation.Inverse_Hyperbolic_Reciprocal:
				return Math.atanh(1.0 / theta);
		}
	}
	function func_General_ArcTangent2(y: number, x: number, angle_format: Angle_Format, reciprocal: boolean) {
		return (reciprocal) ? convert_From_Radians(Math.atan2(y,x), angle_format) : convert_From_Radians((Math.PI / 2.0) - Math.atan2(y,x), angle_format);
	}

/* Integers */
	function func_Floor(x: number): number {
		return Math.floor(x);
	}
	function func_Ceiling(x: number): number {
		return Math.ceil(x);
	}
	function func_Round(x: number): number {
		return Math.round(x);
	}

/* Statistics */
	// At some point I will add options to compute x! instead of just n!
	function func_Permutation(num: number): number {
		if (Number.isInteger(num) == false) {
			set_Error("Not an integer");
			return NaN;
		}
		if (num < 0) {
			set_Error("Negative value");
			return NaN;
		}
		let result = 1;
		for (let n: number = 2; n <= num; n++) {
			result *= n;
		}
		return result;
	}

	function func_nPr(n: number, r: number): number {
		if (Number.isInteger(n) == false || Number.isInteger(r) == false) {
			set_Error("Not an integer");
			return NaN;
		}
		if (n < 0 || r < 0) {
			set_Error("Negative value");
			return NaN;
		}
		if (r > n) {
			return 0;
		}
		return func_Permutation(n) / func_Permutation(n - r);
	}
	function func_nCr(n: number, r: number): number {
		if (Number.isInteger(n) == false || Number.isInteger(r) == false) {
			set_Error("Not an integer");
			return NaN;
		}
		if (n < 0 || r < 0) {
			set_Error("Negative value");
			return NaN;
		}
		if (r > n) {
			return 0;
		}
		return func_Permutation(n) / (func_Permutation(n - r) * func_Permutation(r));
	}
	function func_Random(): number {
		return Math.random();
	}

/* Evaluate */

	function func_Evaluate(func: Operator): number {
		switch (func) {
			case Operator.None:
				return arg_Param[arg_Pointer];
			/* Primary */
			case Operator.Addition:
				return func_Addition(arg_Param[0], arg_Param[1]);
			case Operator.Subtraction:
				return func_Subtraction(arg_Param[0], arg_Param[1]);
			case Operator.Multiplication:
				return func_Multiplication(arg_Param[0], arg_Param[1]);
			case Operator.Division:
				return func_Division(arg_Param[0], arg_Param[1]);
			case Operator.Negate:
				return func_Negate(arg_Param[0]);
			case Operator.Sign:
				return func_Sign(arg_Param[0]);
			case Operator.Absolute_Value:
				return func_Absolute_Value(arg_Param[0]);
			case Operator.Reciprocal:
				return func_Reciprocal(arg_Param[0]);
			/* Powers and Roots */
			case Operator.Power:
				return func_Power(arg_Param[0], arg_Param[1]);
			case Operator.Power_Root:
				return func_Power_Root(arg_Param[0], arg_Param[1]);
			case Operator.Square_Root:
				return func_Square(arg_Param[0]);
			case Operator.Cube_Root:
				return func_Cube_Root(arg_Param[0]);
			case Operator.Square:
				return func_Square(arg_Param[0]);
			case Operator.Cube:
				return func_Cube(arg_Param[0]);
			/* Exponents and Logarithms */
			case Operator.Exponentiation:
				return func_Exponentiation(arg_Param[0]);
			case Operator.Natural_Logarithm:
				return func_Natural_Logarithm(arg_Param[0]);
			case Operator.Base_Logarithm:
				return func_Base_Logarithm(arg_Param[0], arg_Param[1]);
			case Operator.Logarithm_Base2:
				return func_Logarithm_Base2(arg_Param[0]);
			case Operator.Logarithm_Base10:
				return func_Logarithm_Base10(arg_Param[0]);
			/* Trigonometry */
			case Operator.Sine:
				return func_General_Sine(arg_Param[0], modifier_Angle, modifier_INV, modifier_HYP, false);
			case Operator.Cosine:
				return func_General_Cosine(arg_Param[0], modifier_Angle, modifier_INV, modifier_HYP, false);
			case Operator.Tangent:
				return func_General_Tangent(arg_Param[0], modifier_Angle, modifier_INV, modifier_HYP, false);
			case Operator.ArcTangent2:
				return func_General_ArcTangent2(arg_Param[0], arg_Param[1], modifier_Angle, false);
			/* Integers */
			case Operator.Floor:
				return func_Floor(arg_Param[0]);
			case Operator.Ceiling:
				return func_Ceiling(arg_Param[0]);
			case Operator.Round:
				return func_Round(arg_Param[0]);
			/* Statistics */
			case Operator.Permutation:
				return func_Permutation(arg_Param[0]);
			case Operator.nPr:
				return func_nPr(arg_Param[0], arg_Param[1]);
			case Operator.nCr:
				return func_nCr(arg_Param[0], arg_Param[1]);
			case Operator.Random:
				return func_Random();
			default:
				console.log("Error: Unknown function");
				return arg_Param[arg_Pointer];
		}
	}