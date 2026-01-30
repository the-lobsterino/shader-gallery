#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float ratio = resolution.x/resolution.y;

//return sin in range 0.0 to 1.0 instead of -1.0 to 1.0
float sin2(float a) {
	return pow(sin(a*.5),2.);
}
float karo(float angle) {
	return step(.2,sin2(angle));
}
float explosion(float angle) {
	return step(.75+sin(time)*0.15,sin2(angle));
}
void main() {
	vec2 p = surfacePosition*10.0;
	float c = 0.;
	float a = atan(p.x,p.y);
	float r = length(p);
	c = explosion(a*(10.)*1.5+time*1.);
	
	vec2 pp = vec2(0.,0.); pp.x *= ratio;
	float dist = distance( pp, surfacePosition );
	float heat = (.1/ dist);

        float tmp = pow(heat,3.)*c+heat;
	tmp = min(max(tmp, 0.0), 1.0);
	vec3 cc = vec3(tmp);
	gl_FragColor = vec4(cc,1)+vec4(0.2,0.4,0.7,1.0);
}