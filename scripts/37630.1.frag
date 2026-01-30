#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359
#define SEGMENTS 10

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float scale = min(resolution.x, resolution.y);
	vec2 pos = gl_FragCoord.xy / scale;
	vec2 center = (resolution.xy/2.) / scale;
	
	vec2 dir = pos - center;
	
	float angle = atan(dir.y, dir.x) + time*0.4;
	
	if (mod(length(dir), 0.2) < 0.1) {
		angle += cos(sin(time));	
	}
	
	if (mod(angle, PI/float(SEGMENTS)) < PI/float(SEGMENTS*2)) {
		gl_FragColor = vec4(0);
	} else {
		gl_FragColor = vec4(distance(pos, center)) * vec4(sin(time*0.7)*0.5 + 0.5, sin(time*0.3)*0.5 + 0.5, sin(time*0.5)*0.5 + 0.5, 1);
	}
	
	
}