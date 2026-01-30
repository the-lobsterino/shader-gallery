#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

float rand(vec2 co){
	return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main( void ) {

	float baseValue = 0.8;

	vec2 position = gl_FragCoord.xy / resolution.xy;

	if (time < 0.5) {
		gl_FragColor = vec4(rand(gl_FragCoord.xy) < 0.775 ? vec3(0.0) : vec3(0.0, baseValue, 0.0), 1.0);
		return;
	}

	vec2 pixel = 1.0 / resolution;

	float sum1 = 0.0;

	sum1 += texture2D(backbuffer, position + pixel * vec2(-1.0, -4.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 0.0, -4.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 1.0, -4.0)).g;

	sum1 += texture2D(backbuffer, position + pixel * vec2(-2.0, -3.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 2.0, -3.0)).g;

	sum1 += texture2D(backbuffer, position + pixel * vec2(-3.0, -2.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 3.0, -2.0)).g;

	sum1 += texture2D(backbuffer, position + pixel * vec2(-4.0, -1.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2(-1.0, -1.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 0.0, -1.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 1.0, -1.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 4.0, -1.0)).g;

	sum1 += texture2D(backbuffer, position + pixel * vec2(-4.0,  0.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2(-1.0,  0.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 1.0,  0.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 4.0,  0.0)).g;

	sum1 += texture2D(backbuffer, position + pixel * vec2(-4.0,  1.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2(-1.0,  1.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 0.0,  1.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 1.0,  1.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 4.0,  1.0)).g;

	sum1 += texture2D(backbuffer, position + pixel * vec2(-2.0,  3.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 2.0,  3.0)).g;

	sum1 += texture2D(backbuffer, position + pixel * vec2(-3.0,  2.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 3.0,  2.0)).g;

	sum1 += texture2D(backbuffer, position + pixel * vec2(-1.0,  4.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 0.0,  4.0)).g;
	sum1 += texture2D(backbuffer, position + pixel * vec2( 1.0,  4.0)).g;

	float sum2 = 0.0;

	sum2 += texture2D(backbuffer, position + pixel * vec2(-2.0,  -5.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2(-1.0,  -5.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 0.0,  -5.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 1.0,  -5.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 2.0,  -5.0)).g;

	sum2 += texture2D(backbuffer, position + pixel * vec2(-3.0,  -4.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 3.0,  -4.0)).g;

	sum2 += texture2D(backbuffer, position + pixel * vec2(-4.0,  -3.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2(-1.0,  -3.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 0.0,  -3.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 1.0,  -3.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 4.0,  -3.0)).g;

	sum2 += texture2D(backbuffer, position + pixel * vec2(-5.0,  -2.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2(-2.0,  -2.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 2.0,  -2.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 5.0,  -2.0)).g;

	sum2 += texture2D(backbuffer, position + pixel * vec2(-5.0,  -1.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2(-3.0,  -1.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 3.0,  -1.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 5.0,  -1.0)).g;
	
	sum2 += texture2D(backbuffer, position + pixel * vec2(-5.0,   0.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2(-3.0,   0.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 3.0,   0.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 5.0,   0.0)).g;

	sum2 += texture2D(backbuffer, position + pixel * vec2(-5.0,   1.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2(-3.0,   1.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 3.0,   1.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 5.0,   1.0)).g;

	sum2 += texture2D(backbuffer, position + pixel * vec2(-5.0,   2.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2(-2.0,   2.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 2.0,   2.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 5.0,   2.0)).g;

	sum2 += texture2D(backbuffer, position + pixel * vec2(-4.0,   3.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2(-1.0,   3.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 0.0,   3.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 1.0,   3.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 4.0,   3.0)).g;

	sum2 += texture2D(backbuffer, position + pixel * vec2(-3.0,   4.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 3.0,   4.0)).g;

	sum2 += texture2D(backbuffer, position + pixel * vec2(-2.0,   5.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2(-1.0,   5.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 0.0,   5.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 1.0,   5.0)).g;
	sum2 += texture2D(backbuffer, position + pixel * vec2( 2.0,   5.0)).g;

	vec4 current = texture2D(backbuffer, position);
	
	vec4 result = current;
	
	sum1 /= baseValue;
	sum2 /= baseValue;

	if (2.0 <= sum1 && sum1 <= 5.0) {
		result = vec4(vec3(0.0, 0.0, 0.7), 1.0);
	} else if (11.0 <= sum1 && sum1 <= 13.0) {
		result = vec4(vec3(0.2, baseValue, 1.0), 1.0);
	}
	
	if (18.0 <= sum2 && sum2 <= 25.0) {
		result = vec4(vec3(0.3, 0.0, 0.9), 1.0);
	}
	
	gl_FragColor = result;

}