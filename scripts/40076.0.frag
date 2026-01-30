#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	//around 50 looks a bit similiar to broken tv
	float speed = 1.0;
	vec2 pos = (gl_FragCoord.xy / resolution.xy);
	vec3 color = vec3(0.5);
	
	color -= abs(sin(pos.y * 100.0 + time * 5.0 * speed)) * 0.08;
	color -= abs(sin(pos.y * 300.0 - time * 0.5 * speed)) * 0.05;
	
	gl_FragColor = vec4(vec3(1.0 - color), 1.0);
}