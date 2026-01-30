// LIM(E)
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
 
#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float TBLR(vec2 p, float d){return min(d,abs(sdBox2(p,vec2(2,3.25)*CHS)));}
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float O(vec2 p,float d){return TBLR(p,d);}
float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} // KISS MY CUNT
float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float V(vec2 p,float d){p.x=abs(p.x);return line2(d,p,vec4(0,-3.25,2,3.25)*CHS);}
float Y(vec2 p,float d){d=line2(d,p,vec4(0,-0.25,0,-3.25)*CHS);p.x=abs(p.x);return line2(d,p,vec4(0,-0.25,2,3.25)*CHS);}
// xxx it Brexit
#define s(t) (clamp(abs(cos(t))*3., 1.,2.)-1.)
#define MIX(u,v) mix( mix( u,v,s(t)) ,u, 1.-s(t) )

float GetText(vec2 uv)
{
	float t = time/2.;
	uv*=4.+sin(t)*0.25;
	uv.x += 1.7+sin(t/2.2)*0.3;
	uv.y -= .09;
	float d=1.;
	d = MIX( V(uv,d), T(uv,d)); uv.x -= 1.1;
	d = O(uv,d);                uv.x -= 1.1;
	d = MIX( T(uv,d), R(uv,d)); uv.x -= 1.1;
	d = MIX( E(uv,d), Y(uv,d));  
	return smoothstep(0.,0.025,d-0.55*CHS);
}


void main(void)
{
	vec2 p = (gl_FragCoord.xy - resolution * .5) / resolution.yy;
	float xd = GetText(p);
	float xd2 = GetText(p-vec2(-0.025,0.025));
	vec3 cc = vec3(0.1,0.3,0.7);
	vec3 cc2 = mix(cc*0.15,cc,xd);
	cc = mix(cc*2.25+(sin(p.x*3.0+p.y*10.0+time*.3)*0.25),cc2,xd2);
	float rf = sqrt(dot(p, p)) * .75;
	float rf2_1 = rf * rf + 1.0;
	float e = 1.0 / (rf2_1 * rf2_1);	
	gl_FragColor  = vec4( cc.rgb*e,1.0);
}