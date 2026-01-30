#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float aspectWidth = resolution.x / resolution.y;

const float threshold = 2.0;

float zoom = exp2(time);
const int detail = 1000;

const vec2 offset = vec2(-1.40118, 0.0);
//const vec2 offset = vec2(0.0, 1.618 / 2.0);


#define Lerp(a, b, c) a + c * (b - a) 

void main() {
	
	vec2 c = (gl_FragCoord.xy / resolution.xy) - vec2(0.5, 0.5);
	c.x *= aspectWidth;
	c /= 0.5 * zoom;
	c += offset;
	
	vec2 z;
	
	for(int iterations = 0; iterations < detail; iterations++){
		float temp = (z.x * z.x) - (z.y * z.y) + c.x;
		z.y = 2.0 * z.x * z.y + c.y;
		z.x = temp;
		if(length(z) >= threshold) return;
	}
	
	
	
	if(length(z) < threshold) gl_FragColor = vec4(0,1,1,1); 

}