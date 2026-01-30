#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 col;


void main() {
	const float PI = 3.1415926535;
	vec2 uv = (gl_FragCoord.xy*2.-resolution.xy)/resolution.y; 
	
	float w = sin((uv.y * uv.x - time * 1.0 + sin(1.5 * uv.x + 3.0 * uv.y) * PI * .3) * PI * 0.6);
	 
		
	col = vec3(17.0 / 255.0, 128.0 / 255.0, 1.0);
	
	col += w * .3;
	 
	gl_FragColor = vec4(col, 1.0);
}