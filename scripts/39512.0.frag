#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
varying vec2 surfacePosition;

void main(){
	vec2 p = surfacePosition;

	const float pi = 3.14159;
	const float n = 16.0;
	
	float radius =  abs(max(max(abs(p.x*.866 - p.y*.5), abs(-p.x*.866 - p.y*.5)), abs(p.y)) * length(p)*6.0 -.5)-0.3;
	float t = atan(p.y, p.x)/pi * (2. + ceil (4. * cos (time)));
	
	float color = 0.0;
	for (float i = 0.0; i < n; i++){
		color += 0.004/abs(0.2*sin(6.0*pi*(t + i/n * time * 0.52)) - radius);
	}
	
	gl_FragColor = vec4(vec3(0.2 * tan (time * 3.3) + 0.5 , 0.2 * tan (time * 3.3) + 0.5 , 0.3) * color, color);
	
}