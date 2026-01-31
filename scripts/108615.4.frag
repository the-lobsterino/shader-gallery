#ifdef GL_ES
precision mediump float;
#endif
// mods by dist

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 uPos = ( gl_FragCoord.xy / resolution.xy );//normalize wrt y axis
	uPos.x -=0.5;

	vec3 color1 = vec3(0.0941, 0.1176, 0.1765); // 151B2E in RGB
	vec3 color2 = vec3(0.122, 0.153, 0.251); // 202B40 in RGB

	float gradient = smoothstep(0.0, 0.5, uPos.y); // create a smooth gradient from 0.0 to 0.5
	vec3 color = mix(color1, color2, gradient); // interpolate between color1 and color2

	gl_FragColor = vec4(color, 1.0);
}
