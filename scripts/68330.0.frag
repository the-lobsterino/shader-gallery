#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


varying vec3 vertex;

void main() {
// Pick a coordinate to visualize in a grid
vec2 coord = vertex.xz;

// Compute anti-aliased world-space grid lines
vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
//vec2 grid = abs(fract(coord - 0.5) - 0.5) / abs(dFdx(coord)) + abs(dFdy(coord));
// vec2 grid = abs(fract(coord - 0.5) - 0.5) / abs(dFdx(coord)) + abs(dFdy(coord));
float line = min(grid.x, grid.y);

	// Just visualize the grid lines directly
	// gl_FragColor = vec4(vec3(1.0 - min(line, 1.0)), 1.0);
	gl_FragColor = vec4(vec3(1.0 - min(line, 1.0)), 0.6);
    }