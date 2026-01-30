#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(){
	vec2 pos = surfacePosition;

	const float pi = 3.14159;
	const float n = 10.0;
	
	float radius = length(pos) * 1.0 - 0.;
	float t = sin(pos.x) * cos(pos.x * time / 60.0);
	
	float color = 0.00;
	
	for (float i = 1.0; i <= n; i++){
		color += 0.03 / abs(0.77 * sin(
			3. * (t + i/n * time * 2.0)
		    ) - radius
		);
	}

	
	radius = length(pos) * 2.0 - .0;
	t = sin(pos.y) * sin(pos.x * time);
	
	
	for (float i = 1.0; i <= n; i++){
		color += 0.0027 / abs(0.27 * sin(
			3. * (t + i/n * time * 0.0)
		    ) - radius
		);
	}

	gl_FragColor = vec4(vec3(0.3, 0.3, 0.5) * color, 0.0);
	
}
