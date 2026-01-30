#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define TWOPI 6.28318530718

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2. - vec2(1, 1);
	float th = TWOPI * fract(time / 8.);
	
	p.x *= (resolution.x / resolution.y);
	p.x += sin(th);
	float z = cos(th);
	
	vec3 intens = vec3(
		1. / (pow(length(p * 2.), 1.))
	);
	intens /= (2. + z);
	intens = intens * (2. + 0.1 * sin(fract(time / 4.) * TWOPI));
	vec3 color = intens * normalize(vec3(1, .95, .9));
	color += vec3(rand(p * time)) * 0.01;
	
	gl_FragColor = vec4(color, 1);

}