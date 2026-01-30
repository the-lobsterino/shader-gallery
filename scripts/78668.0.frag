#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

// https://twitter.com/karlikpj
// https://www.shadertoy.com/view/Wd3cWs

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define R		resolution
#define M		mouse
#define T		time
#define PI          	3.1415926
#define PI2         	6.2831853

#define MINDIST     	.001
#define MAXDIST     	75.

#define r2(a) mat2(cos(a),sin(a),-sin(a),cos(a))
#define hash(a, b) fract(sin(a*1.2664745 + b*.9560333 + 3.) * 14958.5453)

// Maximum/minumum elements of a vector
float vmax(vec2 v) {	return max(v.x, v.y);						}
float vmax(vec3 v) {	return max(max(v.x, v.y), v.z);				}

// Repeat space along one axis.
float pMod(inout float p, float size) {
    float halfsize = size*0.5;
    float c = floor((p + halfsize)/size);
    p = mod(p + halfsize, size) - halfsize;
    return c;
}
// Repeat around the origin by a fixed angle.
float pModPolar(inout vec2 p, float repetitions) {
    float angle = 2.*PI/repetitions;
    float a = atan(p.y, p.x) + angle/2.;
    float r = length(p);
    float c = floor(a/angle);
    a = mod(a,angle) - angle/2.;
    p = vec2(cos(a), sin(a))*r;
    // For an odd number of repetitions, fix cell index of the cell in -x direction
    // (cell index would be e.g. -5 and 5 in the two halves of the cell):
    if (abs(c) >= (repetitions/2.)) c = abs(c);
    return c;
}

// A circle line. Can also be used to make a torus by subtracting the smaller radius of the torus.
float fCircle(vec3 p, float r) {
	float l = length(p.xz) - r;
	return length(vec2(p.y, l));
}
//@iq
float sdCap( vec3 p, float h, float r ){
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(h,r);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}
// Box: correct distance to corners
float fBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
}
// Book Of Shaders - timing functions
float linearstep(float begin, float end, float t) {
    return clamp((t - begin) / (end - begin), 0.0, 1.0);
}

float easeOutCubic(float t) {
    return (t = t - 1.0) * t * t + 1.0;
}

float easeInCubic(float t) {
    return t * t * t;
}

vec3 getHue(float t){ 
    vec3 c = vec3(.15, .17, .8),
         d = vec3(.675,.25, .5),
         a = vec3(.45),
         b = vec3(.25);
    
    return a + b*cos( PI2*(c*t+d) ); 
}
float ga1,ga2,ga3,ga4,ga5,ga6,idz;
mat2 rt;

vec2 map(vec3 p) {
	vec2 res = vec2(100.,-1.);
    
    float d2 = p.y + 1.;
    if(d2<res.x) res = vec2(d2,1.);
    
    vec3 q = p-vec3(0,0,-4.);
   // pMod(q.z,3.);
    q.xz*=rt;
    float id = pModPolar(q.xz,10.);
	idz=id;
    if(mod(id,2.)<1.){
      q.y -= ga1+ga2+ga3;  
    } else {
      q.y -= ga4+ga5+ga3;  
    }

    q.x -= 6.25;
    
    float d = fBox(q,vec3(2.75,1.,.25));
    d = max(d,-fBox(q-vec3(0,0,.25),vec3(.8,.6,.1)));
    d = max(d,-fBox(q-vec3(0,.8,.25),vec3(.55,.1,.08)));
    
    q.x = abs(q.x);
    d = max(d,-sdCap(q.xzy-vec3(2.5,.25,.8),.15,.11));
    d = max(d,-sdCap(q.xzy-vec3(1.8,.25,0.),.8,.15));
	if(d<res.x) res = vec2(d,2.);
    
    //buttons
    float bt = min(
        fBox(q-vec3(.1,-.75,.2+(ga1*.1)),vec3(.075,.1,.1)),
        fBox(q-vec3(.3,-.75,.2+(ga2*.1)),vec3(.075,.1,.1))
    );
	float bd = min(
    	fBox(q-vec3(.5,-.75,.2+(ga3*.1)),vec3(.075,.1,.1)),
    	fBox(q-vec3(.7,-.75,.2+(ga4*.1)),vec3(.075,.1,.1))
   	);
    bt=min(bd,bt);
    //if(bt<res.x) res = vec2(bt,3.);
    
    //speakers
	d = fCircle(q.xzy-vec3(1.8,.25,0.),.8)-.05;
    d = min(fCircle(q.xzy-vec3(2.5,.25,.8),.15)-.03,d);
    d = min(sdCap(q.xzy-vec3(.76,.2,.8),.12,.12),d);
    d=min(bt,d);
    if(d<res.x) res = vec2(d,1.);

    return res;
}

vec2 marcher(vec3 ro, vec3 rd, int maxsteps) {
	float d = 0.;
    float m = -1.;
    for(int i=0;i<192;i++){
    	vec2 t = map(ro + rd * d);
        if(abs(t.x)<.0001||d>100.) break;
        d += t.x*.9;
        m  = t.y;
    }
	return vec2(d,m);
}

