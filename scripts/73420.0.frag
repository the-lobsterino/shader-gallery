#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_DIST 	75.
#define R 			resolution
#define M 			mouse
#define T 			time
#define S 			smoothstep
#define r2(a)  mat2(cos(a), sin(a), -sin(a), cos(a))

#define PI2			6.28318530718
#define PI			3.14159265358

float hash2(vec2 p){  return fract(sin(dot(p, vec2(27.609, 57.583)))*43758.5453); }

vec3 get_mouse( vec3 ro ) {
    float x = -.12;
    float y = .3*sin(T*.2);
    ro.zy *= r2(x);
    ro.zx *= r2(y);
    return ro;
}

vec3 hue(float t){ 
    vec3 c = vec3(.65, .5, .35),
         d = vec3(.5, .25, .35),
         a = vec3(.45),
         b = vec3(.35);
    return a + b*cos( PI2*(c*t+d) ); 
}

float sdBox( vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

//http://mercury.sexy/hg_sdf/
float angle,angle2,rep2,rep=3.;
float pModPolar(inout vec2 p) {
	float a = atan(p.y, p.x) + angle2;
	float r = length(p);
	float c = floor(a/angle);
	a = mod(a,angle) - angle2;
	p = vec2(cos(a), sin(a))*r;
	if (abs(c) >= (rep2)) c = abs(c);
	return c;
}

// lazy globals
vec4 hextiles;
vec3 hitPoint =vec3(0.);
float tRnd;

vec4 map(in vec3 uv) {
    vec2 res = vec2(1e5,0.);

    float scale = .7;
    uv.x-= 120.+T*.5;
    
    float py = uv.y*scale;
	vec2 p = uv.xz*scale;

    const vec2 s = vec2(sqrt(3.), 1.);

    vec4 hC = floor(vec4(p, p - vec2(1, .5))/s.xyxy) + .5;

    vec4 h4 = vec4(p - hC.xy*s, p - (hC.zw + .5)*s);
    h4 = dot(h4.xy, h4.xy)<dot(h4.zw, h4.zw) ? vec4(h4.xy, hC.xy) : vec4(h4.zw, hC.zw + .5);

    p = h4.xy; vec2 id = h4.zw;

    hextiles=h4;
 
    float rnd = hash2(id.xy);
    tRnd=rnd;
    if(rnd>.5) p *= r2(60.*PI/180.);

    vec2 p0 = p - vec2(-.5/1.732, .5);
    vec2 p1 = p - vec2(.8660254*2./3., 0);
    vec2 p2 = p - vec2(-.5/1.732, -.5);

    float land = uv.y-.06;
    if(land<res.x) {
        res = vec2(land,1.);  
        hitPoint = vec3(p.x, py, p.y);
    }
    vec3 ts = vec3(.11,.55,.11);
    float truch = sdBox(vec3(p.x, py, p.y),ts); 

    if(truch<res.x) {
        res = vec2(truch,3.);  
        hitPoint = vec3(p.x, py, p.y);
    }
    
    return vec4(res, h4.xy);
}

vec3 get_normal(in vec3 p, in float t) {
    t*=.001;
    float d = map(p).x;
    vec2 e = vec2(t,0);
    vec3 n = d - vec3(
    map(p-e.xyy).x,
    map(p-e.yxy).x,
    map(p-e.yyx).x
    );
    return normalize(n);
}

vec4 ray_march( in vec3 ro, in vec3 rd, int maxstep ) {
    float t = 0.001;
    vec3 m = vec3(0.);
    for( int i=0; i<192; i++ ) {
        vec4 d = map(ro + rd * t);
        m = d.yzw;
        if(d.x<.0001*t) break;
        t += d.x*.75;
        if(t>MAX_DIST) break;
    }
    return vec4(t,m);
}

float get_diff(in vec3 p, in vec3 lpos, in vec3 n) {
    vec3 l = lpos-p;
    vec3 lp = normalize(l);
    float dif = clamp(dot(n,lp),0. , 1.),
          shadow = ray_march(p + n * 0.0002 * 2.,lp,128).x;
    if(shadow < length(l)) dif *= .2;
    return dif;
}

vec3 get_hue(float rnd) {
    return .5 + .46*cos(2.23*rnd + vec3(2.15, 1.25, 1.5));
}

vec3 get_color(float m, in vec3 p, in vec3 n) {
    vec3 h = vec3(.15);
    float rnd = hash2(hextiles.zw*2.);
    vec3 hue = get_hue(2.23*rnd);
    vec3 tone = get_hue(3.25);

    if(m==1.) {
        h = vec3(.06);
        float hex = abs(max(abs(hextiles.x)*.8660254 + abs(hextiles.y)*.5, abs(hextiles.y)) - .5) - .01;
        float rnd = hash2(hextiles.zw*2.);
        
        float vt = (sin(3.*rnd+T*.75)*.05+.07);
        hex=abs(abs(hex)-.03-vt)-.001;

        // see hex tiles
        h = mix(h, tone, 1.-S(.01, .012, hex));
        float cir = length(abs(hextiles.xy)-.01)-.15;
        float cir2 = length(abs(hextiles.xy)-.01)-.16;

        //mixdown
        
        h= mix(h,vec3(1),1.-S(.01,.011,cir2));
        h= mix(h,tone,1.-S(.01,.011,cir));
    }
    if(m==2.) {
        vec2 qp = hextiles.xy;
        float dir = tRnd <.5 ? -1. : 1.;
        if(tRnd>.5) qp *= r2(60.*PI/180.); 
        vec3 d3, a3;
        vec2 p0 = qp - vec2(-.5/1.732, .5);
        vec2 p1 = qp - vec2(.8660254*2./3., 0);
        vec2 p2 = qp - vec2(-.5/1.732, -.5);
		//could prob pack both into one but
        //first time and all
        d3 = vec3(length(p0), length(p1), length(p2));
        d3 = abs(d3 - 1.732/6.) - .125;
			
        a3.x = atan(p0.x, p0.y);
        a3.y = atan(p1.x, p1.y);
        a3.z = atan(p2.x, p2.y);
		// get closest
        vec2 da = d3.x<d3.y && d3.x<d3.z? vec2(d3.x, a3.x) : d3.y<d3.z? vec2(d3.y, a3.y) : vec2(d3.z, a3.z);
        float d = da.x;
        float a = abs(fract(da.y/6.2831*6. + T*dir) - .5)*2. - .5;
       // a = max(d + .08, a/6.2831);   
        h = mix(vec3(.05,.15,0.15), vec3(.1,.3,.3), 1. - smoothstep(0.01, .02, a));   
    }
    if(m==3.) {
     	float rnd = hash2(hextiles.zw*1.5); 
        h = .5 + .46*cos(2.23*rnd + vec3(2.15, 1.25, 1.5)); 
    }

    return h;
}

vec3 ACESFilm(vec3 x) {
    float a = 2.51,
          b = 0.03,
          c = 2.43,
          d = 0.59,
          e = 0.14;
    return clamp((x*(a*x + b)) / (x*(c*x + d) + e), 0.0, 1.0);
}

void main() {
	
	vec2 F = gl_FragCoord.xy;
    vec2 U = (2.*F.xy-R.xy)/max(R.x,R.y);
    vec3 ro = vec3(0.,1.+.5+.5*sin(T*.2),1.6),
         lp = vec3(0.,.4,.0);

     ro = get_mouse(ro);
    vec3 cf = normalize(lp-ro),
     	 cp = vec3(0.,1.,0.),
     	 cr = normalize(cross(cp, cf)),
     	 cu = normalize(cross(cf, cr)),
     	 c = ro + cf * .75,
     	 i = c + U.x * cr + U.y * cu,
     	 rd = i-ro;

    vec3 C = vec3(0.);
	// trace dat map
    vec4 ray = ray_march(ro,rd,256);
    float t = ray.x;
	float m = ray.y;

    if(t<MAX_DIST) {
		vec3 p = ro + t * rd,
             n = get_normal(p, t),
             h = get_color(m,p,n);
        vec3 lpos1 = vec3(.5, 15.0, -.5),
             lpos2 = vec3(1.75,11.,6.5),
             diff =  vec3(1.) * get_diff(p, lpos1, n) + get_diff(p, lpos1, n);

        C += h * (diff);
        
        if(m!=1.){
         	vec3 rr = reflect(rd,n);   
         	vec4 ref = ray_march(p,rr,256);
            float j =ref.x;
            if(j<MAX_DIST) {
                p+=j*rr;
                n = get_normal(p,j);
                h = get_color(ref.y,p,n);
                diff =  vec3(1.) * get_diff(p, lpos1, n) + get_diff(p, lpos1, n);
                C += h * (diff);
                C = mix( C, vec3(.125), 1.-exp(-.005*j*j*j));
            }
        }
        
    } else {
      C += vec3(.025);
    }
    
    C = mix( C, vec3(.125), 1.-exp(-.005*t*t*t));
	C = ACESFilm(C);
    gl_FragColor = vec4(pow(C, vec3(0.4545)),1.0);


}