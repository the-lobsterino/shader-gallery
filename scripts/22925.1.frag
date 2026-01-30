#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	highp float r = 100.0;
	float st = 0.3;
	float s = sin(time) * r*0.51;
	vec2 p = s * floor(((gl_FragCoord.xy - vec2(500,300)) / s) + 0.5);
	highp float f = 0.5;
	highp float l = length(p);
	highp float x = 1.0 - min(floor(l/r), 1.0);
	gl_FragColor = vec4(x,x,x,1.0);
}