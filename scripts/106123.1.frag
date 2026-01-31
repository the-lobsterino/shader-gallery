#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse,resolution;

#define hash(a) fract(sin(a)*12345.0) 
#define noise(p) ((old_noise(p, 883.0, 971.0) + old_noise(p + 0.5, 113.0, 157.0)) * 0.5)
float old_noise(vec3 x, float c1, float c2) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*c2+ c1*p.z;
    return mix(
        mix(
            mix(hash(n+0.0),hash(n+1.0),f.x),
            mix(hash(n+c2),hash(n+c2+1.0),f.x),
            f.y),
        mix(
            mix(hash(n+c1),hash(n+c1+1.0),f.x),
            mix(hash(n+c1+c2),hash(n+c1+c2+1.0),f.x),
            f.y),
        f.z);
}
float fbm(vec2 n)
	{
	float total = 0.0, amplitude = 1.0;
	for (int i = 0; i < 5; i++)
		{
		total += noise(vec3(n.x, n.y, 0.0) * 2.0) * amplitude;
		n += n;
		amplitude *= 0.5;
		}
	return total;
	}

float circle(vec2 uv, vec2 p,float r,float blur){
float d=length(uv-p);
float c=smoothstep(r,r-blur,d);
return c;
}

mat2 rotate2D(float r) {
    return mat2(cos(r), -sin(r), sin(r), cos(r));
}

vec2 distort(vec2 p,float pp){
float angle = p.y / p.x;
float theta = atan(p.y,p.x);
float radius = pow(length(p),pp);
p.x = radius * cos(theta);
p.y = radius * sin(theta);
return 0.5 * (p + vec2(1.0,1.0));
}
vec2 global_p;
void jx(){
vec2 uv = (gl_FragCoord.xy-.5*resolution.xy);
uv+=vec2(10.,1.);
float d = length(uv*1.20);
if(d > 300.1){
uv = distort(uv,.49);}
else{
uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.yy;}
vec3 col;
float dd = length(uv)+0.445;
vec2 n = vec2(0);
vec2 p = uv*vec2(-0.25,-0.95);
if(time>10.)p+=sin(time);
global_p=p;
float ss = (dd-1.);
float a = 1.0;   
a=abs(a*1.0);
col = vec3(p.y*.5, a*p.y*0.05, p.y*0.5) * (a+0.5) +dd;
float lcin=circle(uv,vec2(-.15,.15),.05,.05);   
float rcin=circle(uv,vec2(.15,.15),.05,.05);
float lc=circle(uv,vec2(-.15,.15),.1,.05);
float rc=circle(uv,vec2(.15,.15),.1,.05);
float nc=circle(uv,vec2(.0,.0),.05,.05);
float mc=circle(uv,vec2(.0,-.20),.085,.095);
if(time>2.){mc*=0.5+abs(sin(time*1.2));nc*=2.2;
rc*=.2;lc*=.1;rcin*=.3;lcin*=.3;}
col-=sin(time*lcin);col-=sin(time*rcin);col-=lc; col+=rc;col+=nc;col+=mc;
gl_FragColor += vec4(col*dd,1.0);
	#define c gl_FragColor.xyz 
	c = 1. - c;
	c = 1. - exp2( -c );             // ändrom3da4twist
}
float aspect = resolution.x / resolution.y;


void main(){

vec2 uv = (gl_FragCoord.xy / resolution.xy)*2.1-1.;

float vignette;
float ex=0.;

//10 vignettes by juhaxgames

if(ex==0.) {uv.x*=uv.x;uv.y*=uv.y;
vignette =  smoothstep(0.5,1.5,length(uv));
}
const vec3 c1 = vec3(0.1, 0.0, 0.0);
const vec3 c2 = vec3(0.7, 0.5, 0.0);
const vec3 c3 = vec3(0.2, 0.0, 0.0);
const vec3 c4 = vec3(1.0, 0.9, 0.0);
const vec3 c5 = vec3(0.1);
const vec3 c6 = vec3(0.9);
vec2 p = gl_FragCoord.xy * 8.0 / resolution.xx;
if(time>10.)p.x+=sin(time);
if(time>16.&& time<32.)p=global_p*uv;
float q = fbm(p - vec2(0.0, time * 0.4));
vec2 r = vec2(fbm(p + q + time * 0.7 - p.x - p.y), fbm(p + q - vec2(0.0, time * 0.94)));
vec3 cc = mix(c1, c2, fbm(p + r * 0.7)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
c=pow(cc * cos(1.57 * gl_FragCoord.y / resolution.y), vec3(3.0));	
gl_FragColor = 100.*vignette*vec4(0.25*cc, -2.+time);jx();
	}
