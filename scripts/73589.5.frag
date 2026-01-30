#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y );
	vec3 col = vec3(0.2);
	vec2 tuv = uv;
	uv *= 0.5;
	float jitter = abs(sin(4.0 * sin(time * 29.0))) * 0.005;
	col += vec3( (1.0 + jitter) - pow(dot(uv, uv), 0.05)) * vec3(1,2,4) * 5.0;
	gl_FragColor = vec4(col, 1.0);

}