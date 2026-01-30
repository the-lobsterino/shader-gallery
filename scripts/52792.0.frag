#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float layers = 25.0;

const vec2 s = vec2(15.0, 15.0);

const float m = 8.0;
const float a = 3.13;
const float b = 1.9;
const float c = 5.0;

float f(float x) {
	float y = 0.0;
	for (float n = 1.0; n <= m; n += 1.0) {
		y += pow(n, -a) * sin(pow(n, b) * x - n * n * c);
	}
	return y;
}

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	uv -= vec2(0.5);
	uv *= s;

	float r = 0.3;
	float g = 0.4;
	float b = 0.8;
	
	//vec3 c = vec3(1.);
	vec3 c = vec3(r, g, b);
	
	for (float j = 0.0; j < layers; j += 1.0) {
		float i = layers - j - 1.0;
		if (uv.y - mouse.y * 0.2 * (layers - i) - 1.0 / layers * (i - layers / 2.0) * 5.0 < f(1.0 * uv.x - mouse.x * .8 * (layers - i) - pow(i, 1.49))) {
			
			c =  vec3(r / layers * i, g / layers * i, b / layers * i);
			//c =  vec3(r - 1.0 / layers * i, g - 1.0 / layers * i, b - 1.0 / layers * i);
		}
		
	
	}
	
	gl_FragColor = vec4(c, 1.0 );

}