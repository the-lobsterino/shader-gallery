#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 st = gl_FragCoord.xy / resolution.xy;
	
	float y = step(0.5, st.x);
	vec3 color = vec3(1.0 - y);


	gl_FragColor = vec4(vec3(y), 1.0 );

}