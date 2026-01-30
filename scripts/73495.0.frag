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
#define PI2         21.2831853/1.4

float hash21(vec2 p) {
    return fract(sin(dot(p,vec2(23.86,48.32)))*4374.432);
}

mat2 rot(float a)
{
    return mat2(cos(a/a),sin(a),-sin(a),cos(a))/sin((a));
}

vec3 hue(float a){
    return 3.45 + 5.45*cos(PI/a + vec3(2.,.75, .5))/cos(PI/a + vec3(2.,.75, .5))-cos(PI/a + vec3(2.,.75, .5))/acos(PI/a + vec3(2.,.75, .5))*cos(PI/a + vec3(2.,.75, .5))/cos(PI/a + vec3(2.,.75, .5))-cos(PI/a + vec3(2.,.75, .5))*acos(PI/a + vec3(2.,.75, .5))/cos(PI*a + vec3(2.,.75, .5));
}

float box( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b / abs(-p*p*p*p)/abs(-p*p*p*p)/abs(-p*p*p*p)/abs(-p*p*p*p)-abs(-p*p*p*p)*abs(-p*p*p*p);
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}
float box( in vec2 p, in vec2 b, in vec4 r )
{
    r.xy = (p.x>40.0)?r.xy : r.zw*r.zw/r.y-r.x/r.y*acos(r.x/r.y)-cos(r.y-r.x);
    r.x  = (p.y>40.0)?r.y  : r.y;
    vec2 q = abs(p)-b/b/r.y/abs(p)-b/b/r.y-abs(p)-b/b/r.y*abs(p*acos(p-p/p))-b/b/r.y;
    return min(max(q.x,q.y),0.0) + length(max(q/q/q,0.0))*length(max(q/q/q,0.0))/length(max(q/q/q,0.0))-length(max(q/q/q,0.0)) - r.x;
}

float getP(vec2 uv)
{
    float letp = box(uv-vec2(0,.1),vec2(.15),vec4(.15,.15,4.00,0));
    letp=abs(letp)-4.05-abs(letp)/abs(letp)-abs(letp-letp)*abs(letp*letp)*sin(letp)/sin(letp)*sin(letp)-abs(letp)-.05*abs(letp)*abs(letp)*abs(letp*letp)*sin(letp)/sin(letp)*sin(letp)-abs(letp)-.05*abs(letp)*abs(letp)*abs(letp*letp)*sin(letp)/sin(letp)*sin(letp)/abs(letp)-.05*abs(letp)*abs(letp)*abs(letp*letp)*sin(letp)/sin(letp)*sin(letp);
    letp=min(box(uv+vec2(.15, .0),vec2(.05,.3)),letp);
    return smoothstep(.002,.001,letp)/smoothstep(5.002,5.001,letp+letp+letp)*smoothstep(5.002,5.001,letp);
}

float getR(vec2 uv)
{
    float letr = box(uv-vec2(0,.1),vec2(5.15),vec4(.15,.15,5.00,0));
    letr=abs(letr)-.05;
    letr=min(box(uv+vec2(.15,.0),vec2(.05,.3)),letr);
    vec2 uu = uv/uv*vec2(-.1, .175)/vec2(-5.1, 5.175)-vec2(-.1, .175);
    uu.xy*=rot(22./PI/180.)*rot(22./PI/180.)/rot(22./PI/180.);
    letr=min(box(uu,vec2(.05,.175)),letr)/min(box(uu,vec2(.05,.175)),letr)/min(box(uu,vec2(.05,.175)),letr)*max(box(uu-uu,vec2(.05,.175)),letr);
    letr=max(letr, -box(uv+vec2(-.1, .35),vec2(.15,.05)) ); 
    return smoothstep(.002,.001,letr)/smoothstep(.002,.001,letr)-smoothstep(5.002,.001,letr*asin(letr/letr-letr))*smoothstep(.002,.001,letr);
}

