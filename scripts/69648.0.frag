// Practice 1: The Drive Home
// Coded by etoal83,
// Start: 2020-11-25 
// Finished: 2020-11-30

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 Rain(vec2 uv, float t) {
	
	// Cell setup
	vec2 aspect = vec2(2.0, 1.0);
	vec2 cell = uv * aspect;
	
	vec2 id = floor(cell);
	cell.y += t * 0.3;
	cell.y += fract(sin(id.x * 76.23) * 8402.);
	id = floor(cell);
	cell = fract(cell) - 0.5;
	
	// Main drop
	t += fract(-sin(id.x * 76.23 + id.y * 1756.) * 8531.) * 6.283;
	
	float y = -sin(t + sin(t + sin(t) * 0.5)) * 0.4;
	float x = (fract(sin(id.x * 1234. + id.y * 567.) * 8901.) - 0.5) * 0.5;
	vec2 mainDropPosition = vec2(x, y);
	
	vec2 mainDropOffset = (cell - mainDropPosition) / aspect;
	float cellDistance = length(mainDropOffset);
	float m1 = smoothstep(0.06, 0.005, cellDistance);
	
	// Trailing drop
	vec2 trailingDropOffset = (fract(uv * aspect.x * vec2(1.0, 2.0)) - 0.5 - x)/vec2(1.0, 2.0);
	cellDistance = length(trailingDropOffset);
	float m2 = smoothstep(0.2 * (0.5 - cell.y), 0.0, cellDistance) * smoothstep(-0.1, 0.1, cell.y - mainDropPosition.y);
	
	// if(cell.x > 0.48 || cell.y > 0.49) m1 = 1.0;
	return vec2(m1 * mainDropOffset * 30.0 + m2 * trailingDropOffset * 10.0);
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv += 0.5 + vec2(mouse.x * 0.3, mouse.y * 0.1);
	uv.x *= resolution.x / resolution.y;
	
	vec3 cameraPosition = vec3(-0.5, 0.2, 0.0);
	vec3 lookatPosition = vec3(-0.5, 0.2, 1.0);
	float t = time * 0.7;
		
	// Rain distortion
	vec2 rainDistortion = Rain(uv * 5.0, t)*0.5 + Rain(uv * 7.0, t * 0.7)*0.5;
	uv.x += sin(uv.y * 50.7) * 0.003;
	uv.y += sin(uv.x * 43.3) * 0.003;

	
	vec3 color = vec3(Rain(uv*3.5, t), 0.);
	
	gl_FragColor = vec4( color, 1.0 );

}