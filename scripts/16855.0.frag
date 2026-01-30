#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159
#define radius 20.0
#define inlineFactor 1.1
#define rowFactor 1.2

float circle(vec2 pos) {
	return 1.0 - pow(min(1.0, distance(gl_FragCoord.xy, resolution / 2.0 + pos) / (radius)), 20.0);
}

void main( void ) {
	
	vec3 circles = vec3(0);
	
	for (float i = 3.0; i < 100.0; i+=1.0) {
		
		float t = pow(inlineFactor * 4.0 * PI * i, .5);
		
		circles += circle(
			vec2(
				t * sin(t+time*i*0.0205),
				t * cos(t+time*i*0.02)
			) / PI * radius * rowFactor
		);
	}
	
	gl_FragColor = vec4(vec3(circles), 1.0);
}