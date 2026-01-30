#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float isObscured(float dist) {
	float r = step(0.02, dist);
	r *= step(dist, 0.2);
	float density = floor(dist * 30.0) + 1.;
	float mx = mod(floor(gl_FragCoord.x), density);
	float my = mod(floor(gl_FragCoord.y), density); 
	r *= step( mx + my, 0.0 );	
	return r;
}

void main() {

	vec2 pos = vec2((mouse.x - 0.5) * (resolution.x/resolution.y), mouse.y - 0.5);
	float dist = distance(pos, surfacePosition);

	float intensity = isObscured(dist);
	
	gl_FragColor = vec4(vec3(1.0, 1.0, 0.0) * intensity, 1.0);
	
}
