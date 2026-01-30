#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float quantize(float x, float s) {
	return floor(x * s) / (s - 1.0);
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	
	vec3 c;
	//c += quantize(uv.x, 300.0) > mod(quantize(time, 200.0), 1.0) ? 1.0 : 0.0;
	
	c += step(distance(quantize(uv.x, 300.0), mod(quantize(time, 200.0), 1.0)), 0.001);
	//c += quantize(uv.x, 300.0) - mod(quantize(time, 200.0), 1.0) > 0.1 ? 1.0 : 0.0;
	gl_FragColor = vec4( c, 1.0 );

}