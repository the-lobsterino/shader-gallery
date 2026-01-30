
// swirl-it-mother-fucker2 wakka
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define ITERATIONS 7.0
void main() {
	vec2 p = (4.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
	p-=1.0;
	float d = length(p);
	

	for(float i = 1.0; i < ITERATIONS; i+=0.5) {
		p.x += 1.0 / i * sin(time*0.2-i * p.y);
		p.y += 1.0 / i * cos(time*0.9+i * p.x*0.8);
		p*=(1.0+sin(time+2.0-d)*0.05);
		p.xy += sin(p*2.0)*0.05;

	}

	vec3 col = vec3(sin(p.y+d*5.0-p.x*2.0), cos(p.y+p.x + time*0.9), sin(p.x*3.0));
	
	float d1 = length(col*col);
	vec3 col1 =vec3(0.6,0.5,0.25)*d1;
	vec3 col2 =vec3(0.6,0.19,0.02)*(1.0+d*3.0);
	
	d1 = smoothstep(0.0,0.8,d1);
	col = mix(col2,col1,d1)*0.95;
	
	
	
	
	gl_FragColor = vec4(col, 1.0);
}

