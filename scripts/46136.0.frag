// http://glslsandbox.com/e#43760.1

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
//uniform vec2 resolution;

float box(vec2 _st, vec2 _size){
	_size = vec2(0.5) - _size * 0.5;  // Adjust size.
	vec2 uv = step(_size, _st);
	uv *= step(_size, vec2(1.0) - _st);
	return uv.x * uv.y;
}

void main( void ) {
	vec2 resolution = vec2(960, 540);
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

	vec2 scaledUv = uv * 10.0;
	vec2 repeatedUv = fract(scaledUv);

	gl_FragColor = vec4(vec3(box(repeatedUv, vec2(0.4 * sin((time + length(uv)) * 10.0)))), 1.0);
}