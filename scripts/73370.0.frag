#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define R			resolution
#define T			time
#define S			smoothstep
#define PI          3.1415926
#define PI2         6.2831853

float hash21(vec2 p) {
    return fract(sin(dot(p,vec2(23.700,48.32)))*4374.432);
}

mat2 rot(float a)
{
    return mat2(cos(a),sin(a),-sin(a),cos(a));
}

vec3 hue(float a){
    return .45 + .45*cos(PI*a + vec3(2.,.75, .5));
}

float box( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}
float box( in vec2 p, in vec2 b, in vec4 r )
{
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}

float getP(vec2 uv)
{
    float letp = box(uv-vec2(0,.1),vec2(.15),vec4(.15,.15,.00,0));
    letp=abs(letp)-.05;
    letp=min(box(uv+vec2(.15, .0),vec2(.05,.3)),letp);
    return smoothstep(.002,.001,letp);
}

float getR(vec2 uv)
{
    float letr = box(uv-vec2(0,.1),vec2(.15),vec4(.15,.15,.00,0));
    letr=abs(letr)-.05;
    letr=min(box(uv+vec2(.15,.0),vec2(.05,.3)),letr);
    vec2 uu = uv+vec2(-.1, .175);
    uu.xy*=rot(22.*PI/180.);
    letr=min(box(uu,vec2(.05,.175)),letr);
    letr=max(letr, -box(uv+vec2(-.1, .35),vec2(.15,.05)) ); 
    return smoothstep(.002,.001,letr);
}

float getI(vec2 uv)
{
    float leti = box(uv,vec2(.05,.3));
    return smoothstep(.002,.001,leti);
}

float getD(vec2 uv)
{
    float letd = box(uv-vec2(.0,0),vec2(.15,.25),vec4(.125,.125,.00,0));
    letd=abs(letd)-.05;
    letd=min(box(uv+vec2(.15, .0),vec2(.05,.3)),letd);
    return smoothstep(.002,.001,letd);
}

float getE(vec2 uv)
{
    uv.y=abs(uv.y);
    float lete = box(uv-vec2(.0, .0),vec2(.05,.3));
    lete = min(box(uv-vec2(.1, .0),vec2(.10,.05)),lete);
    lete = min(box(uv-vec2(.1, .25),vec2(.15,.05)),lete);
    return smoothstep(.002,.001,lete);
}
//iq of hsv2rgb
vec3 hsv2rgb( in vec3 c ) {
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	return c.z * mix( vec3(1.0), rgb, c.y);
}

void main() {
    
    vec2 uv = (2.*gl_FragCoord.xy-R.xy)/max(R.x,R.y);

    vec3 C = vec3(0.);
    uv.x+=T*.2;
    vec3 clr = hsv2rgb(vec3(.2*T+uv.x*.69,1.,.5));
    uv.y-=.15*sin(uv.x*2.5+T*2.3);
    uv=fract(uv*vec2(3.,5.))-.5;
    uv*= 2.;

    C += getR(uv+vec2(.75,0));
    C += getI(uv+vec2(.0,0));
    C += getD(uv+vec2(.40,0));
    C += getE(uv-vec2(.30,0));
    C += getR(uv-vec2(.60,0));
    
    //C*= clr;
    gl_FragColor = vec4(pow(C, vec3(0.4545)),1.0);
}


