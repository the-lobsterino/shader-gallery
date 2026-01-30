#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define fractal_details 10
#define randomness_details 5
#define zoomout 1.0

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(13, 5))) * 43758.5453);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y)*0.25;
}

float fbm(vec2 n) {
	float total = 0.0, amplitude = 1.0;
	for (int i = 0; i < randomness_details; i++) {
		total += noise(n) * amplitude;
		n += n;
		amplitude *= 0.5;
	}
	return total*2.0;
}
vec2 rot(vec2 p, float angle) {
	return vec2(p.x+cos(angle),p.y+sin(angle));
}
void main( void ) {

	vec2 p = surfacePosition*zoomout;//*sin(time*0.5)*10.5;
	vec3 c = vec3(0);
	vec2 fractal;
	float deepfade = 1.0;
	for (int i=-0; i<fractal_details; i++) 
	{
		float rnd = fbm(p*10.0+time);
		//deepfade -= float(i)/float(fractal_details);
		deepfade *= 0.5;
		fractal = abs(p)/dot(p,p)-1.0+sin(time*0.5)*0.5;
		vec2 pdiff = fractal-p;
		float ddiff = abs(length(pdiff));
		//c.rg += fractal*deepfade;
		c.rg += pdiff*deepfade;
		c.b += ddiff*deepfade;
		p = fractal;
	}
	gl_FragColor = vec4(c, 1.0); 
	

}