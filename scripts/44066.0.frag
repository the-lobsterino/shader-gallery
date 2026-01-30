#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// thingy
// kebugcheckex 12-7-2017

uniform float time;
uniform vec2 mouse;
float col;


void main( void ) {

	vec2 pos = gl_FragCoord.xy + mouse.xy;
	float d = dot(pos, vec2(cos(pos.x / time * mouse.x), cos(pos.y / time * mouse.y)));
	col = atan(d);
	gl_FragColor = vec4(sin(col*time*mouse.x), cos(col*time*mouse.y), tan(col*time/mouse.y), 1.0);
}