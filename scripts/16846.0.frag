#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define fractal_details 50
#define randomness_details 5
#define zoomout 10.0
//(sin(time*1.3)*5.0+5.1)
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
vec2 rot(vec2 center, float radius, float angle) {
	return vec2(center.x+cos(angle),center.y+sin(angle)) * radius;
}
void main( void ) {

	vec2 p = surfacePosition*zoomout;
	vec2 p2 = p;
	vec3 c = vec3(0);
	vec2 fractal,fractal2;
	float deepfade = 1.0;
	for (int i=-0; i<fractal_details; i++) 
	{
		float rnd = fbm(p*10.0+time);
		//deepfade -= float(i)/float(fractal_details);
		deepfade *= 0.9;//+sin(time*5.0)*0.45;
		fractal = abs(p)/dot(p,p)-1.0+sin(time*0.15)*0.5;//+sin(time*0.5)*1.5;
		fractal2 = (p2)/dot(p2,p2)+rot(vec2(0),0.08,time*2.0);//+sin(time*0.5)*1.5;

		//c.rg += fractal*deepfade;
		//c.rg += (fractal-p)*deepfade;
		//c.b += length(fractal-p)*deepfade;

		//c.rg += fractal2*deepfade;
		c.rg += (fractal2-p2)*deepfade;
		c.b += length(fractal2-p2)*deepfade;
		
		p = fractal;
		p2 = fractal2;
	}
	gl_FragColor = vec4(c, 1.0); 
	

}