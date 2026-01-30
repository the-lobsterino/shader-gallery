#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dist(vec2 x, vec2 y){
	vec2 z = x - y;
	return dot(z, z);					
}

void main( void ) {

	vec2 p0 = vec2(0.5, 0.5);
	vec2 pos = (gl_FragCoord.xy / resolution.xy);
	float d0 = dist(pos, mouse + p0 * sin(time));
	float d1 = dist(pos, mouse);
	
	float e0 = exp (-10000.0 * d0 * d1);
	float e1 = exp (-10000.0 * d1 * d0);
	
	vec4 c0 = vec4(e0, e0, e0, 0.25);
	vec4 c1 = vec4(e1, e1, e1, 0.25);
	
	gl_FragColor = c0 + c1;

}