#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec3 Color = vec3(sin(time), 0.3, 0.9);
	float col = -0.2;
	vec2 a = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution, resolution.y);
	col += 0.41 / abs(length(a + vec2( sin(time), sin(time)*cos(time))) - 0.01);
	gl_FragColor = vec4(vec3(Color * col), 1.0);
}