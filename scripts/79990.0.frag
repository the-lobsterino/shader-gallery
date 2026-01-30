#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(){
	vec2 pos = surfacePosition;

	const float pi = 3.14159;
	const float n = 1.0;
	
	float radius = length(pos) + 2.0 - 0.4;
	float t = atan(pos.y, pos.x);
	
	float color = 0.025;
	
	for (float i = 0.99; i <= n; i++){
		color += 1.22 / abs(1.2 * sin(
		2. * (t / i*time / n * 1.25)
		    ) - color
		);
	}
	
	gl_FragColor = vec4(vec3(1.5, 0.3, 0.15) * color, 0.8);
	
}
