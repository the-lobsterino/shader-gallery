//by juhaxgames
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 cmul(const vec2 c1, const vec2 c2)
{
	return vec2(
		c1.x * c2.x - c1.y * c2.y,
		c1.x * c2.y + c1.y * c2.x
	);
}

vec2 cdiv(const vec2 c1, const vec2 c2)
{
	return vec2(
		(c1.x*c2.x + c1.y*c2.y),
		(c1.y*c2.x - c1.x*c2.y)
	)/(c2.x*c2.x + c2.y*c2.y);
}

vec2 cpow(const vec2 c1, const vec2 c2)
{
	return pow(c1, c2);	
}

float f_virus1_20231002(vec2 p,float t){
vec2 c = p;
	float iter = 0.0;
	for (int i = 0; i < 6; i++) {
		float phi = atan(c.y, c.x)+t*atan(2.0-1.0, 2.0-1.0)*iter;
		float r = length(c);
		if (r > sin(t)+4.0) break;
		c.x = ((cos(2.0*phi))/(r*r)) + p.x;
		c.y = (-sin(2.0*phi)/(r*r)) + p.y;
		
		iter++;
	}
return iter;
}

float getGas(vec2 p){
	return (cos(p.y*20.0+time*.0)+1.0)*0.5+(sin(p.x*2.0+time*1.0)+1.0)*0.0+0.1;
}

void ma2() {

	vec2 position = 2.*( gl_FragCoord.xy / resolution.xy );
	
	vec2 p=position;
	 

	p.y+=(0.4/(float(1.)))*(cos(p.x*(20.0*0.01))*0.2*sin(p.x*25.0)*0.5);
	vec3 clr=vec3(0.5,0.01,.1);
	clr/=getGas(p);

if(time <100.)	gl_FragColor += vec4( clr, 1. );
if(time >100.)	gl_FragColor += vec4( clr, 100.0-time*0.95 );

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
return 0.5 * (p + vec2(1.0,9.0));
}
void ma1(){
vec2 uv = (gl_FragCoord.xy-.5*resolution.xy);
uv+=vec2(101.,1.25);
float d = length(uv*1.10);
if(d > 300.1){
uv = distort(uv,.99);}
else{
uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.yy;}
vec3 col;
float dd = length(uv)+0.45;
vec2 n = vec2(0);
vec2 p = uv*vec2(-0.295,-0.95);
float ss = (dd-1.);
float a = 1.0;
mat2 m = rotate2D(time*3.1415);
if(time>4.)p*=-m;
a += dot(cos(n)/ss, vec2(.5));   
a=abs(a*1.0);
col = vec3(p.y*.5, a*p.y*0.05, p.y*0.5) * (a+0.5) +dd;
float lcin=circle(uv,vec2(-.15,.15),.05,.05);   
float rcin=circle(uv,vec2(.15,.15),.05,.05);
float lc=circle(uv,vec2(-.15,.15),.1,.05);
float rc=circle(uv,vec2(.15,.15),.1,.05);
float nc=circle(uv,vec2(.0,.0),.05,.05);
float mc=circle(uv,vec2(.0,-.20),.085,.095);
col-=sin(time*lcin);col-=sin(time*rcin);col+=lc; col+=rc;col+=nc;col+=mc;
gl_FragColor += vec4(col*dd,1.0);
	#define c gl_FragColor.xyz 
	c = 1. - c;
	#define tone c = 1. - exp2( -c );             // ändrom3da4twist
	tone
}

void main() {
	vec2 p = gl_FragCoord.xy/resolution.xy*2.-1.;
	p.x*=resolution.x/resolution.y; //make round
	if (time>4.0 && time <5.5) p*=vec2(4.-time);
	if (time>2.0 && time <4.5) p*=-vec2(-1.+time);
	float temp =f_virus1_20231002(p,1.25*time);
	ma2();
if (time>2. && time<3.14) ma1();
if(time >4.333 && time <99.5){
if(time>10. && time<16.)gl_FragColor += vec4(1.0 - temp * .333);
if (time>16.) ma1();
if(time>24. && time<32.)gl_FragColor += vec4(1.0 - temp * .333);
if(time>36. && time<64.)gl_FragColor += vec4(1.0 - temp * .9);
}
tone
}

