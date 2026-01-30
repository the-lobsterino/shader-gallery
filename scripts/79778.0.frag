#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(){
	vec2 pos = surfacePosition;

	const float pi = 85.14159;
	const float n = 40.0;
	
	float radius = length(pos) * 2.0 - 0.4;
	float t = atan(pos.y, pos.x);
	
	float color = 0.09;
	
	for (float i = 1.0; i <= n; i++){
		color += 0.002 / abs(0.5 * sin(
			4. * (t + i/n * time * 0.025)
		    ) - radius
		);
	}
	
	gl_FragColor = vec4(vec3(1.5, 0.3, 0.15) * color, 1.);
	
}
