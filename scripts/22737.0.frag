#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.x) - vec2(0.5, 0.5 * resolution.y / resolution.x);

	float a = atan(p.y, p.x) + sin(0.1*time) * 4.0;
	float r = length(p)+a;

	float cr = (sin(a * 8.0) + sin(r * 64.0) + sin(a * 7.0 + r * 16.0 + 4.0*time)) + 0.5;
	float cg = abs(sin(a * 7.0) + sin(r * 64.0) + sin(a * 18.0 + r * 36.0 + 3.0*time));
	float cb = (sin(a * 6.0) + sin(r * 64.0) + sin(a * 9.0 + r * 116.0 + 2.0*time));
// Ok, something is wrong with the saving.
// sometimes I press save and nothing happens, unless I remove small parts of code
	// right now the second gl_FragColor won't work, but maybe not on your computer.
	// What is this?
	
	gl_FragColor = vec4(cr*0.1, cr*cg*0.2, cr*cg+cb, 1.0);
}