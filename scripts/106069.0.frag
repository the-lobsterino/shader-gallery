//by juhaxgames
#extension GL_OES_standard_derivatives : disable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

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
void main(){
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
gl_FragColor = vec4(col*dd,1.0);
	#define c gl_FragColor.xyz 
	c = 1. - c;
	c = 1. - exp2( -c );             // ändrom3da4twist
}