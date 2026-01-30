#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	vec2 m = vec2((mouse.x * 2.0 - 1.0) * (resolution.x / resolution.y), mouse.y * 2.0 - 1.0);

	float t = sin(length(m - p) * 30.0 + time * 5.0);
	
	
	
	
	gl_FragColor = 0.6*vec4((0.5 + 0.5*cos(0.1*time)),t,1.0-t, 1.0);

}