#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define PI 3.14

float x2(float x) {
	return x*x;
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy);
	
	p.x -= 0.5;
	
	//float sx = (0.25 * sin(20.0 * p.x - time));
	float sx = 3.0 * x2(p.x) + 0.3;
	
	float dy = 1.0/(10.0 * abs(p.y - sx));
	
	gl_FragColor = vec4(vec3(dy) , 1.0);

}