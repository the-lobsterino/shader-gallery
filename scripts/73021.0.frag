#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 a = resolution.xy / min(resolution.x, resolution.y);
	vec2 p = gl_FragCoord.xy / resolution.xy * a;
	vec2 m = mouse * a;
	vec2 c = a * 0.01;
	
	float x = 0.0;	
	
	x += length(sin(p * 10.0)  + 1000.0 + time );
	x += length(cos(x * 3.0 + p * 10.0));
	x += length(sin(x * 3.0 + p * 20.0));
	x += length(cos(x * 3.0 + p * 40.0));
	
	x = (sin(x) + 1.0) * 0.5;
	
	gl_FragColor = vec4(vec3(x), 1.0);

}