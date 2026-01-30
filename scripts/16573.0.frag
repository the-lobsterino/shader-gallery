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
	
	float sx = 3.0 * x2(p.x) + 0.3;
	float dy = smoothstep(0.8 + sin(2.0*time)*0.1,1.05,1.0 - (abs(p.y - sx) * 2.0));
	
	gl_FragColor = vec4(vec3(dy) , 1.0);

}