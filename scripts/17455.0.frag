#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
varying vec2 surfacePosition;

#define PI 3.14159265358979323

void main(void) {
	float radius = length(surfacePosition);
	
	vec3 color;
	
	if(radius < 1.0) {
		if(radius < 0.9) {
			float angle_secs = time * PI / 30.0;
			mat2 rot_secs = mat2(
				cos(angle_secs), -sin(angle_secs),
				sin(angle_secs), cos(angle_secs)
			);
			vec2 pointer_secs = surfacePosition * rot_secs;
			
			float angle_mins = time * PI / 1800.0;
			mat2 rot_mins = mat2(
				cos(angle_mins), -sin(angle_mins),
				sin(angle_mins), cos(angle_mins)
			);
			vec2 pointer_mins = surfacePosition * rot_mins;
			
			if(abs(pointer_secs.x) < 0.025 && -0.2 < pointer_secs.y && pointer_secs.y < 0.8) {
				color = vec3(1.0, 0.0, 0.0);
			} else if(abs(pointer_mins.x) < 0.03 && -0.2 < pointer_mins.y && pointer_mins.y < 0.5) {
				color = vec3(0.0);
			} else {
				color = vec3(1.0);
			}
		} else {
			color = vec3(0.0);
		}
	} else {
		color = mod(dot(vec2(1.0, 1.0), floor(gl_FragCoord.xy / 8.0)), 2.0) == 0.0 ? vec3(1.0) : vec3(0.9);
	}

	gl_FragColor = vec4(color, 1.0);
}