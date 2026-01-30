#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(16.9898, 4.1414))) * 43758.5453);
}

void main( void ) {
	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	uv.y = -uv.y;
	uv.y += rand(uv) * 0.05;
	vec3 c = vec3(uv.y, 0.1, 0.2);
	gl_FragColor = vec4(c, 1.0);

}