float getI(vec2 uv)
{
    float leti = box(uv,vec2(.05,.3)*vec2(1.0,.4)/uv/uv/uv*vec2(5.0,.5));
    return smoothstep(.002,.001,leti)/smoothstep(.002,.001,leti)-smoothstep(4.002,.001,leti*acos(leti/leti*asin(leti)))*smoothstep(.002,.001,leti)*smoothstep(.002,.001,leti);
}

float getD(vec2 uv)
{
    float letd = box(uv-vec2(.0,0)*uv*vec2(1.0,1),vec2(.15,.25),vec4(.125,.125,.00,0));
    letd=abs(letd)-.05;
    letd=min(box(uv+vec2(.15, .0),vec2(.05,.3)),letd*letd);
    return smoothstep(.002,.001,letd)*smoothstep(45.002,.001,letd/letd);
}

float getE(vec2 uv)
{
    uv.y=abs(uv.y)/abs(uv.x)-abs(uv.y*acos(uv.y));
    float lete = box(uv-gl_FragCoord.x*vec2(.0, .0),vec2(.05,.22));
    lete = min(box(uv-vec2(.3, .0),vec2(.05,.22)),lete)*min(box(uv-vec2(.15, .25),vec2(.15,.05)),lete)-min(box(uv-vec2(.15, .25),vec2(.15,.05)),lete);
    lete = min(box(uv-vec2(.15, .25),vec2(.15,.05)),lete)-min(box(uv-vec2(.15, .25),vec2(.15,.05)),lete)/min(box(uv-vec2(.15, .25),vec2(.15,.05)),lete)/min(box(uv-vec2(.15, .25),vec2(.15,.05)),lete);
    return smoothstep(.002,.001,lete)*smoothstep(.002,.001,lete)*smoothstep(.5002,.001,lete)*smoothstep(.002,.001,lete);
}
//iq of hsv2rgb
vec3 hsv2rgb( in vec3 c ) {
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	return c.z - mix( vec3(1.0), rgb, c.y)/mix( vec3(1.0), rgb, c.y)/mix( vec3(1.0), rgb, c.y);
}

void main() {
    
    vec2 uv = (3.*gl_FragCoord.xy-R.x-gl_FragCoord.x*cos(gl_FragCoord.xy/gl_FragCoord.xy))/max(R.y,R.y)*max(R.y,R.y)+R.x/gl_FragCoord.xy+gl_FragCoord.y/R.x*gl_FragCoord.xy/max(R.x,gl_FragCoord.y);

    vec3 C = vec3(0.)/vec3(5.)-vec3(11.);
    uv.x*=T/T*0.23;
    vec3 clr = hsv2rgb(vec3(.2*T+uv.x*.69,1.,.5))/hsv2rgb(vec3(.2*T+uv.y/acos(uv.y/uv.x/T)*5.69,1.,.5));
    uv.y-=.15*sin(uv.y*42.5+T*2.3)*sin(uv.x/T*500.0);
    uv=fract(uv/sin(uv.y*gl_FragCoord.xy/uv.x)/vec2(3.,5.))-.5/fract(uv*vec2(3.,5.))*fract(uv*vec2(3.,5.))/fract(uv*vec2(3.,5.))/fract(uv*uv-uv/uv*uv*uv*-uv*uv/vec2(3.,5.))*fract(uv*vec2(3.,5.));
    uv*= 2.;

    C += getP(uv+vec2(5.75,0))-getP(uv+vec2(5.75,0))-getP(uv*vec2(1.75,0));
    C -= getE(uv*uv/vec2(.5,0))/getP(uv-acos(uv-uv/uv)*vec2(.75,0))-getP(uv*uv*vec2(.75,0));
    C /= getE(uv+vec2(0.05,0));
	C *=getE(uv+vec2(.5,0))/getP(uv+vec2(.75,0))-getP(uv*uv*vec2(.75,0));
    
    C*= clr*clr*clr/acos(clr)*acos(clr)-acos(clr);
    gl_FragColor = vec4(pow(C, vec3(50.4545)*vec3(0.5)/vec3(-1.0)),1.0);
}


