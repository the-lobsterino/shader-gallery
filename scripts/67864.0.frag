#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 mouse;

precision mediump float;
uniform float time;
uniform vec2 resolution;

#define VEL 1.5
#define PI 3.14159265359

void main(void)
{
	float v = VEL * abs(cos(time/5.0)) * PI* 0.01;
	vec3 rColor = vec3(1.0, 0.3, 1.0);
	rColor = vec3(0.6, 0.5, 10.0 * mouse.x);
	
	vec2 p =(gl_FragCoord.xy *2.0 -resolution);
	p /= min(resolution.x, resolution.y);
	p*=1.1;
	
	float m = cos(time*0.1);
	
	float d = cos(VEL*time*1.0 - p.x*4.0*m + 0.0*2.*PI/3.);
	float e = cos(-VEL*time*1.1 - p.x*4.0*m/4.0 + 1.0*2.*PI/3.);
	float f = cos(VEL*time*1.2 - p.x*4.0*m/2.0 + 2.0*2.*PI/3.);
	
	float r = 1.09/abs(p.x + d);
	float g = 0.09/abs(p.y + e);
	float b = 0.09/abs(p.y + f);
	
	
	vec3 destColor = rColor*vec3(r, g, b);
	gl_FragColor =vec4(destColor, 1.0);
}