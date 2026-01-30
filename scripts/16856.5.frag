#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int NUM_BALLS = 5;

vec2 pixelToCoord(vec2 pixel) {
	return pixel/resolution.xy;
}

vec2 rectCoordToSquareCoord(vec2 coord) {
	float aspect = resolution.x / resolution.y;
	if (resolution.x < resolution.y) {
		return vec2(coord.x * aspect, coord.y);
	}
	else {
		return vec2(coord.x, coord.y / aspect);
	}
}

vec2 squareCoordToRectCoord(vec2 coord) {
	float aspect = resolution.x / resolution.y;
	if (resolution.x < resolution.y) {
		return vec2(coord.x / aspect, coord.y);
	}
	else {
		return vec2(coord.x, coord.y * aspect);
	}
}

vec4 ball(vec2 position) {
	vec2 coord = rectCoordToSquareCoord(pixelToCoord(gl_FragCoord.xy));
	vec2 sqPosition = rectCoordToSquareCoord(position);
	return vec4(pow(1.0 - length(sqPosition - coord), 10.0));
}

void main( void ) {
	float total = 0.0;
	vec2 screenExtents = rectCoordToSquareCoord(vec2(1.0, 1.0));
	float minScreenDim = min(screenExtents.x, screenExtents.y);
	vec2 radius = squareCoordToRectCoord(vec2(minScreenDim))/2.0 - 0.1;
	for (int i = 0; i < NUM_BALLS; i++) {
		vec2 ballPosition = vec2(sin(time * float(i+1) * 0.51) * radius.x + 0.5,
			     cos(time * float(i+1) * 0.5) * radius.y + 0.5);
		total += ball(ballPosition);
	}
	
	gl_FragColor = vec4(step(0.9, total));
}