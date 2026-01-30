#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#
# 
#
#

#define PI 3.14159265359
#define TAU 6.28318530718
#define EPS 0.00001

#define SIDES 128.0

vec2 rotate(vec2 vec, float angle)
{
	return mat2(cos(angle), sin(angle), -sin(angle), cos(angle)) * vec;	
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	p.x /= resolution.y / resolution.x;
	vec2 uv = p;
	
	float angle = floor(16.0/(atan(p.x*p.y*tan(-sin(time)*1.2)) + PI - EPS) / TAU * SIDES) / SIDES * TAU*sin(time*0.15) ;
	float color = 0.0;
	p = rotate(p, (PI / SIDES * (SIDES)) * angle );
	color = sin(p.x*16.0-time);
	vec3 c2 = vec3( color, color * 0.95, sin( color + time / 3.0 ) * .5 );
	
	 
	 
	 
	gl_FragColor = vec4(mix(c2, c2,0.5*sin(time)),1.0);
	
	

}