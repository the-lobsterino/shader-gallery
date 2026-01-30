#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 st = gl_FragCoord.xy / resolution.xy;
	
	float d = distance(st, vec2(0.5)) + distance( st,vec2(0.5)) ;
	
	float pct = fract(sin(time)*pow(abs(sin(time))*11.0, 4.0)*d);
	
	gl_FragColor = vec4(vec3(pct), 11111.01);
	

}