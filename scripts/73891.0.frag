
// FUCK ITALY
// GIVE US
// BREXIT

#ifdef GL_ES
precision mediump float;
#endif
 
uniform float time;
uniform vec2 resolution;
 
mat2 rot(float a)
{
 float sa = sin(a), ca = cos(a);
 return mat2(ca, -sa, sa, ca);
}    
 
float light(vec2 pos, float ang)
{
	pos = pos * rot(ang);
	pos.y -= 0.5;
	float mask = 1. - (pos.x * pos.x * 60. - pos.y + 0.5);
	float brightness = clamp(pow(0.1/(pos.y+.5),2.),0.,1.);
	return mask*brightness*15.;
}
 
#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // ANUS
 
float GetText(vec2 uv)
{
	uv.y -= 0.4;
	uv.x += 2.75;
	float d = B(uv,1.0);uv.x -= 1.1;
	d = R(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = X(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = T(uv,d);
	return smoothstep(0.0,0.05,d-0.55*CHS);
}
 
void main( void )
{
	vec2 p = (gl_FragCoord.xy/resolution - vec2(0.5));
	vec3 color = vec3(0.0);
	color *= (1.0- p.x * p.x + p.y * p.y)/2.;
	vec2 p2 = p;
	p2.y += 0.5;
		color += vec3(0.0, 0.0,clamp(light(vec2(p.x,p.y + 0.8),	sin(time/2. + 2.)/2.),0.,1.));
	color += clamp(light(vec2(p.x,p.y + 0.8),	sin(time/2. + 1.)/2.),0.,1.);
	color += vec3(clamp(light(vec2(p.x,p.y + 0.8),	sin(time/2. + 3.)/2.),0.,1.), 0.0, 0.0);
	color*=3.0;

	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	uv.y += abs(sin(time+uv.x)*0.2);
	float dd= GetText(uv*2.0);
	color = mix(color+vec3(.5,0.4,1.9), color,dd);
	gl_FragColor = vec4(color,1);
}
 
