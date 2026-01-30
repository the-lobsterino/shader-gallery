
precision mediump float;

uniform float time;
varying vec2 surfacePosition;

void main(void) {
	
	float intensity = 1.0; // Lower number = more 'glow'
	vec2 offset = vec2(100, 0); // x / y offset
	float master_scale = 0.0003; // Change the size of the effect
	float fac = min(1.2, max(0.8, abs(sin(time*8.0))));
	vec2 sp = surfacePosition*fac;
	float len = length(sp);
	float c = acos(abs(tan(.01/(sp.x*sp.x + sp.y*sp.y)*100.0-time*10.0)));
	fac = max(0.0, pow(len*2.0+.1, 2.0)+0.1);
	vec3 color = vec3(abs(sin(time-len)), abs(cos(time+len)), len);
	
	gl_FragColor = vec4(vec3(min(c, 1.0))*color*fac*2.5*len, 1.0);
}