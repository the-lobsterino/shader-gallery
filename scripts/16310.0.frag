#ifdef GL_ES
precision mediump float;
#endif

#define NUM_ITERS 5

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 color1 = vec3(1.0,0.,0.);
const vec3 color2 = vec3(0.,0.59,0.59);
const vec3 color3 = vec3(0.62,0.92,0.);

void main( void ) {

	vec2 position = ( (gl_FragCoord.xy - resolution.xy/2.) / max(resolution.x,resolution.y));
	float r = length(position);
	float theta = atan(position.y,position.x);
	float c1 = fract(10.*r*r-fract(0.5*time));
	float c2 = fract(12.*r-fract(0.7*time)+0.1*sin(theta*10.));
	for (int i = 0; i < NUM_ITERS; i++) {
	}
	float c3 = fract(15.*r+fract(0.9*time));
	
	vec3 c = step(0.5,c1)*color1 + step(0.5,c2)*color2 + step(0.5,c3)*color3;
	
	gl_FragColor = vec4( c, 1.0 );

}