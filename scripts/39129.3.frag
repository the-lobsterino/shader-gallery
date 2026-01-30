#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_ITER 1000

float aspectRatio = resolution.x / resolution.y;

vec2 centerPos = vec2(0.5 * aspectRatio, 0.5);
vec2 focusPos = vec2(-1.4485, 0.0);
//vec2 focusPos = vec2(0.0, 0.0);
//float zoom = pow(2.0, mod(time, 5.0) * 5.0);
float zoom = pow(2.0, (mouse.x - 0.1) * 15.0);

vec3 getColorInPosition(vec2 pos) {
	vec2 mbPos = (pos - centerPos) * (1.0 / zoom) + focusPos;
	
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

	vec2 position = ( gl_FragCoord.xy / resolution.yy );

	vec3 color = getColorInPosition(position);

	gl_FragColor = vec4(color, 1.0);
}