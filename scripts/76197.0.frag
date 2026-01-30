/*
 * Original shader from: https://www.shadertoy.com/view/fsGXzc
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

// --------[ Original ShaderToy begins here ]---------- //
// "Screen Space Curvature Shader" by Evan Wallace:
// http://madebyevan.com/shaders/curvature/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Change shading type
#define CURVATURE 0
#define METAL 0
#define RED_WAX 1


// Shoe Model from my shader.
// "A man from 'A LOST MEMORY'" by iYOYi:
// https://www.shadertoy.com/view/Ws3yW4
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

#define PI 3.14159265
#define TAU (2.0*PI)
#define saturate(x) clamp(x, 0.0, 1.0)

#define MIN_DIST 0.001
#define MAX_DIST 30.0
#define ITERATION 100

#define SHOW_ANIM 0
vec3 ro = vec3(0), rd = vec3(0), camup = vec3(0.);

// Cheap Rotation by las:
// http://www.pouet.net/topic.php?which=7931&page=1
#define R(p, a) p=cos(a)*p+sin(a)*vec2(p.y,-p.x)
vec3 rot(vec3 p,vec3 r){
    R(p.xz, r.y);
    R(p.yx, r.z);
    R(p.zy, r.x);
    return p;
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float fbm(vec2 n, int rep){
    float sum = 0.0;
    float amp= 1.0;
    for (int i = 0; i <1; i++){
        sum += noise(n) * amp;
        n += n*4.0;
        amp *= 0.25;
    }
    return sum;
}

// SDF functions by iq and HG_SDF
// https://iquilezles.org/www/articles/distfunctions/distfunctions.htm
// https://mercury.sexy/hg_sdf/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
float vmax(vec3 v){
    return max(max(v.x, v.y), v.z);
}

float sdBox( in vec2 p, in vec2 b ) {
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float sdEllipsoid(in vec3 p, in vec3 r) {
    return (length(p/r)-1.0)*min(min(r.x,r.y),r.z);
}

float sdCappedTorus(vec3 p, vec2 r, float per) {
    p.x = abs(p.x);
    vec2 sc = vec2(sin(per),cos(per));
    float k = (sc.y*p.x>sc.x*p.z) ? dot(p.xz,sc) : length(p.xz);
    return sqrt( dot(p,p) + r.x*r.x - 2.0*r.x*k ) - r.y;
}

float sdBox(vec3 p,vec3 b) {
    vec3 d=abs(p)-b;
    return length(max(d,vec3(0)))+vmax(min(d,vec3(0.0)));
}

float fOpUnion(in float a,in float b) {
    return a<b?a:b;
}

vec4 v4OpUnion(in vec4 a,in vec4 b) {
    return a.x<b.x?a:b;
}

float fOpUnionSmooth(float a,float b,float r) {
    vec2 u = max(vec2(r - a,r - b), vec2(0));
    return max(r, min (a, b)) - length(u);
}

float fOpSubstraction(in float a,in float b) {
    return max(-a, b);
}

float fOpSubstractionSmooth( float a,float b,float r) {
    vec2 u = max(vec2(r + b,r + -a), vec2(0));
    return min(-r, max (b, -a)) + length(u);
}

void pElongate(inout float p, in float h ) {
    p = p-clamp(p,-h,h);
}

float sdFoot(vec3 p) {
	float d = MAX_DIST;
	float bsd = length(p), bsr=0.2500;
	if (bsd > 2.*bsr) return bsd-bsr;
    
	vec3 cpFoot = p;
	{
		vec3 q = cpFoot;
#if SHOW_ANIM
        float patapata = -q.z*(sin(iTime*5.)*.5+.05)+cos(iTime*5.)*.5;
#else
        float patapata = -.3;
#endif
        q.yz*=mat2(cos(-q.z*1.25+patapata+vec4(0,11,33,0)));
        cpFoot=q;
	}
	vec3 cpFoot_Main = cpFoot;
	cpFoot_Main.xyz += vec3(0.0000, 0.0000, 0.1273);
	pElongate(cpFoot_Main.y, 0.0125);
	{
		vec3 q=cpFoot_Main;
        vec3 pq=q;pq.yz *= mat2(cos(.6 + vec4(0, 11, 33, 0)));
        float ycl = smoothstep(.002,.2,q.y);
        float zcl = 1.-smoothstep(-.2,.5,q.z);
        float zcl2 = smoothstep(-.2,.0,q.z);
        q.z+=fbm(vec2(pq.x*20.5,pq.y*80.), 1)*.075*ycl*zcl*zcl2;
        cpFoot_Main=q;
	}

    // Shoe
    float d1,d2;
	d1 = sdEllipsoid(rot(cpFoot_Main+vec3(-0.0005, 0.0274, 0.1042), vec3(0.0818, -0.6861, 0.0566)), vec3(0.1102, 0.1233, 0.1214));
	d1 = fOpUnionSmooth(sdEllipsoid(rot(cpFoot_Main+vec3(0.0028, -0.0093, -0.1258), vec3(-0.0291, -0.2744, -0.0364)), vec3(0.0870, 0.2295, 0.0880)), d1, 0.1438);
	d1 = fOpSubstractionSmooth(sdBox(cpFoot_Main+vec3(0.0000, 0.1085, 0.0000), vec3(0.1676, 0.1089, 0.2519)), d1, 0.0080);
	d1 = fOpSubstractionSmooth(sdBox(cpFoot+vec3(0.0000, -0.194, 0.0019), vec3(0.1676, 0.0551, 0.1171)), d1, 0.0100);
	d1 = fOpSubstraction(sdBox(rot(cpFoot+vec3(0.0000, 0.0171, 0.1521), vec3(-1.4413, 0.0000, 0.0000)), vec3(0.1676, 0.0912, 0.0116)), d1);
	d1 = fOpUnionSmooth(sdCappedTorus(cpFoot+vec3(0.0028, -0.1578, 0.0014), vec2(0.0519, 0.0264), 3.1413), d1, 0.0100);
	
	// Shoe lace
	d2 = sdCappedTorus(rot(cpFoot+vec3(0.0000, -0.0579, 0.1827), vec3(1.5708, 0.0000, 0.0000)), vec2(0.0636, 0.0064), 0.6283);
	d2 = fOpUnion(sdCappedTorus(rot(cpFoot+vec3(0.0000, -0.1001, 0.0608), vec3(2.2401, -0.3407, 0.2843)), vec2(0.0636, 0.0064), 0.6283), d2);
	d2 = fOpUnion(sdCappedTorus(rot(cpFoot+vec3(0.0000, -0.0639, 0.1321), vec3(1.7335, 0.4446, -0.0513)), vec2(0.0636, 0.0064), 0.6283), d2);
	d2 = fOpUnion(sdCappedTorus(rot(cpFoot+vec3(0.0000, -0.1001, 0.0608), vec3(2.2463, 0.3180, -0.2669)), vec2(0.0636, 0.0064), 0.6283), d2);
	d2 = fOpUnion(sdCappedTorus(rot(cpFoot+vec3(0.0000, -0.0639, 0.1321), vec3(1.7334, -0.4468, 0.0515)), vec2(0.0636, 0.0064), 0.6283), d2);
	
	return min(d1,d2);
}

float sdScene(vec3 p) {
    return sdFoot(p);
}

float intersect() {
    float d = MIN_DIST;

    for (int i = 0; i < ITERATION; i++) {
        vec3 p = ro + d * rd;
        float res = sdScene(p);
        res*=.5;
        if (abs(res) < MIN_DIST)break;
        d += res;
        if (d >= MAX_DIST) return MAX_DIST;
    }
    if(d>MAX_DIST) return MAX_DIST;
    return d;
}

vec3 normal(vec3 p) {
    float h = 0.0005;
    vec2 e = 0.5773 * vec2(1., -1.); 
    return normalize(
        e.xyy * sdScene(p + e.xyy * h) + 
        e.yyx * sdScene(p + e.yyx * h) + 
        e.yxy * sdScene(p + e.yxy * h) + 
        e.xxx * sdScene(p + e.xxx * h));
}

// Camera localized normal
vec3 localNormal(vec3 p) {
    vec3 n = normal(p), ln;
    vec3 up = camup;
    vec3 side = cross(rd, up);
    return vec3(dot(n,  side), dot(n,  up), dot(n,  -rd));
}

// "camera": create camera vectors.
void camera(vec2 uv) {
    const float pY = .5;
    const float cL = 10.;
    const vec3 forcus = vec3(0,.08,-.137);
    const float fov = .015;

    vec3 up = vec3(0,1,0);
    vec3 pos = vec3(0,0,0);
    pos.xz = vec2(sin(iTime*.6),cos(iTime*.6))*cL;
    if(iMouse.z>.5)
        pos.xz = vec2(sin(iMouse.x/iResolution.x*TAU),cos(iMouse.x/iResolution.x*TAU))*cL;
    vec3 dir = normalize(forcus-pos);
    vec3 target = pos-dir;
    vec3 cw = normalize(target - pos);
    vec3 cu = normalize(cross(cw, up));
    vec3 cv = normalize(cross(cu, cw));
	camup = cv;
    mat3 camMat = mat3(cu, cv, cw);
    rd = normalize(camMat * normalize(vec3(sin(fov) * uv.x, sin(fov) * uv.y, -cos(fov))));
    ro = pos;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv = (uv*2.-1.);
    uv.x *= iResolution.x / iResolution.y;

    camera(uv);
    float hit = intersect();
    vec3 p = ro + hit * rd;

    vec3 n = localNormal(p);
    float depth = distance(ro, p)/MAX_DIST;
    
    vec3 w = vec3(3e-6); // idk that proper method for sampling neighbor pixels, so this lazy way...
    
    // I've mostly just copied and pasted Evan's code.
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Compute curvature
	vec3 dx = localNormal(p+vec3(-1,0,0)*w) - localNormal(p+vec3(+1,0,0)*w); // diff
	vec3 dy = localNormal(p+vec3(0,-1,0)*w) - localNormal(p+vec3(0,+1,0)*w); // diff
	vec3 xneg = n - dx;
	vec3 xpos = n + dx;
	vec3 yneg = n - dy;
	vec3 ypos = n + dy;
	float curvature = (cross(xneg, xpos).y - cross(yneg, ypos).x) * 4.0 / (depth*-.05); // diff

	// Compute surface properties
    #if CURVATURE
        vec3 light = vec3(0.0);
        vec3 ambient = vec3(curvature + 0.5);
        vec3 diffuse = vec3(0.0);
        vec3 specular = vec3(0.0);
        float shininess = 0.0;
    #elif METAL
        float corrosion = clamp(-curvature * 3.0, 0.0, 1.0);
        float shine = clamp(curvature * 5.0, 0.0, 1.0);
        vec3 light = normalize(vec3(0.0, 1.0, 10.0));
        vec3 ambient = vec3(0.15, 0.1, 0.1)*.5;
        vec3 diffuse = mix(mix(vec3(0.3, 0.25, 0.2), vec3(0.45, 0.5, 0.5), corrosion),
        vec3(0.5, 0.4, 0.3), shine) - ambient;
        vec3 specular = mix(vec3(0.0), vec3(1.0) - ambient - diffuse, shine);
        float shininess = 128.0;
    #elif RED_WAX
        float dirt = clamp(0.25 - curvature * 4.0, 0.0, 1.0);
        vec3 light = normalize(vec3(0.0, 1.0, 10.0));
        vec3 ambient = vec3(0.05, 0.015, 0.0);
        vec3 diffuse = mix(vec3(0.4, 0.15, 0.1), vec3(0.4, 0.3, 0.3), dirt) - ambient;
        vec3 specular = mix(vec3(0.15) - ambient, vec3(0.0), dirt);
        float shininess = 32.0;
    #endif
    
    // Compute final color
    float cosAngle = dot(n, light);
    fragColor.rgb = ambient +
    diffuse * max(0.0, cosAngle) +
    specular * pow(max(0.0, cosAngle), shininess);
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    fragColor.rgb = pow(fragColor.rgb*1.5, vec3(.9));
    if(depth>.9) fragColor.rgb = vec3(.125);
	fragColor.a = 1.;
}


// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}