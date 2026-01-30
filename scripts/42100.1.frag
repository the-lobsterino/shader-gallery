#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(){
	vec2 pos = surfacePosition;

	const float pi = 1.0;
	const float n = 45.0;
	
	float radius = length(pos) * 3.0 - 0.3;
	float t = (pos.y, pos.x);
	
	float color = 0.0;
	
	for (float i = 1.0; i <= n; i++){
		color += 0.003 / abs(0.77 * cos(
			3. * (t + i/n * time * 0.05)
		    ) - radius
		);
	}
	
	gl_FragColor = vec4(vec3(0.5, 1.0, 1.15) * color, 1.);
	
}
