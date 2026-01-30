#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define RADIUS 140.0

void main( void ) {
	vec2 fragCoord = gl_FragCoord.xy;
	fragCoord += vec2(0, sin(fragCoord.x * 0.037 + time * 4.0) * 30.0);
	
	vec3 circle = vec3(floor(distance(resolution / 2.0 / RADIUS, fragCoord.xy / RADIUS)));
	
	vec3 steps = vec3(sin(max(gl_FragCoord.w, gl_FragCoord.z)));
	
	gl_FragColor = vec4(mix(circle, steps, 1.07), 1.0);
}