#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(){
	
	
	
	vec2 pos = gl_FragCoord.xy/resolution;
	pos = pos*2.-1.0;

	const float pi = 3.14159;
	
	float radius = length(pos) * 1.0;
	float t = atan(pos.y, pos.x);
	
	float color = ceil( 
		0.5 
		- radius
		);
	
	
	gl_FragColor = vec4(vec3(0.9, 0.9, 0.9) * color, 1.0);
	
}
