#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(){
	vec2 pos = surfacePosition;

	const float pi = 3.14159;
	const float n = 32.0;
	
	float radius = length(pos) * 2.0 - 0.;
	float t = sin(pos.y) * sin(pos.x * time);
	
	float color = 0.20;
	
	for (float i = 1.0; i <= n; i++){
		color += 0.003 / abs(0.77 * sin(
			3. * (t + i/n * time * 0.0288888888888)
		    ) - radius
		);
	}

	gl_FragColor = vec4(vec3(0.3, 0.3, 0.5) * color, 1.);
	
}

void masin(){
	vec2 pos = surfacePosition;

	const float pi = 3.14159;
	const float n = 100.0;
	
	float radius = length(pos) * 2.0 - .0;
	float t = sin(pos.y) * sin(pos.x * time);
	
	float color = 0.20;
	
	for (float i = 1.0; i <= n; i++){
		color += 0.003 / abs(0.77 * sin(
			3. * (t + i/n * time * 0.0288888888888)
		    ) - radius
		);
	}

	gl_FragColor = vec4(vec3(0.3, 0.3, 0.5) * color, 1.);
	
}