// Tetrahedron technique @iq
// https://www.iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 getNormal(vec3 p, float t){
    float e = t*MINDIST;
    vec2 h = vec2(1.,-1.)*.5773;
    return normalize( h.xyy*map( p + h.xyy*e).x + 
					  h.yyx*map( p + h.yyx*e).x + 
					  h.yxy*map( p + h.yxy*e).x + 
					  h.xxx*map( p + h.xxx*e).x );/**
    t *= .0002;
    vec2 e = vec2(t,0.);
    vec3 n = vec3(
        map(p+e.xyy).x-map(p-e.xyy).x,
        map(p+e.yxy).x-map(p-e.yxy).x,
        map(p+e.yyx).x-map(p-e.yyx).x
    );
    return normalize(n); */

}

//camera setup
vec3 camera(vec3 lp, vec3 ro, vec2 uv) {
    vec3 f=normalize(lp-ro),//camera forward
         r=normalize(cross(vec3(0,1,0),f)),//camera right
         u=normalize(cross(f,r)),//camera up
         c=ro+f*.75,//zoom
         i=c+uv.x*r+uv.y*u,//screen coords
         rd=i-ro;//ray direction
    return rd;
}

float getDiff(vec3 p, vec3 n, vec3 lpos) {
    vec3 l = normalize(lpos-p);
    float dif = clamp(dot(n,l),0. , 1.);
    
    float shadow = marcher(p + n * MINDIST * 2., l, 92).x;
    if(shadow < length(p -  lpos)) dif *= .2;
 
    return dif; 
}

//@Shane low cost AO
float calcAO(in vec3 p, in vec3 n){
    float sca = 2., occ = 0.;
    for( int i = 0; i<5; i++ ){
        float hr = float(i + 1)*.16/5.; 
        // map(pos/dont record hit point)
        float d = map(p + n*hr).x;
        occ += (hr - d)*sca;
        sca *= .7;
        // Deliberately redundant line 
        // that may or may not stop the 
        // compiler from unrolling.
        if(sca>1e5) break;
    }
    return clamp(1. - occ, 0., 1.);
}

vec3 getStripes(vec2 uv){
    uv.x+=T*1.5;

    uv.y -= tan(radians(45.)) * uv.x;
    float sd = mod(floor(uv.y * 2.5), 2.);
    vec3 background = (sd<1.) ? vec3(.1) : vec3(.125);
    return background;
}

vec3 getColor(float m) {
    vec3 h = vec3(.75);
   	if(m != 1.) h = getHue(idz);
    
    return h;
}

void main() {
    rt = r2(T*.3);
	// time movments
    float tf = mod(T, 14.);
    // move x steps in rotation
    float t1 = linearstep(0.0, 1.0, tf);
    float t2 = linearstep(3.0, 4.0, tf);
    float a1 = easeInCubic(t1);
    float a2 = easeOutCubic(t2);
    
    float t3 = linearstep(5.0, 6.0, tf);
    float t4 = linearstep(7.0, 8.0, tf);
    float a3 = easeInCubic(t3);
    float a4 = easeOutCubic(t4);
    
    float t5 = linearstep(10.0, 11.0, tf);
    float t6 = linearstep(12.0, 13.0, tf);
    float a5 = easeInCubic(t5);
    float a6 = easeOutCubic(t6);
    
    ga1 = (a1-a2);
    ga2 = (a2-a3);
    ga3 = (a3-a4);
    ga4 = (a4-a5);
    ga5 = (a5-a6);
    ga6 = (a6-a1);
    
    // pixel screen coordinates
    vec2 uv = (gl_FragCoord.xy - R.xy*0.5)/R.y;
    vec3 C = vec3(0.);
    vec3 FC = vec3(.02);

    vec3 lp = vec3(0.,0.,0.);
    vec3 ro = vec3(0.,4.0,7.5);
   	
    vec3 rd = camera(lp,ro,uv);

    vec2 t = marcher(ro,rd, 128);
    float d = t.x;

    if(d<MAXDIST){
    	vec3 p = ro + rd * d;
        vec3 n = getNormal(p,d);

        vec3 lpos  = vec3(-2.0,5., 5.3); 
 		vec3 lpos2  = vec3(2.5,6., -5.3); 
    	float dif = getDiff(p,n,lpos);
        	  dif+= getDiff(p,n,lpos2);
  		float ao = calcAO(p, n);
        vec3 h = getColor(t.y);
        C += dif*h*ao;

        vec3 rr=reflect(rd,n); 
        vec2 tr = marcher(p+n*.003,rr,128);
  
        if(tr.x<MAXDIST){
            p += rr*tr.x;
            n = getNormal(p,tr.x);
            dif = getDiff(p,n,lpos);
            dif+= getDiff(p,n,lpos2);
            h = getColor(tr.y);
            C += dif*h;
        } 
    }
  
    C = mix( C, vec3(.3)*getStripes(uv*8.), 1.-exp(-0.0003*t.x*t.x*t.x));
    gl_FragColor = vec4(pow(C, vec3(0.4545)),1.0);
}
