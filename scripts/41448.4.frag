#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	
	vec3 v = vec3(1,0,0);
	vec3 d = vec3(1);

	vec2 p =gl_FragCoord.xy / resolution.xy;
		
	vec3 col = vec3(abs((p.y-0.5)*-2.));
	vec3 invrt = 1.0 - col;
	gl_FragColor = vec4(invrt,1.);

}