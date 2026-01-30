#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float plot(vec2 coords, float y, float width) {
	return smoothstep(y-width, y, coords.y) - smoothstep(y, y+width, coords.y);
}

void drawMainAxis(in vec2 coords, inout vec3 outColor) {	
	vec3 color = vec3(0.9);
	
	float y = 0.5;
	float x = 0.65;
	
	float a1 = plot(coords.xy, y, 0.00125);
	float a2 = plot(coords.yx, x, 0.00125);
	
	outColor = mix(outColor, color, a1);
	outColor = mix(outColor, color, a2);
}

void main( void ) {
	vec2 coords = (gl_FragCoord.xy / resolution.xy);
	
	vec3 background = vec3(1.0);
	
	vec3 outColor = background;
	
	drawMainAxis(coords, outColor);

	gl_FragColor = vec4(outColor, 1.0);
}
