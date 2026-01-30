#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float radius = 0.3;

// Anti a leasing

// Britta is not pro-anything. She is pro-anti (aleasing)

void main( void ) {

	vec2 p = gl_FragCoord.xy / resolution.xy - vec2(0.5);

	float aaThres = sin(time) * 0.0025 + 0.0025;
	
	float a = length(p);
	float c = 0.0;
	if (a < radius) c = 1.0;
	if (a >= radius && a < radius + aaThres) c = 1.0 - (a - radius) / aaThres;

	gl_FragColor = vec4(c);

}