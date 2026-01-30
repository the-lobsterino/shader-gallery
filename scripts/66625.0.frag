// max shat2
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
mat2 rotate(float a)
{
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}
void main( void ) {
	
	vec2 p = 1.0 * (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	float d = length(p);
	p*=rotate((time*0.31) * d*0.01+p.y*0.005);
	
	p.x += sin(time*0.3+p.y*2.5)*0.1;
	p.y = dot(p,p);
	float len = 0.01 / length(p.x + sin(p.y * 0.25 + time));

	
	p*=rotate(sin(time*0.015+p.y*0.1)*0.2);
	float len2 = 0.5 / length(p.x + sin(p.y+p.x * 2.0) + 0.2);
	float k1 = 0.5+sin(time*1.3+p.y*42.0)*0.5;
	float k2 = 0.5+sin(time*1.6+p.x*22.0)*0.5;
	len2+=k1*0.5;
	
	p*=rotate(sin(time+p.x*0.7)*1.48);
	
	len *= len2;
	
	float circle = 2.5 / length(vec2(sin(p.x + time), p.y));
	circle += k2*1.5;
	
	len *= circle;
	
	float vv = smoothstep(0.0,0.07,len);
	float vv2 = smoothstep(0.0,0.09,len+(sin(time+(p.x*0.4))*0.05));
	float vv3 = smoothstep(0.0,0.11,len+(sin(time*.5-(p.y*0.4))*0.09));
	
	vec3 color = vec3(1.0*vv3,vv2*0.8,vv*0.6)* vv;
	
	
	
	gl_FragColor = vec4(color, 1.0);

}