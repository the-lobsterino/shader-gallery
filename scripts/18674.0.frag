#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

void main(void) {
	float color = 0.0;
	
	float dist = length(surfacePosition)/0.20;
	if(dist > 0.3 && dist < 0.5) {
		float rot = time * 6.0;
		vec2 position = surfacePosition * mat2(cos(rot), sin(rot), -sin(rot), cos(rot));
		
		float angle = atan(position.y, position.x)*sin(time*0.25);
		color = (2.0 - abs(angle) * 2.0) * (1.0 - abs(0.4 - dist) * 10.0);
	}

	gl_FragColor = vec4(color * vec3(1.0, 0.5, 0.0), 1.0);	
}

