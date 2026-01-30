#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


const float PI = 3.14159265358979323846264;
//return range 0.0 to 1.0 instead of -PI to +PI
float atan2(float x, float y) {
	return (atan(x,y)+PI)/PI/2.;
}
float rand(vec2 n) { 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}
float fbm(vec2 n) {
	float total = 0.0, amplitude = 1.0;
	for (int i = 0; i < 3; i++) {
		total += noise(n) * amplitude;
		n += n;
		amplitude *= 0.5;
	}
	return total * 0.5;
}
vec2 pow2(vec2 b, float e) { return vec2(pow(b.x,e),pow(b.y,e)); }
float pow20(float b) { return pow(b,20.); }
vec2 pow20(vec2 b) { return pow2(b,20.); }
void main() {
	vec2 p = surfacePosition*3.;
	vec3 c = vec3(0.);
	float t = time*.1;
	
	vec2 dsv = mod(p,1.)-.5;
	float ds = length(dsv)-.1;
	
	float dp = length(mod(t+p-normalize(dsv)*.1,.1)-.05)-0.02;
	
	float d = 1e5;
	d = min(d,ds);
	d = min(d,dp);
	
	if ( d < 1e-3)	c.r = 1.;
	if (mod(t+p-normalize(dsv)*.1,.1).y > .05) c.g = 1.;
	if (mod(t+p-normalize(dsv)*.1,.1).x > .05) c.b = 1.;
	
	gl_FragColor = vec4(c,1);
}