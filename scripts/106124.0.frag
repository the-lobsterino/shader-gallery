#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define RUN vec2 uv = ( gl_FragCoord.xy / resolution.xy );vec2 signedUV = uv * 2.0 - 1.0;float freq = mix( 0.7, 0.9, sin(time*4.) );float scale = 55.0;float v = 50.0;vec3 finalColor = vec3( 0.0 );float t = line( vec2(-v, -v), vec2(-v, v), signedUV * scale );finalColor = vec3( 2.0 * t, 2.0 * t, 8.0 * t) * freq;t = line( vec2(-v, v), vec2(v, v), signedUV * scale );finalColor += vec3( 2.0 * t, 2.0 * t, 8.0 * t) * freq;t = line( vec2(v, v), vec2(v, -v), signedUV * scale );finalColor += vec3( 2.0 * t, 4.0 * t, 8.0 * t) * freq;t = line( vec2(v, -v), vec2(-v, -v), signedUV * scale );
#define _ if(time>.31 &&time<16.)egg();if(time>8.&&time<666.)mm2();if(time>.21&&time<19.5)lamer();if(time>0.1&&time<8.) gl_FragColor += vec4( finalColor,1.);

float line( vec2 a, vec2 b, vec2 p )
{
	vec2 aTob = b - a;
	vec2 aTop = p - a;
	
	float t = dot( aTop, aTob ) / dot( aTob, aTob);
	
	t = clamp( t, 0.01, 0.99);
	
	float d = length( p - (a + aTob * t) );
	d = 0.3 / d;
	
	return clamp( d, 0.0, 0.5 );
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
void mm2(){//by juhaxgames
vec2 uv = (gl_FragCoord.xy-.5*resolution.xy);
uv+=vec2(101.,1.25);
float d = length(uv*1.10);
if(d > 300.1){
uv = distort(uv,.9);}
else{
uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.yy;}
vec3 col;
float dd = length(uv)+0.45;
vec2 n = vec2(0);
vec2 p = uv*vec2(-0.25,-0.95);
float ss = (dd-1.);
float a = 1.0;   
a=abs(a*1.0);
col = vec3(p.y*.5, a*p.y*0.05, p.y*0.5) * (a+0.5) +dd;
if(time>19.0 && time<20.) col*=.25;
if(time>41.0 && time<41.5) col*=.45;
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
	c = 1. - exp2( -c );             // ändrom3da4twist
}
#define speed 2.5//<--derp!

vec3 col = vec3(0.0);



void lamer() {

	vec2 p = (( gl_FragCoord.xy )-0.5*resolution)/ resolution.y;
	float t = time*0.15;
	p.x -= sin(t)*0.4;
	p.y += cos(t*2.0)*0.2;
	
	float ta = atan( p.y, p.x );
	float tr = length( p);
	
	vec2 pp = vec2( 0.51 / tr + speed * t, ( ta + speed * t ) / 3.1416 );

	vec2 uv;
	float a = atan(pp.y,pp.x)/(2.0*3.1416);
	float r = sqrt(dot(pp,pp))/sqrt(2.0)+t;
	uv.x = r;
	uv.y = a+r;
	
	col = vec3(uv.y,p.y*2.5,0.5)*0.01;
	
	gl_FragColor += vec4(col, 1.0);

}
float map(vec3 p) {	return length(mod(p, 2.0) - 1.0) - 0.5;}


void egg( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	vec3 col = uv.xyy;	vec3 dir = normalize(vec3(uv, 1.0));
	float tm = time;	float it = float(int(tm));
	float ft = fract(tm);	float mx = 0.0;
	float my = 0.0;	float mz = 0.0;
	float mk = tm * 2.0;	mz = mk;
	
	vec3 pos = vec3(mx, my, mz);
	float t = 0.0;
	for(int i = 0 ; i < 20; i++) {
		float tk = map(t * dir + pos);
		if(tk < 0.01) break;
		t += tk;
	}
	vec3 ip = dir * t + pos;	col.x = 1.0 - t * 0.1;
	col.yz = col.xx;	col += dir * 0.1;
	col += map(ip - 0.1);	gl_FragColor += 0.02*vec4(vec3(col), 1.0);
}
void main() {RUN if(time>1.&&time<41.)lamer(); finalColor += vec3( 2.0 * t, 4.0 * t, 8.0 * t) * freq;_}