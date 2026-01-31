#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

vec4 textureRND2D(vec2 uv){
	uv = floor(fract(uv)*1e3);
	float v = uv.x+uv.y*1e3;
	return fract(1e5*sin(vec4(v*1e-2, (v+1.)*1e-2, (v+1e3)*1e-2, (v+1e3+1.)*1e-2)));
}

vec2 conj(vec2 v){return vec2(v.x,-v.y);}
vec2 inv(vec2 v){return conj(v)/dot(v,v);}
vec2 mu(vec2 u,vec2 v){return vec2( u.x*v.x-u.y*v.y,u.x*v.y+u.y*v.x);}
vec2 fonc(vec2 p,float t){return inv(p-0.25*sin(t)) * inv(p+2.0*cos(t));}

const float a=2.07;
const float b=3.90;
void main(void)
{    
 vec2 p = 2.0 *( gl_FragCoord.xy / resolution.xy)* 2.0-2. ;
 	p.x*=resolution.x/resolution.y;
 	
	float tempo=(sin(0.9-sin(time*.97))+0.50)*(b-a)/9.10+a;
//float tempo=time*0.1;	
 	for(int i=0;i<4;i++){
 	 p=(fonc(mu(p,p),tempo));}
 	 p=clamp(p,0.1,9.);
	p*=sin(time*0.00004);
	vec4 col=textureRND2D(sin(time*p*.001));
 	gl_FragColor =0.75*col*vec4(abs(sin(p.x*p.y*1.)),abs(sin(10.0/(p.x*p.y))),1.0-exp(p.x*p.x),1.);
}
