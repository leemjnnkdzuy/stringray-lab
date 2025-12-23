import {MatlabContext, ParsedStatement, WhileBlock} from "./matlabTypes";
import {parseMatlabCode} from "./matlabParser";
import * as math from "mathjs";

export function createMatlabContext(): MatlabContext {
	return {
		variables: new Map(),
		figure: {
			width: 900,
			height: 900,
			backgroundColor: "#000000",
			position: [0, 0, 900, 900],
		},
		axes: {
			xRange: [0, 400],
			yRange: [0, 400],
			showAxis: true,
		},
		scatterHandles: new Map(),
		time: 0,
		isRunning: false,
		animationId: null,
	};
}

export class MatlabRenderer {
	private ctx: CanvasRenderingContext2D;
	private matlabCtx: MatlabContext;
	private canvas: HTMLCanvasElement;
	private statements: ParsedStatement[] = [];
	private loopStatements: ParsedStatement[] = [];
	private mathParser = math.parser();

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.matlabCtx = createMatlabContext();
	}

	public stop(): void {
		this.matlabCtx.isRunning = false;
		if (this.matlabCtx.animationId) {
			cancelAnimationFrame(this.matlabCtx.animationId);
			this.matlabCtx.animationId = null;
		}
	}

	public execute(code: string): void {
		this.stop();
		this.matlabCtx = createMatlabContext();
		this.mathParser = math.parser();
		this.statements = parseMatlabCode(code);

		for (const stmt of this.statements) {
			if (stmt.type === "while") {
				const whileBlock = stmt.data as unknown as WhileBlock;
				this.loopStatements = whileBlock.body;
				this.matlabCtx.isRunning = true;
				this.startAnimationLoop();
				return;
			}
			this.executeStatement(stmt);
		}
	}

	private startAnimationLoop(): void {
		const loop = () => {
			if (!this.matlabCtx.isRunning) return;

			for (const stmt of this.loopStatements) {
				this.executeStatement(stmt);
			}

			this.matlabCtx.animationId = requestAnimationFrame(loop);
		};

		this.matlabCtx.animationId = requestAnimationFrame(loop);
	}

	private executeStatement(stmt: ParsedStatement): void {
		switch (stmt.type) {
			case "figure":
				this.handleFigure(stmt.data);
				break;
			case "axes":
				this.handleAxes(stmt.data);
				break;
			case "axis":
				this.handleAxis(stmt.data);
				break;
			case "assignment":
				this.handleAssignment(stmt.data);
				break;
			case "scatter":
				this.handleScatter(stmt.data);
				break;
			case "property_set":
				this.handlePropertySet(stmt.data);
				break;
			case "drawnow":
				this.render();
				break;
		}
	}

	private handleFigure(data: Record<string, unknown>): void {
		const color = data.color as string;
		this.matlabCtx.figure.backgroundColor = this.matlabColorToHex(color);
		this.canvas.style.backgroundColor =
			this.matlabCtx.figure.backgroundColor;
	}

	private handleAxes(data: Record<string, unknown>): void {
		const color = data.color as string;
		if (color) {
			this.matlabCtx.figure.backgroundColor =
				this.matlabColorToHex(color);
		}
	}

	private handleAxis(data: Record<string, unknown>): void {
		const range = data.range as number[];
		if (range && range.length === 4) {
			this.matlabCtx.axes.xRange = [range[0], range[1]];
			this.matlabCtx.axes.yRange = [range[2], range[3]];
		}
		if (data.off) {
			this.matlabCtx.axes.showAxis = false;
		}
	}

	private handleAssignment(data: Record<string, unknown>): void {
		const varName = data.variable as string;
		const expression = data.expression as string;
		const value = this.evaluateExpression(expression);
		this.matlabCtx.variables.set(varName, value);
		this.setMathVariable(varName, value);
	}

	private handleScatter(data: Record<string, unknown>): void {
		const handle = data.handle as string;
		this.matlabCtx.scatterHandles.set(handle, {
			xData: [],
			yData: [],
			size: (data.size as number) || 2,
			color: (data.color as string) || "w",
			markerEdgeColor: (data.markerEdgeColor as string) || "none",
			markerFaceAlpha: (data.markerFaceAlpha as number) || 1,
			filled: (data.filled as boolean) || false,
		});
	}

	private handlePropertySet(data: Record<string, unknown>): void {
		const obj = data.object as string;
		const prop = data.property as string;
		const expression = data.expression as string;

		const handle = this.matlabCtx.scatterHandles.get(obj);
		if (handle) {
			const value = this.getVariableOrEvaluate(expression.trim());
			if (prop === "XData") {
				handle.xData = this.toArray(value);
			} else if (prop === "YData") {
				handle.yData = this.toArray(value);
			} else if (prop === "CData") {
				handle.color = this.toArray(value);
			}
		}
	}

	private getVariableOrEvaluate(expr: string): number | number[] {
		if (this.matlabCtx.variables.has(expr)) {
			return this.matlabCtx.variables.get(expr) as number | number[];
		}
		return this.evaluateExpression(expr);
	}

	private setMathVariable(name: string, value: number | number[]): void {
		try {
			this.mathParser.set(name, value);
		} catch {}
	}

	private toArray(value: number | number[]): number[] {
		if (Array.isArray(value)) return value;
		if (value && typeof value === "object" && "toArray" in value) {
			return (value as {toArray: () => number[]}).toArray();
		}
		return [value as number];
	}

	private evaluateExpression(expr: string): number | number[] {
		expr = expr.trim();

		if (this.matlabCtx.variables.has(expr)) {
			return this.matlabCtx.variables.get(expr) as number | number[];
		}

		if (expr.match(/^[\d.]+$/)) {
			return parseFloat(expr);
		}

		if (expr.match(/^[\d.]+e[+-]?\d+$/i)) {
			return parseFloat(expr);
		}

		const rangeMatch = expr.match(/^(\d+):(\w+)$/);
		if (rangeMatch) {
			const start = parseInt(rangeMatch[1]);
			const endVar = rangeMatch[2];
			const end =
				(this.matlabCtx.variables.get(endVar) as number) ||
				parseInt(endVar) ||
				10000;
			return this.createRange(start, end);
		}

		const simpleRangeMatch = expr.match(/^(\d+):(\d+)$/);
		if (simpleRangeMatch) {
			return this.createRange(
				parseInt(simpleRangeMatch[1]),
				parseInt(simpleRangeMatch[2])
			);
		}

		return this.evaluateMathExpression(expr);
	}

	private createRange(start: number, end: number): number[] {
		const arr: number[] = [];
		for (let j = start; j <= end; j++) {
			arr.push(j);
		}
		return arr;
	}

	private evaluateMathExpression(expr: string): number | number[] {
		try {
			let matlabExpr = this.convertMatlabToMathjs(expr);
			const result = this.mathParser.evaluate(matlabExpr);

			if (typeof result === "number") {
				return result;
			}
			if (Array.isArray(result)) {
				return result as number[];
			}
			if (result && typeof result === "object") {
				if (
					"toArray" in result &&
					typeof result.toArray === "function"
				) {
					const arr = result.toArray();
					if (
						Array.isArray(arr) &&
						arr.length > 0 &&
						Array.isArray(arr[0])
					) {
						return arr.flat();
					}
					return arr as number[];
				}
				if (
					"valueOf" in result &&
					typeof result.valueOf === "function"
				) {
					return result.valueOf() as number;
				}
			}
			return 0;
		} catch {
			return this.fallbackEvaluate(expr);
		}
	}

	private convertMatlabToMathjs(expr: string): string {
		expr = expr.replace(/\.'/g, "'");
		expr = expr.replace(/\.\*/g, " .* ");
		expr = expr.replace(/\.\//g, " ./ ");
		expr = expr.replace(/\.\^/g, " .^ ");
		expr = expr.replace(/\*(?!\s*\.)/g, " * ");
		expr = expr.replace(/\/(?!\s*\.)/g, " / ");

		return expr;
	}

	private fallbackEvaluate(expr: string): number | number[] {
		const vars = Object.fromEntries(this.matlabCtx.variables);

		if (
			expr.includes("sin(") ||
			expr.includes("cos(") ||
			expr.includes("sqrt(")
		) {
			return this.evaluateArrayExpression(expr, vars);
		}

		try {
			let jsExpr = expr
				.replace(/\bpi\b/g, Math.PI.toString())
				.replace(/\.([*/^])/g, "$1");

			for (const [key, val] of Object.entries(vars)) {
				if (typeof val === "number") {
					jsExpr = jsExpr.replace(
						new RegExp(`\\b${key}\\b`, "g"),
						val.toString()
					);
				}
			}

			const result = Function(`"use strict"; return (${jsExpr})`)();
			if (typeof result === "number" && !isNaN(result)) {
				return result;
			}
		} catch {}

		return 0;
	}

	private evaluateArrayExpression(
		expr: string,
		vars: Record<string, number | number[]>
	): number | number[] {
		let arrayVar: number[] | null = null;
		let arrayVarName = "";

		for (const [key, val] of Object.entries(vars)) {
			if (Array.isArray(val) && val.length > 0) {
				if (expr.includes(key)) {
					arrayVar = val;
					arrayVarName = key;
					break;
				}
			}
		}

		if (!arrayVar) {
			return 0;
		}

		const t = (vars["t"] as number) || 0;

		return arrayVar.map((v, idx) => {
			try {
				let localExpr = expr
					.replace(/\bpi\b/g, Math.PI.toString())
					.replace(/\bt\b/g, t.toString())
					.replace(/\.([*/^])/g, "$1");

				localExpr = localExpr.replace(
					new RegExp(`\\b${arrayVarName}\\b`, "g"),
					v.toString()
				);
				localExpr = localExpr.replace(
					new RegExp(`\\b${arrayVarName}'\\b`, "g"),
					v.toString()
				);

				for (const [key, val] of Object.entries(vars)) {
					if (key !== arrayVarName && Array.isArray(val)) {
						localExpr = localExpr.replace(
							new RegExp(`\\b${key}\\b`, "g"),
							val[idx]?.toString() || "0"
						);
					} else if (typeof val === "number") {
						localExpr = localExpr.replace(
							new RegExp(`\\b${key}\\b`, "g"),
							val.toString()
						);
					}
				}

				localExpr = localExpr
					.replace(/\bsqrt\(/g, "Math.sqrt(")
					.replace(/\bsin\(/g, "Math.sin(")
					.replace(/\bcos\(/g, "Math.cos(")
					.replace(/\btan\(/g, "Math.tan(")
					.replace(/\babs\(/g, "Math.abs(")
					.replace(/\bexp\(/g, "Math.exp(")
					.replace(/\blog\(/g, "Math.log(")
					.replace(/\bfloor\(/g, "Math.floor(")
					.replace(/\bceil\(/g, "Math.ceil(")
					.replace(/\bround\(/g, "Math.round(");

				const result = Function(
					`"use strict"; return (${localExpr})`
				)();
				return typeof result === "number" && !isNaN(result)
					? result
					: 0;
			} catch {
				return 0;
			}
		});
	}

	private matlabColorToHex(color: string): string {
		const colorMap: Record<string, string> = {
			k: "#000000",
			w: "#ffffff",
			r: "#ff0000",
			g: "#00ff00",
			b: "#0000ff",
			y: "#ffff00",
			c: "#00ffff",
			m: "#ff00ff",
		};
		return colorMap[color] || color;
	}

	private render(): void {
		const {xRange, yRange} = this.matlabCtx.axes;
		const scaleX = this.canvas.width / (xRange[1] - xRange[0]);
		const scaleY = this.canvas.height / (yRange[1] - yRange[0]);

		this.ctx.fillStyle = this.matlabCtx.figure.backgroundColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		for (const [, handle] of this.matlabCtx.scatterHandles) {
			const {xData, yData, size, color, markerFaceAlpha} = handle;

			for (let idx = 0; idx < xData.length; idx++) {
				const px = (xData[idx] - xRange[0]) * scaleX;
				const py =
					this.canvas.height - (yData[idx] - yRange[0]) * scaleY;

				if (isNaN(px) || isNaN(py)) continue;

				let fillColor: string;
				if (Array.isArray(color)) {
					const colorValue = color[idx] || 0;
					const hue = colorValue * 360;
					fillColor = `hsla(${hue}, 100%, 70%, ${markerFaceAlpha})`;
				} else {
					const hexColor = this.matlabColorToHex(color);
					fillColor = hexColor;
				}

				this.ctx.beginPath();
				this.ctx.arc(px, py, size, 0, Math.PI * 2);
				this.ctx.fillStyle = fillColor;
				this.ctx.globalAlpha = markerFaceAlpha;
				this.ctx.fill();
			}
		}
		this.ctx.globalAlpha = 1;
	}
}
