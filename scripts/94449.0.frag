
// BREXIT
#ifdef GL_ES
precision highp float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
 
#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){
	p.y+=1.75*CHS;
	d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));
	p+=vec2(0.5,-3.25)*CHS;
	return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} 
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT
 
float GetText(vec2 uv)
{
	uv.x += 2.75;
	uv.y += sin(time*0.5+uv.x*1.6)*0.2;
	
	float v = 0.5+sin(time*2.0)*0.5;
	v*=7.0;
	float t = mod((v),7.0);
	float d = 2000.0;
	
	if (t>1.0)
		d = B(uv,1.0);uv.x -= 1.1;
	if (t>2.0)
		d = R(uv,d);uv.x -= 1.1;
	if (t>3.0)
		d = E(uv,d);uv.x -= 1.1;
	if (t>4.0)
		d = X(uv,d);uv.x -= 1.1;
	if (t>5.0)
		d = I(uv,d);uv.x -= 1.1;
	if (t>6.0)
		d = T(uv,d);
	return smoothstep(0.0,0.12,d-0.55*CHS);
}

vec3 colcol()
{

    float t = fract(time*0.1)*6.28;
    vec2 p = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
	float c = abs(p.y*2.2);
	float c2 = 0.95-abs(p.x);
	
	
	c = 1.0-pow(c,7.0);
	p.y *= length(p);
    p.y *= 4.;
  	p.y *= 2.0 * sin(sin(t+p.x*0.5)*2.0+p.x * 10.0 )+ 0.5 * sin(p.x*p.y * 4.0 + t*4.0 );
    p.y = pow(abs(p.y*1.4+p.x*.8),12.0);
    float v = clamp(p.y , 0.0, 1.0)*c*c2;
    return vec3(v*0.67,v*0.5,v*0.76);
}

 
void main( void )
{
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 col = colcol();
	p.y += sin(col.r + time+p.x)*0.1;
	float d= GetText(p*3.0);
	col = mix(col+vec3(.6,.7,1.7), col,d);
	gl_FragColor = vec4( col.xyz, 1.0 );
}
