export interface MatlabVariable {
	name: string;
	value: number | number[] | string;
}

export interface MatlabContext {
	variables: Map<string, number | number[]>;
	figure: {
		width: number;
		height: number;
		backgroundColor: string;
		position: [number, number, number, number];
	};
	axes: {
		xRange: [number, number];
		yRange: [number, number];
		showAxis: boolean;
	};
	scatterHandles: Map<string, ScatterHandle>;
	time: number;
	isRunning: boolean;
	animationId: number | null;
}

export interface ScatterHandle {
	xData: number[];
	yData: number[];
	size: number;
	color: string | number[];
	markerEdgeColor: string;
	markerFaceAlpha: number;
	filled: boolean;
}

export interface ParsedStatement {
	type:
		| "figure"
		| "axes"
		| "axis"
		| "assignment"
		| "scatter"
		| "while"
		| "property_set"
		| "drawnow"
		| "comment"
		| "function_call";
	data: Record<string, unknown>;
}

export interface WhileBlock {
	condition: string;
	body: ParsedStatement[];
}
