#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float quantize(float x, float n) {
	return float(int(x*n))/n;
}

void main( void ) {
	vec2 position = (gl_FragCoord.xy/resolution.xy);



	float height = 0.1;
	float starty = 0.1;
	float fac = 0.0;
	for (int i = 0; i < 10; ++i) {
		float x = quantize(sin(float(i) * time + position.x * 6.14159 * 6.0) * 0.5 + 0.5, float(i) + 2.0);
		if (position.y > starty * float(i) + x * height) {
			fac += 0.1;
		}
	}
	
	
	
	gl_FragColor.rgb = vec3(0.0, 0.2, 1.0) * mix(0.4, 1.0, fac);
}