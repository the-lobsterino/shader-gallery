#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
 
#define MAX_DIST 	  85.
#define MIN_DIST 	  .0001
#define MAX_STEPS   225

#define PI  		3.1415926
#define PI2 		6.2831853
// Noise from @iq - https://www.shadertoy.com/view/Msf3WH
// check and swap with some other noise functions.
vec2 hash2( vec2 p ) {
	p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise2( in vec2 p ) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

	  vec2  i = floor( p + (p.x+p.y)*K1 );
    vec2  a = p - i + (i.x+i.y)*K2;
    float m = step(a.y,a.x); 
    vec2  o = vec2(m,1.0-m);
    vec2  b = a - o + K2;
	  vec2  c = a - 1.0 + 2.0*K2;
    vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	  vec3  n = h*h*h*h*vec3( dot(a,hash2(i+0.0)), dot(b,hash2(i+o)), dot(c,hash2(i+1.0)));
    return dot( n, vec3(75.3) );
}

mat2 r2( float a ) { 
  float c = cos(a); float s = sin(a); 
  return mat2(c, s, -s, c); 
}
  
float box( vec3 p, vec3 b ) {
  	vec3 d = abs(p) - b;
  	return length(max(d,0.0)) + min(max(d.x,max(d.y,d.z)),0.0);
} 
  
vec3 map(in vec3 pos) {
    float size = 20.;
	  float rep_half = size/2.;
    float h = 35.;
 	  vec3 res = vec3(1.,0.,.0);
  	vec3 p = pos-vec3(0., 0., 0.);
    vec3 pi = p;
    vec3 q = p;
    vec3 pr = vec3(
        floor((p + rep_half)/size)
    );

    float speed = time *1.5; 
    pi.y -= speed;

    float n = noise2(vec2(pi.x * .3,pi.z * .4));
    float n3 = noise2(vec2(pi.y * .4,pi.x * .3));

    float n2 = n;
    n *= n3;
    float n4 = n2 + n3;
    float ring2 = .5 -(2.15 * n4);
	  float ring1 = .5 -(2.15 * n);
    float dx = clamp(.3,1.,ring1);
    float dz = dot(n4,ring2);

    vec2 w = vec2( dx, abs(p.y) - h );
    float d1 = min(max(w.x,w.y),0.0) + length(max(w,0.0));
  
    float d2 = box(q,vec3(10.));
    d1 = max(d2,d1);
  
    float wv = .7 + .7 * sin(time*1.3);
    float cutout = length(pos)-10.+wv;
    d1 = max(d1,-cutout) * .25;
	  res = vec3(d1,n,3.);

    float wc = wv * .75;
    w = vec2( dz, abs(p.y) - 6. );
    float d4 = min(max(w.x,w.y),0.0) + length(max(w,0.0));
    float d5 = max(length(pos)-6.+wc,d4);
	  if(d5<res.x)res = vec3(d5,n4,2.);
  
  	return res;
}

vec3 get_normal(in vec3 p) {
	float d = map(p).x;
    vec2 e = vec2(.01,.0);
    vec3 n = d - vec3(
        map(p-e.xyy).x,
        map(p-e.yxy).x,
        map(p-e.yyx).x
    ); 
    return normalize(n);
}

vec3 ray_march( in vec3 ro, in vec3 rd ) {
    float depth = 0.;
    float m = 0.;
    float n = 1.;
    vec3 pos = ro;
    for (int i = 0; i<MAX_STEPS;i++) {
        vec3 dist = map(pos);
        m = dist.z;
        if(m==3.){
            depth += max(abs(dist.x*.5), MIN_DIST);
        } else if(m==2.){
            n = min(n, 0.5*dist.x/0.12);
            depth += max(abs(dist.x*.2), MIN_DIST);
        } else {
            depth += abs(dist.x)*.25;
           // if(depth>MAX_DIST || dist.x<MIN_DIST) break;
        }
        
        pos = ro + depth * rd;
       	
    }
    return vec3(depth,n,m);
}

float get_diff(vec3 p, vec3 lpos) {
    vec3 l = normalize(lpos-p);
    vec3 n = get_normal(p);
    float dif = clamp(dot(n,l),0. , 1.);
    
    float shadow = ray_march(p + n * MIN_DIST * 2., l).x;
    if(shadow < length(p -  lpos)) {
       dif *= .2;
    }
    return dif;
}

vec3 render( in vec3 ro, in vec3 rd, in vec2 uv) {
    vec3 color = vec3(0.);
    vec3 fadeColor = vec3(.02,.02,.01);
    vec3 ray = ray_march(ro, rd);
    float t= ray.x;
    float m;
    float n = ray.y;
    if(t<MAX_DIST) {
        m = ray.z;
        vec3 p = ro + t * rd;

        vec3 lpos1 = vec3(0.3, .5, -.1);
        vec3 lpos2 = vec3(0.,34.0, -2.);
        vec3 diff1 = vec3(.8) * get_diff(p, lpos1);
        vec3 diff2 = vec3(.8) * get_diff(p, lpos2);
        vec3 diff  = diff1+diff2;
  	vec3 shade = vec3(1.5-t*.005); 
	vec3 mate = vec3(.8);
        if(m == 1.) {
          mate=vec3(.5);
        }
        if(m == 2.) {
          color = smoothstep(.0,1.,shade)* vec3(2.,.6,0.); 
        }
        if(m == 3.) {
          color = smoothstep(.0,1.,shade)* vec3(2.,0.,.6-uv.y); 
        }
        color += mate * diff;
    } else {
      color += fadeColor;
    }
  
    color = mix( color, fadeColor, 1.-exp(-0.000045*t*t*t));
    return pow(color, vec3(0.4545));
}

vec3 ray( in vec3 ro, in vec3 lp, in vec2 uv ) {
    // set vectors to solve intersection
    vec3 cf = normalize(lp-ro);
    vec3 cp = vec3(0.,1.,0.);
    vec3 cr = normalize(cross(cp, cf));
    vec3 cu = normalize(cross(cf, cr));
    // center of the screen
    vec3 c = ro + cf * 1.;
    vec3 i = c + uv.x * cr + uv.y * cu;
    // intersection point
    return i-ro; 
}

void main( ) {
    vec2 uv = (2.*gl_FragCoord.xy-resolution.xy)/
        max(resolution.x,resolution.y);
    //float sw = 8.+8.*sin(time*.1);
    vec3 ro = vec3(0.,8.,-25.);
    vec3 lp = vec3(0.,0.,0.);
    ro.xy *=r2(time*.2);
    vec3 rd = ray(ro, lp, uv);
    vec3 color = render(ro, rd, uv);
    vec3 overlay = vec3(0.);
    // Output to screen
  
    gl_FragColor = vec4(color,1.0);
}