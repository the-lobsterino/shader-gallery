precision mediump float;

uniform float time;
uniform vec2 resolution;

#define R			resolution
#define M			mouse
#define T			time

#define PI          3.14159265359
#define PI2         6.28318530718

#define MIN_DIST    .001
#define MAX_DIST    45.

mat2 rot(float a){ return mat2(cos(a),sin(a),-sin(a),cos(a)); }
float hash21(vec2 p){return fract(sin(dot(p,vec2(27.86,48.32)))*4274.132);}

float vmax(vec2 v) {	return max(v.x, v.y);						}
float vmax(vec3 v) {	return max(max(v.x, v.y), v.z);				}
float sgn(float x) { 	return (x<0.)?-1.:1.;							}
vec2  sgn(vec2  v) {	return vec2((v.x<0.)?-1.:1., (v.y<0.)?-1.:1.);	}
float pMod(inout float p, float size) {
    float c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5, size) - size*0.5;
    return c;
}
vec3 pMod(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}
float fBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
}
float fBox2(vec2 p, vec2 b) {
	vec2 d = abs(p) - b;
	return length(max(d, vec2(0))) + vmax(min(d, vec2(0)));
}

vec2 path(in float z){ 
    vec2 p1 =vec2(2.3*sin(z * .15), 1.4*cos(z * .025));
    vec2 p2 =vec2(1.2*cos(z * .05), 2.1*sin(z * .15));
    return p1 - p2;
}

float glow=0.,iqd=0.,travelSpeed=0.,carWave=0.;

vec2 fragtail(vec3 pos, float z) {

    float fm=3.25;
    float scale = fm;
    
 	vec3 cxz = vec3(3.,3.,3.);
    float r = 1e5;
    float mt = 1e5;
    float ss=.75;
	
    for (int i = 0;i<4;i++) {
        pos=abs(pos);
        
        if ( pos.x- pos.y<0.) pos.yx = pos.xy;
        if ( pos.x- pos.z<0.) pos.zx = pos.xz;
        if ( pos.y- pos.z<0.) pos.zy = pos.yz;
        pos.x=scale * pos.x-cxz.x*(scale-1.);
        pos.y=scale * pos.y-cxz.y*(scale-1.);
        pos.z=scale * pos.z;
        
        if (pos.z>0.5*cxz.z*(scale-1.)) pos.z-=cxz.z*(scale-1.);
        r = fBox2(pos.xy,vec2(scale));

        ss*=1./scale;
    }

    return vec2(r*ss,2.);
}

vec2 map (in vec3 pos, float sg) {
 	vec2 res = vec2(1e5,-1.);
 	vec3 p = pos;
    vec2 track = p.xy - path(p.z);
    vec3 q = vec3(track,p.z);

    vec3 s = q;
    vec3 r = vec3(abs(q.x)-1.25,abs(q.y),q.z);

    s.x=abs(s.x);
    pMod(s.z,4.5);

    float msize = 9.;
    vec3  qid = pMod(q,vec3(msize,msize,4.5));


    vec2 d1 = fragtail(q,qid.z);
    if(d1.x<res.x)  res = d1;
 
    r.y+=.075+.035*sin(q.z*3.-T*3.5);
    float d4 = length(r.xy-vec2(.65,.15))-.005;
    d4 = min(length(r.xy-vec2(2.0,.695))-.015,d4);
    if(d4<res.x && sg > 0.) res = vec2(d4,31.);

    if(sg>0.) glow = clamp(0.,1.,glow+(.0015/(.0075+d4*d4)) );
 

 	return res;
}

vec3 normal(vec3 p, float t)
{
    float e = MIN_DIST*t;
    vec2 h =vec2(1,-1)*.5773;
    vec3 n = h.xyy * map(p+h.xyy*e,0.).x+
             h.yyx * map(p+h.yyx*e,0.).x+
             h.yxy * map(p+h.yxy*e,0.).x+
             h.xxx * map(p+h.xxx*e,0.).x;
    return normalize(n);
}

vec3 render(vec3 ro,vec3 rd,vec2 uv ) {
    vec3 C = vec3(0);
    vec3 FC= vec3(.5);
    
    float d = 0.01, m = 0.,bnc = 0.;
    vec3 p = ro + rd;
  
    for(int i=0;i<128;i++)
    {
        p=ro+rd*d;
        vec2 ray = map(p, 1.);
        if(abs(ray.x)<MIN_DIST*d||d>MAX_DIST)break;
        d+=i<64?ray.x*.5:ray.x;
        m =ray.y;
    }

    C = mix(FC,C,  exp(-.000145*d*d*d));
    C = mix(C,min(vec3(1),(vec3(0.000,0.722,0.024)*glow)+glow),clamp(0.,1.,glow));   
    return C;
}

void main( ) {

    travelSpeed = (time * 1.5);
    carWave = (.5*sin(time*.3))+.65;
    vec2 F =gl_FragCoord.xy;
    vec2 uv = (2.*F.xy - R.xy)/max(R.x,R.y);

	float md = mod(time*.1,2.);

    vec3 lp = vec3(0.,0.,0.-travelSpeed);
    vec3 ro = vec3(0.,.0,.25);

    ro +=lp; 
 	lp.xy += path(lp.z);
    ro.xy += path(ro.z);

    vec3 f=normalize(lp-ro),
         r=normalize(cross(vec3(0,1,0),f)),
         u=normalize(cross(f,r)),
         c=ro+f*.55,
         i=c+uv.x*r+uv.y*u,
         rd = i-ro;
     
    rd.xy = rot( -path(lp.z).x/ 24. )*rd.xy;
    rd.xz = rot( -path(lp.z+1.).y/ 14. )*rd.xz;
    
    vec3 C = render(ro,rd,uv);
    C =pow(C, vec3(0.4545));
    gl_FragColor = vec4(C,1.0);
}
