#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
	
	float len = 1.0 - 0.4 / length(p);
	
	float d = distance(vec2( p.x * 0.5 + sin(p.y * 5.0 + time), p.y ), vec2(p.y, p.x) ) * 1.0;
	
	float add = cos(len + d - time);
	
	vec3 dest = 1.0 - vec3(sin(add + time), cos(p.x - add), sin(p.y - add * 2.0) );
		
	gl_FragColor = vec4(dest, 1.0);

}