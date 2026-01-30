//MG
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi 3.14159265359

vec4 hue2rgb(float h)
{
	const float szreg = 1.0/6.0;
	float r = (1.0 - smoothstep(szreg, 2.0*szreg, h)) + smoothstep(4.0*szreg, 5.0*szreg, h);
	float g = smoothstep(0.0, szreg, h) - smoothstep(0.5, 0.5+szreg, h);
	float b = smoothstep(2.0*szreg, 3.0*szreg, h) - smoothstep(5.0*szreg, 1.0, h);
	return vec4(r,g,b,1.0);
}

void main() {
	float time = time;
	if(gl_FragCoord.y/resolution.y > 0.5){
		time -= mod(time, 1./24.);
	}
	vec2 pos=(gl_FragCoord.xy/resolution.y);
	pos.x-=resolution.x/resolution.y/2.0;
	pos.y-=0.5;
	
	float f = 3.0;
	float tn = mod(time, 2.0*pi*f) -pi*f;	
	float t = pos.x*f*pi;	
	float fx=sin(t+time)/5.0;
	float rs=distance(t, tn);
	float dist=abs(pos.y-fx)*25.0*pow(rs, 0.6 + 0.1*sin(time));	
	gl_FragColor += hue2rgb(fract(t/(pi*4.0)+time/pi)) * vec4(1.0/dist,1.0/dist,1.0/dist,1.0);
}