

//#define SHADERTOY

precision highp float;
#ifdef SHADERTOY
 vec2  resolution, mouse;
 float time;
#else
 uniform vec2  resolution;     // resolution (width, height)
 uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
 uniform float time;           // time       (1second == 1.0)
 uniform sampler2D backbuffer; // previous scene texture
#endif

const vec3 V  = vec3(0,.001,80);
const vec3 BG = vec3(0,.01,.02);
const vec3 Amb= vec3(.05);
const vec3 PI = vec3(1.5707963,3.1415927,6.2831853);
const float BPM = 120.;
vec2 uv;
float tick, pick;

vec4  bb(){return texture2D(backbuffer,gl_FragCoord.xy/resolution);}
vec4  gamna(vec3 c){return vec4(pow(c,vec3(1./2.2)),1);}
float rnd(vec3 s){s=fract(s*443.8975);s+=dot(s,s.yzx+19.19);return fract(s.x*s.y*s.z);}
vec3  hsv(float h,float s,float v){return((clamp(abs(fract(h+vec3(0,2,1)/3.)*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;}
vec2  circle(float a){return vec2(cos(a),sin(a));}
float smin(float a, float b, float k){return -log(exp(-k*a)+exp(-k*b))/k;}
float vmin(vec3 v) { return min(v.x, min(v.y, v.z)); }
float vmax(vec3 v) { return max(v.x, max(v.y, v.z)); }
float checker(vec3 u, vec3 s){return mod(floor(u.x/s.x)+floor(u.y/s.y)+floor(u.z/s.z),2.);}
float fresnel(float r, float dp) {return r+(1.-r)*pow(1.-abs(dp),5.);}
mat3  camera(vec3 p, vec3 t, vec3 h){vec3 w=normalize(p-t),u=normalize(cross(w,h));return mat3(u,normalize(cross(u,w)),w);}
mat3  euler(float h, float p, float r){float a=sin(h),b=sin(p),c=sin(r),d=cos(h),e=cos(p),f=cos(r);return mat3(f*e,c*e,-b,f*b*a-c*d,f*d+c*b*a,e*a,c*a+f*b*d,c*b*d-f*a,e*d);}
float dfPln(vec3 p, vec3 n, float d){return dot(p,n)+d;}
float dfBox(vec3 p, vec3 b, float r){return length(max(abs(p)-b,0.))-r;}
float dfDdc(vec3 p, float r) {vec4 v=vec4(-.8507,.8507,.5257,0);return max(max(abs(dot(p,v.wyz)),max(abs(dot(p,v.wxz)),abs(dot(p,v.zwy)))),max(abs(dot(p,v.zwx)),max(abs(dot(p,v.yzw)),abs(dot(p,v.xzw)))))-r;}
vec2  doKaleido(vec2 uv){ return abs(mat2(1,1.732,1,-1.732)*abs(fract(mat2(1.,-1.,-1.732,-1.732)*uv+.5)-.5)); }
float esElaO(float t) { return 1.-exp(-5.*t)*cos(6.*t*PI.y); }
float esExpIO(float t, float m){return (t<.5)?(.5*exp(m*(t-.5))):(1.-.5*exp(m*(.5-t)));}
float esBounce(float t){t=(t-1./3.5)*3.5; return min(t*t,min((t-1.5)*(t-1.5)+.75,(t-2.25)*(t-2.25)+.9375));}
float dfp2l(vec3 p, vec3 d, vec3 c) { return length(dot(c-p,d)*d+p-c); }

vec3 lightpos;
vec3 lightcol;

float map(in vec3 p) {
    p += vec3(tick * 8., 0, 0);
    float dly = floor(p.x/3.0+abs(p.z)/3.0+0.5)*.1;
    float t = clamp(fract((tick-dly)/8.)*2.,0.,1.);
    p.xz = (fract(p.xz/3.0+.5)-.5)*3.0;
    float d = dfPln(p, vec3(0,1,0), 0.);
    p = (p+vec3(0,esBounce(t)*3.0-2.6,0))*euler(0.,0.,t*PI.z);
    d = smin(d, dfDdc(p, .5), 2.5);
    return d;
}

vec3 background(vec3 pos, vec3 dir, inout float bld) {
    bld = 0.;
    return BG;
}

vec3 diff(vec3 nml, vec3 lit, vec3 col){return max(dot(nml,lit)*col,0.);}
float shad(vec3 pos, vec3 lit){float s=V.z,t=.01,d;for(int i=20;i!=0;--i){t+=max(d=map(pos+lit*t),.05);s=min(s,d/t);if(t>5.)break;}return clamp(s*.2,0.,1.);}
float occl(vec3 pos, vec3 nml){float s=0.;for(float t=.01;t<.5;t+=.05){s+=t-map(pos+nml*t);}return clamp(1.-s*.3,0.,1.);}
vec3 light(vec3 pos, vec3 dir, vec3 lpos) { return pow(dfp2l(pos, dir, lpos)*40., -1.5)*lightcol; }

vec3 trace(inout vec3 pos, inout vec3 dir, inout float bld) {
    float t = 0., d;
    for (int i=80; i!=0; --i) {
        t += (d = map(pos + dir * t));
        if (d < V.y) break;
        if (t > V.z) return bld * background(pos, dir, bld) + light(pos, dir, lightpos);
    }
    vec3 p = pos + dir * t;
    vec3 n = normalize(vec3(map(p+V.yxx),map(p+V.xyx),map(p+V.xxy))-map(p));
    vec3 c = vec3(1);
    float ldst = length(lightpos - pos);
    vec3 emit = (ldst < t) ? light(pos, dir, lightpos) : vec3(0);
    vec3 ldir = normalize(lightpos - p);
    vec3 lcol = diff(n, ldir, lightcol) * shad(p, ldir) * occl(p, n) + Amb;
    vec3 col = c * lcol;
    float b=bld*.75;
    pos = p + n*V.y;
    dir = reflect(dir, n);
    bld *= .25;
    return mix(col, BG, clamp((length(p.xz)-16.)/32.,0.,1.))*b + emit;
}


vec3 render(in vec3 pos, in vec3 dir) {
    float b = 1.;
    vec3 col = trace(pos, dir, b);
    if (b > V.y) col += trace(pos, dir, b);
    //if (b > V.y) col += trace(pos, dir, b);
    return col;
}

vec4 entryPoint(vec2 fragCoord) {
    uv = (fragCoord * 2.-resolution) / resolution.y;
    tick = time * BPM / 60.;
    pick = tick * PI.z;

    lightpos = vec3(15, cos(pick/16.)*3.0+6.5, sin(pick/8.)*5.);
    lightcol = hsv(pick/32., 0.5, 1.0) * 20.;
    vec3 pos = vec3(0,sin(pick/20.)*2.0+6.0,0);
    vec3 dir = camera(pos, vec3(15,lightpos.yz*0.5), vec3(0.707,0.707,0)) * normalize(vec3(uv,-1.732));
    return gamna(render(pos, dir));
}

#ifdef SHADERTOY
void mainImage(out vec4 flagColor,in vec2 flagCoord) {
    resolution = iResolution.xy;
    time = iTime;
    mouse = iMouse.xy;
    flagColor = entryPoint(flagCoord);
}
#else
void main() {
    gl_FragColor = entryPoint(gl_FragCoord.xy);
}
#endif
