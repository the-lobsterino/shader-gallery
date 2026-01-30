#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI atan(1.) * 4.

float rand(float n){return fract(sin(n) * 43758.5453123);}

float noise(float p){
	float fl = floor(p);
  float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy / resolution.xy);

	p.x *= resolution.x / resolution.y;
	vec2 center = vec2(0.5 * resolution.x / resolution.y, 0.5);
	vec2 dc = center - p;
	float a = atan(dc.y, dc.x) + 2. * PI;
	
	float f = 0.0;
	for(int i = 0; i < 10; i++){
	    	float r = 0.3 + noise(a * 10. * time + float(i) * 10.) * 0.1 + float(i) * 0.09;	
		float d = length(dc);
		float b = 0.002;
		float fa = pow(1. - (float(i) / 10.0), 2.);
		f += (smoothstep(r - b, r, d) - smoothstep(r, r + b, d)) * fa;
	}
	gl_FragColor = vec4(vec3(f), 1.0 );

}