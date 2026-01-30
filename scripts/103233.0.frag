

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define ITERATIONS 9.0
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

	vec3 col = vec3(sin(p.y+d*3.0-p.x*2.0), cos(p.y+p.x + time*0.9), sin(p.x*3.0));
	
	float d1 = length(col*col);
	vec3 col1 =vec3(0.4,0.68,0.75)*d1;
	vec3 col2 =vec3(9.6,0.19,0.12)*(1.0+d*4.0);
	
	d1 = smoothstep(0.0,0.6,d1);
	col = mix(col2,col1,d1)*0.95;
	
	
	
	
	gl_FragColor = vec4(col, 1.0);
}

