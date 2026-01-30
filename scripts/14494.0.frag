
precision mediump float;

uniform float time;
varying vec2 surfacePosition;

void main(void) {
	
	float intensity = 1.0; // Lower number = more 'glow'
	vec2 offset = vec2(0, 0); // x / y offset
	vec3 light_color = vec3(tan(time), cos(-time), sin(-time + time)); // RGB, proportional values, higher increases intensity
	float master_scale = 0.0003; // Change the size of the effect
	float fac = min(1.2, max(0.8, abs(sin(time*8.0))));
	vec2 sp = surfacePosition*fac;
	float c = acos(abs(tan(.01/(sp.x*sp.x + sp.y*sp.y)*100.0-time*10.0)));
	fac = max(0.0, pow(length(sp)*2.0+.1, 2.0)+0.1);
	
	gl_FragColor = vec4(vec3(min(c, 1.0))*light_color*fac, 1.0);
}