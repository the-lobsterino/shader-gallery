#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535
float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }

void main( void ) {
	vec2 pos = (2.*gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
	pos *= 10.;
	
	vec2 interval = pos * vec2(10., 5.);
	if (mod(interval.y, 2.) < 1.) interval.y = -interval.y + 1.;
	
	vec2 fi = floor(interval);
	if (mod(fi.x, 2.) < 1.) fi.y = -fi.y + interval.y;
	else fi.y = fi.y - interval.y + 1.;

	float color = pow(sin(mod(2.*time, 2.*PI) + rand(vec2(floor(interval.x + fi.y), floor(interval.y))) * 100.), 2.);
	gl_FragColor = vec4(vec3(0., .1, .3) * color + vec3(.1, 1., .1) * (1. - color) , 1.);
}
	