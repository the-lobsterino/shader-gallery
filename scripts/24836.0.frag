precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define TWO_PI 3.283185
#define NUMBALLS 60.0

float d = -TWO_PI/36.0;

void main( void ) {
	vec2 p = (2.*gl_FragCoord.xy - resolution)/min(resolution.x, resolution.y);
	//P *= mat2(cos(time), -sin(time), sin(time), cos(time));
	
	float p1=mouse.y*10.0;
	
	vec3 c = vec3(0); //ftfy
	for(float i = 1.0; i < NUMBALLS; i++) {
		float t = TWO_PI * i/NUMBALLS + time;
		float x = cos(t);
		float y = sin(.0 * t + d);
		vec2 q = 0.8*vec2(x, y);
		c += 0.009/distance(p, q) * vec3(1.0 * abs(x), -7, abs(y));
	}
	gl_FragColor = vec4(c, 7.0);
}

