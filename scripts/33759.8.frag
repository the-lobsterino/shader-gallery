#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
#define time time*.1
uniform vec2 mouse;
uniform vec2 resolution;
float floorSmooth(float x,float c){float a=fract(x);return((pow(a,c)-pow(1.-a,c))/2.)+floor(x);}
vec3 hue(float hue){vec3 rgb=fract(hue+vec3(0.,2./3.,1./3.));rgb=abs(rgb*2.-1.);return clamp(rgb*3.-1.,0.,1.);}
vec3 d(vec2 uv){uv-=.5;return (vec3((max(abs(uv.x),abs(uv.y))-.3)*6.)*hue(time+length(uv)+length(uv))*2.);}
#define cl3(x) clamp(x,0.,1.)
void main() {
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
	float uvb=1.-dot(uv,uv)*0.5;
	float uva=1.-length(uv)*0.8;
	uv = mix( uv*uva, uv*uvb, abs(sin(time-uva)*2.0-cos(time-uvb)));
	float th=floorSmooth(time*1.2,5.);
	uv*=mat2(cos(th*-.628),-sin(th*.2314),sin(th*.314),cos(th*.628));
	float c=3.;float s=3.;float t=2.+sin(time);
	float t2=(time/14.)-(length(uv)*.21);
	vec2 a=fract(uv*pow(2.5,floorSmooth((fract(t2)*t)+s,c*c)));
	vec2 b=fract(uv*pow(2.,floorSmooth(((fract(t2)-1.)*t)+s,2.7*c)));
	vec3 col=mix(cl3(d(a)),cl3(d(b)),fract(t2));
	gl_FragColor = vec4(1);
	for(int i=0;i<4;i++){ //I don't like this glitch, somehow it doesn't enable me to save by using 3 channels. http://i.imgur.com/GQ1kDEN.gifv
		gl_FragColor[i]=col[i];
	}
}