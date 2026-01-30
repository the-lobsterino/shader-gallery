/* 
 * Original shader from: https://www.shadertoy.com/view/tlffRX
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// Emulate a black texture
#define texture(s, uv) vec4(0.75)

// --------[ Original ShaderToy begins here ]---------- //
/**
	Fractal Exploration Part 2 | pjkarlik
	More like an Apollonian fractal - td1/3 vector offsets
	
	Fun using the procedural palettes with a floor to get some bands.
	This is my adaptation of them but read below..
	https://www.iquilezles.org/www/articles/palettes/palettes.htm

	texture just added for effect/feel..
*/

#define PI          3.1415926
#define PI2         6.2831853

#define R       iResolution
#define M       iMouse
#define T       iTime

#define r2(a) mat2(cos(a),sin(a),-sin(a),cos(a))
#define hue(a) .45 + .42*cos(floor(2.4*a) * vec3(1.15,.65,.45));

vec3 getMouse(vec3 p) {
    float x = M.xy == vec2(0) ? 0. : (M.y/R.y * 1. - .5) * PI;
    float y = M.xy == vec2(0) ? 0. : (M.x/R.x * 1. - .5) * PI;
    p.zy *=r2(x);
    p.xz *=r2(y);
    return p;
}

float orbit = 0.;
vec3 hp;
vec2 map(vec3 p) {

    float md6 = 1.28;
    float td1 = 0.5, td2 = .6, td3 = 1.15;
    
    float p0 = 1.2;
	p += vec3(0.,2.96,.0);
    vec4 z = vec4(p,4.4);
    
    for (int i = 0; i < 4; i++) {
        z.xyz=clamp(z.xyz, -p0, p0)*2.0-z.xyz;
        z*=((md6))/max(dot(z.xyz, z.xyz), 0.05);
    }
    z.x=abs(z.x)-1.5;
    orbit = log2(z.w*.01);
    float d = (length(max(abs(z.xyz)-vec3(td1,td2,td3),0.0)))/z.w;
 	hp=z.xyz;
    return vec2(d/.75,orbit);
}

vec2 marcher(vec3 ro, vec3 rd) {
    float t = .0001,
          m = -1.;
    for(int i=0; i<256; i++) {
        vec2 d = map(ro + t * rd);
        if(abs(d.x) <.0001) return vec2(t,m);
        t+=d.x*.8;
        m=d.y;
        if(t>30.) return vec2(31.,-1.);
    }
    return vec2(31.,-1.);
}

vec3 getNormal(vec3 p, float t){
    t*= .00015;
    vec2 e = vec2(t,0.);
    vec3 n = vec3(
        map(p + e.xyy).x - map(p - e.xyy).x,
        map(p + e.yxy).x - map(p - e.yxy).x,
        map(p + e.yyx).x - map(p - e.yyx).x
    );
    return normalize(n);
}

vec3 camera(vec3 lp, vec3 ro, vec2 uv) {
     vec3 cf = normalize(lp-ro),
          cr = normalize(cross(vec3(0.,1.,.0),cf)),
          cu = normalize(cross(cf,cr)),
          c  = ro + cf * .95,
          i  = c+ uv.x * cr + uv.y * cu,
          rd = i -ro;
    return rd;
}

float getDiff(vec3 p, vec3 lpos, vec3 n) {
    vec3 l = normalize(lpos-p);
    float dif = clamp(dot(n,l),0. , 1.);
    
    float shadow = marcher(p + n * .0001 * 2., l).x;
    if(shadow < length(p -  lpos)) dif *= .15;
    return dif;
}

float aoc(vec3 pos, vec3 nor) {
    float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<10; i++ ) {
        float r = 0.01 + 0.1*float(i);
        vec3 aopos =  nor * r + pos;
        float d = map( aopos ).x;
        occ += (r - d)*sca;
        sca *= 0.45;
    }
    return clamp( 1.0 - occ / 3.14, 0.0, 1.0 );    
}

void mainImage( out vec4 O, in vec2 F ){
    vec2 uv = (2.*F.xy-R.xy)/max(R.x,R.y);
    
    vec3 C = vec3(0);
    vec3 fC = hue(1.);
    
    float alt = mod(T*.05,2.);
    float zm = alt<1. ? .32 : .14;
    
    vec3 lp = vec3(0.,0.,0.),
         ro = vec3(0.,.08,zm);
    
    //uncomment to pan around
        // ro = getMouse(ro);
    
    ro.xz *=r2(T*.1);
    ro.xy *=r2(.12*sin(T*.2));
    
    vec3 rd = camera(lp,ro,uv);

    vec2 ray = marcher(ro,rd);
    float d = ray.x;
    float m = ray.y;
    
    if(d<30.){ 
        vec3 p = ro + rd * d;
        vec3 lpos = vec3(-.5,.84,-.75);
        vec3 lpos2 = vec3(.85,.75,.65);
        //vec3 lnor = normalize(lpos);
        vec3 nor = getNormal(p, d);
        vec3 dif = vec3(1.) * getDiff(p, lpos, nor);
             dif += vec3(1.) * getDiff(p, lpos2, nor);
        float acc = aoc(p, nor);
        vec3 h = hue(m);
        C += dif * h * acc;  
    }
    C = mix( C, fC, 1.-exp(-.04*d*d*d));
    // Output to screen
    C *=vec3(texture(iChannel0,uv)).x;
    O = vec4(pow(C, vec3(0.4545)),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}