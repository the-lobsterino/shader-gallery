// BREXIT

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define CHS 0.2
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));}
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);}
float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));}
float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}

#define PI 3.14159265359
#define TAU 6.28318530718
#define EPS 0.000001

#define SIDES 8.0

vec2 rotate(vec2 vec, float angle)
{
	return mat2(cos(angle), sin(angle), -sin(angle), cos(angle)) * vec;	
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	p.x /= resolution.y / resolution.x;
	vec2 uv = p;
	
	float angle = floor((atan(p.y,p.x) + PI - EPS) / TAU * SIDES) / SIDES * TAU;
	float color = 0.0;
	p = rotate(p, (PI / SIDES * (SIDES-1.0)) - angle);
	color = sin(p.x*20.0-time*6.);
	vec3 c2 = vec3( color, color * 0.5, sin( color + time / 3.0 ) * .5 );
	
	
	float t = time;
	float _d = length(uv);
	vec3 c1 = vec3(1.0)-c2;
	uv.x += 0.65;
	uv *= sin(t+uv.y+uv.x)+4.0;
	float d = B(uv,1.0);
	uv.x -= 1.1;
	d = R(uv,d);
	uv.x -= 1.1;
	d = E(uv,d);
	uv.x -= 1.1;
	d = X(uv,d);
	uv.x -= 1.1;
	d = I(uv,d);
	uv.x -= 1.1;
	d = T(uv,d);
	d = smoothstep(0.0,0.05,d-0.55*CHS);
	gl_FragColor = vec4(mix(c1, c2, d),1.0);
	
	

}