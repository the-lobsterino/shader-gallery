#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

void main(void)
{
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	p+=sin(p);
	float dd = length(sin(time*0.4+p*p))*2.5;
	float z = 0.5+sin(time*1.5+p.y*2.5)*0.5;
	p*=1.0+z*0.35;
	z=1.0-z;
	z = 0.6+(z*.85);
	p.y += time*0.2;
	vec3 col1 = vec3(0.1,0.35,0.3);
	vec3 col2 = vec3(0.8,0.5,0.4);
	
	float v = sin(dd*5.0+time*0.5)*2.0;
	
	float d = step(sin(p.y*20.0)+sin(p.x*20.0),v);
	gl_FragColor = vec4(mix(col1,col2,d)*z,1.0);
}