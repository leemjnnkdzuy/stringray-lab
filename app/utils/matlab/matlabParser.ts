import {ParsedStatement, WhileBlock} from "./matlabTypes";

export function parseMatlabCode(code: string): ParsedStatement[] {
	const lines = code.split("\n");
	const statements: ParsedStatement[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i].trim();

		if (!line || line.startsWith("%")) {
			i++;
			continue;
		}

		const cleanLine = line.split("%")[0].trim();
		if (!cleanLine) {
			i++;
			continue;
		}

		if (cleanLine.startsWith("while")) {
			const whileResult = parseWhileBlock(lines, i);
			statements.push(whileResult.statement);
			i = whileResult.endIndex + 1;
			continue;
		}

		const statement = parseStatement(cleanLine);
		if (statement) {
			statements.push(statement);
		}
		i++;
	}

	return statements;
}

function parseWhileBlock(
	lines: string[],
	startIndex: number
): {statement: ParsedStatement; endIndex: number} {
	const body: ParsedStatement[] = [];
	let i = startIndex + 1;
	let depth = 1;

	while (i < lines.length && depth > 0) {
		const line = lines[i].trim();
		const cleanLine = line.split("%")[0].trim();

		if (
			cleanLine.startsWith("while") ||
			cleanLine.startsWith("for") ||
			cleanLine.startsWith("if")
		) {
			depth++;
		} else if (cleanLine === "end") {
			depth--;
			if (depth === 0) break;
		}

		if (depth > 0 && cleanLine && !cleanLine.startsWith("%")) {
			const statement = parseStatement(cleanLine);
			if (statement) {
				body.push(statement);
			}
		}
		i++;
	}

	const whileBlock: WhileBlock = {
		condition: "true",
		body: body,
	};

	return {
		statement: {
			type: "while",
			data: whileBlock as unknown as Record<string, unknown>,
		},
		endIndex: i,
	};
}

function parseStatement(line: string): ParsedStatement | null {
	line = line.replace(/;$/, "").trim();

	if (line.startsWith("figure(")) {
		return parseFigureStatement(line);
	}

	if (line.startsWith("axes(")) {
		return parseAxesStatement(line);
	}

	if (line.startsWith("axis(") || line.startsWith("axis ")) {
		return parseAxisStatement(line);
	}

	if (line.includes("= scatter(")) {
		return parseScatterAssignment(line);
	}

	if (line.startsWith("drawnow")) {
		return {type: "drawnow", data: {}};
	}

	if (/^\w+\.\w+\s*=/.test(line)) {
		return parsePropertySet(line);
	}

	if (line.includes("=") && !line.includes("==")) {
		return parseAssignment(line);
	}

	return null;
}

function parseFigureStatement(line: string): ParsedStatement {
	const data: Record<string, unknown> = {
		position: [300, 50, 900, 900],
		color: "k",
	};

	const posMatch = line.match(/'Position'\s*,\s*\[([^\]]+)\]/);
	if (posMatch) {
		data.position = posMatch[1].split(",").map((s) => parseFloat(s.trim()));
	}

	const colorMatch = line.match(/'Color'\s*,\s*'([^']+)'/);
	if (colorMatch) {
		data.color = colorMatch[1];
	}

	return {type: "figure", data};
}

function parseAxesStatement(line: string): ParsedStatement {
	const data: Record<string, unknown> = {
		position: [0, 0, 1, 1],
		color: "k",
		nextPlot: "add",
	};

	const posMatch = line.match(/'Position'\s*,\s*\[([^\]]+)\]/);
	if (posMatch) {
		data.position = posMatch[1].split(",").map((s) => parseFloat(s.trim()));
	}

	const colorMatch = line.match(/'Color'\s*,\s*'([^']+)'/);
	if (colorMatch) {
		data.color = colorMatch[1];
	}

	return {type: "axes", data};
}

function parseAxisStatement(line: string): ParsedStatement {
	const data: Record<string, unknown> = {
		range: [0, 400, 0, 400],
		off: false,
	};

	const rangeMatch = line.match(/\[([^\]]+)\]/);
	if (rangeMatch) {
		data.range = rangeMatch[1].split(",").map((s) => parseFloat(s.trim()));
	}

	if (line.includes("off")) {
		data.off = true;
	}

	return {type: "axis", data};
}

function parseScatterAssignment(line: string): ParsedStatement {
	const parts = line.split("=");
	const varName = parts[0].trim();
	const scatterPart = parts[1].trim();

	const data: Record<string, unknown> = {
		handle: varName,
		xData: [],
		yData: [],
		size: 2,
		color: "w",
		filled: false,
		markerEdgeColor: "none",
		markerFaceAlpha: 0.6,
	};

	const argsMatch = scatterPart.match(/scatter\(([^)]*)\)/);
	if (argsMatch) {
		const args = argsMatch[1];
		if (args.includes("'filled'")) {
			data.filled = true;
		}
		const sizeMatch = args.match(/,\s*(\d+)\s*,/);
		if (sizeMatch) {
			data.size = parseInt(sizeMatch[1]);
		}
	}

	const edgeMatch = line.match(/'MarkerEdgeColor'\s*,\s*'([^']+)'/);
	if (edgeMatch) {
		data.markerEdgeColor = edgeMatch[1];
	}

	const alphaMatch = line.match(/'MarkerFaceAlpha'\s*,\s*([\d.]+)/);
	if (alphaMatch) {
		data.markerFaceAlpha = parseFloat(alphaMatch[1]);
	}

	return {type: "scatter", data};
}

function parseAssignment(line: string): ParsedStatement {
	const parts = line.split("=");
	const varName = parts[0].trim();
	const expression = parts.slice(1).join("=").trim();

	return {
		type: "assignment",
		data: {
			variable: varName,
			expression: expression,
		},
	};
}

function parsePropertySet(line: string): ParsedStatement {
	const match = line.match(/^(\w+)\.(\w+)\s*=\s*(.+)$/);
	if (match) {
		return {
			type: "property_set",
			data: {
				object: match[1],
				property: match[2],
				expression: match[3],
			},
		};
	}
	return {type: "property_set", data: {}};
}
