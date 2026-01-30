
// swirl-it-mother-fucker2 SNOTTY III
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define ITERATIONS 3.0

mat2 rotate(float a)
{
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}
void main() {
	vec2 p = (3.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
	vec2 tt = vec2(fract(time*0.23)*2.0,fract(time*0.1)*2.0);
	tt.x += sin(p.y+time*2.3+length(p))*0.1;
 	vec2 pp = mod(floor(p+tt),2.0);
	
	p-=1.0;
	p.x-= sin(time);
	p.y-= cos(time);
	p*=rotate(time*0.2);
	float d = length(p);
	p.x += sin(p.y*2.25+time*0.45)*0.45;
	p *= rotate(sin(p.y*3.0)*0.1);
	p *= rotate(sin(p.x*2.0)*0.2);

	

	for(float i = 1.0; i < ITERATIONS; i+=0.5) {
		p*=rotate(sin((p.x+p.y)*0.05));
		p.x += 1.0 / i * sin(time*0.2-i * p.y);
		p.y += 1.0 / i * cos(time*0.9+i * p.x*0.8);
	}

	vec3 col = vec3(sin(p.y+d*5.0-p.x*2.0), cos(p.y+p.x + time*0.9), sin(p.x*3.0));
	
	float vv = sin(time*0.5+p.y*p.x)*0.1;
	
	float d1 = length(col*col);
	vec3 col1 =vec3(0.45,0.6,0.4)*d1;
	vec3 col2 =vec3(0.9,0.95,0.4)*(d+1.0);
	
	d1 = clamp(d1*d1,0.0,1.0);
	col = mix(col2,col1,d1)*(0.7+vv);
	
	vv = length(col);
	vv = smoothstep(0.0,1.0,vv);
	col = mix(vec3(0.9,0.3,0.3),col, vv);
	
	float m = sin(p.y*0.4*length(col));
	m = smoothstep(-1.,1.0,m);
	col *= m;
	
	
    	vec3 grid = vec3(mod(pp.x + pp.y, 2.0) < 1.0 ? 1.0 : 0.4)*vec3(0.6,0.4,0.4);
	col = mix (grid,col,m);
	
	
	gl_FragColor = vec4(col, 1.0);
}

