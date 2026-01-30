#ifdef GL_ES
precision mediump float;
#endif

/*

Number of still dots, times ten, equals refresh rate in hertz.

Do the dots move slowly? Clockwise means subtract a few Hz, CCW means add.  

*/

#define HERTZ_PER_DOT 10.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float tao = 2.*3.1415926535897932384626433;
uniform sampler2D lastFrame;

void main( void ) {
	vec2 uv;
	vec2 mousePos;
	vec4 outColor;
	
	uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
	uv.y *= resolution.y / resolution.x;
	
	float ph = time*HERTZ_PER_DOT*tao;
	mousePos = vec2(sin(ph), cos(ph))/4.;
	//mousePos.y *= resolution.y / resolution.x;
	
	outColor = vec4(1.0, 1.0, 1.0, 1.0);
	outColor *= 0.05 / distance(uv, mousePos);
	
	gl_FragColor = mix(outColor, texture2D(lastFrame, gl_FragCoord.xy / resolution.xy),  0.98);
}