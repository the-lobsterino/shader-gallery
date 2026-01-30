#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define t time
#define r resolution

void main( void ) {
	
	vec3 color = vec3(0.6, abs(sin(t)), abs(cos(0.5)));
	
	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
	
	float l = ceil(sin(length(p) * 7.0 + t*2.0));
	
	
	vec3 destColor = vec3(l) * color;


	gl_FragColor = vec4(vec3(destColor), 1.0 );

}