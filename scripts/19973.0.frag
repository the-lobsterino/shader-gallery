#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;
	p = floor(p*3.0*cos(time)) + fract(p*2.0);
	float l = length(p);
	float a = atan(p.y,p.x);
	float s = 0.5+ 0.5*sin(a*8.0 + time)*cos(a*2.0);
	float c = smoothstep(0.7, 0.1, l)+0.7*s;
	gl_FragColor = vec4(vec3(c), 1.0);
}