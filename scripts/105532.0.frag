//by juhaxgames
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 uv, vec2 p,float r,float blur){
float d=length(uv-p);
float c=smoothstep(r,r-blur,d);
return c;
}
void fade(float inx){vec3 dc;dc+=0.5/abs(length(time*1.)-inx);gl_FragColor = vec4(dc, 1.0);}
mat2 rotate2D(float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

void main(){
vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
//vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/-resolution.y;//flipy
vec3 col = vec3(0);
float dd = length(uv)+0.5;
vec2 n = vec2(0);
vec2 p = uv;
float ss = (dd-.95);
float a = 1.0;
fade(.50);
mat2 m = rotate2D(time*3.1415);
if(time>5.)p*=-m;
a += dot(cos(n)/ss, vec2(.5));   
a=abs(a*.250);
col = vec3(p.y*.5, a*p.y*0.05, p.y*0.5) * (a+0.5) +dd;
float lcin=circle(uv,vec2(-.15,.15),.05,.05);   
float rcin=circle(uv,vec2(.15,.15),.05,.05);
float lc=circle(uv,vec2(-.15,.15),.1,.05);
float rc=circle(uv,vec2(.15,.15),.1,.05);
float nc=circle(uv,vec2(.0,.0),.05,.05);
float mc=circle(uv,vec2(.0,-.20),.085,.095);
col-=lcin;col-=rcin;col+=lc; col+=rc;col+=nc;col+=mc;
gl_FragColor += vec4(col*dd,1.0);
	#define c gl_FragColor.xyz 
	c = 1. - c;
	c = 1. - exp2( -c );             // ändrom3da4twist
}
