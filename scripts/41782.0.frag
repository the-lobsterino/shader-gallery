#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 q = gl_FragCoord.xy / resolution.xy;
	vec2 uv = -1.0 + 2.0 * q;
	uv.x *= resolution.x / resolution.y;
	
	vec3 colour = vec3(uv.xy, 1.0);
	
	float threshold = fract(time) * 12.0;
	
	if (uv.x > threshold) {
		colour = vec3(0.0);
	}
	
	gl_FragColor = vec4(colour, 1.0);

}