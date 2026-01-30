//Zoro poro
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 color = vec3(0.0, 0.3, 0.5);
	
	float f = 0.0;
	float PI = 3.141592;
	for(float i = 0.0; i < 50.0; i++){
		
		float s = sin(time*1.1 + i * PI / 1.0) * 0.28;
		float c = cos(time*1.1 + i * PI / 2.0) * 0.28;
 
		f += 0.001 / pow( pow(abs(p.x + c),2.) + pow(abs(p.y + s),2.),.534+0.5*sin(-time*5.321+i/2.14159265+s*c*0.5));
	}
	
	
	gl_FragColor = vec4(vec3(  f*color), 1.0);
}