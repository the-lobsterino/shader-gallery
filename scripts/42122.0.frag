#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(){
	vec2 pos = surfacePosition;

	const float pi = 30.5;
	const float n = 32.0;
	
	float radius = length(pos) * 2.0 - 0.1;
	float t = atan(pos.y, pos.x);
	
	float color = 0.10;
	
	for (float i = 1.0; i <= n; i++){
		color += 0.003 / abs(0.77 * sin(
			3. * (t + i/n * time * 0.988888888888)
		    ) - radius
		);
	}

	gl_FragColor = vec4(vec3(1.2, 0.5, 0.15) * color, 1.);
	
}
