#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITER 1000

//
// Click "Hide code" and use left/right mouse buttons to pan/zoom.
//

vec3 getColorInPosition(vec2 pos) {
	vec2 mbPos = pos * 2.5 + vec2(-0.8, 0.0);
	
	int j = 0;
	
	vec2 z = mbPos;
	vec2 c = z;
	
	// (a+bi)(a+bi) = a*a + 2abi - b^2
	for(int i = 0; i < MAX_ITER; i++) {
		if(i == MAX_ITER - 1) {
			j = 0;
			break;
		}
		
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
		
		if(length(z) > 4.0) {
			break;
		}
		
		j = i;
	}
	
	float v = float(j) / float(MAX_ITER) * (1.0 + mod(time, 10.0) * 15.0);
	
	return vec3(sin(v), sin(v * 1.333), sin(v * 1.777));
}

void main( void ) {

	vec3 color = getColorInPosition(surfacePosition);

	gl_FragColor = vec4(color, 1.0);
}