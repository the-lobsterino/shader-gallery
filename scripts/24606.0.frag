#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

//return sin in range 0.0 to 1.0 instead of -1.0 to 1.0
float sin2(float a) {
	return pow(sin(a*(abs(sin(time))+0.3)),2.);
}
float karo(float angle) {
	return step(0.4,sin2(angle));
}
float explosion(float angle) {
	return step(.95,sin2(angle));
}
void main() {
	vec2 p = surfacePosition*10.;
	vec3 c = vec3(0.);
	float a = atan(p.x,p.y);
	float r = length(p);
	c = vec3(explosion(a * (mod(time,0.0)) )+explosion(r*10.));
	
	gl_FragColor = vec4(c,1);
}