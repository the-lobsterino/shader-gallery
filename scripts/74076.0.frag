/*
Original shader from https://www.shadertoy.com/view/flBXRz
*/

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 cameraPos = vec3(0., 10., -13.5);
float softShadow = 10.;
float depthmax = 80.; 
const float eps = 0.0001;
vec3 backcol = vec3(.6,.7,1.);
float inf = 1e20;
float pi=3.14159265;

#define UI0 1597334673U
#define UI1 3812015801U
#define UI2 uvec2(UI0, UI1)
#define UI3 uvec3(UI0, UI1, 2798796415U)
#define UIF (1.0 / float(0xffffffffU))

//additioanal operations
struct point {
    vec2 p;
    vec3 c;
};
float torusDist(vec2 a, vec2 b) {
    a = abs(a - b);
    return length(min(abs(a), abs(1. - a)));
}
mat2 ro (float a) {
	float s = sin(a), c = cos(a);
    return mat2(c,-s,s,c);
}

//SDF operations
vec4 cun(vec4 d1, vec4 d2){
    return d1.w<d2.w?d1:d2;
}
//SDF
float torus(vec3 p, vec3 p0, float RL, float RS) {
    p -= p0;
    vec3 h = vec3(0., p.y, 0.);
    vec3 v = p - h;
    return sqrt(pow(length(v) - RL, 2.) + p.y * p.y) - RS;
}
float box(vec3 b, vec3 p){
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}
//color functions
bool cb3(vec3 p){
    vec3 d = floor(p);
    return mod(d.x+d.y+d.z,2.)==0.;
}
vec2 torusCoordinate(vec3 p, vec3 p0, float RL) {
    p -= p0;
    float phi = atan(p.z, p.x) / pi;
    float theta = atan(p.y, length(p.xz) - RL) / pi;
    return vec2(phi+1., theta + 1.) / 2.;
}
const int S = 8;
vec3 torusColor(vec2 uv) {
    uv = mod(uv, 1.);
    point centers[S];
    centers[0] = point(vec2(0., 0.), vec3(0., 0., 0.));
    centers[1] = point(vec2(.7, .7), vec3(0., 0., 1.));
    centers[2] = point(vec2(.3, .6), vec3(0., 1., 0.));
    centers[3] = point(vec2(.2, .2 + .1*sin(time)), vec3(0., 1., 1.));
    centers[4] = point(vec2(.25 + .1 * cos(time+1.), .4), vec3(1., 0., 0.));
    centers[5] = point(vec2(.4, .4), vec3(1., 0., 1.));
    centers[6] = point(vec2(.5, .3), vec3(1., 1., 0.));
    centers[7] = point(vec2(.1, .5 + .3 * cos(time)), vec3(1., 1., 1.));
    
    float md = 1e20;
    vec3 col = vec3(1.);
    for(int i = 0; i < S; i++) {
        float d = torusDist(uv, centers[i].p);
        if(d < md) {
            md = d;
            col = centers[i].c;
        }
    }
    return col;
}

//scene SDF
vec4 map(vec3 p){
    vec4 d0 = vec4(1.,1.,1.,-box(vec3(20.,20.,20.),p-vec3(0.,20.,0.)));
    d0.xyz*=cb3(p)?1.:.8;
    float t=time/5.;
    mat2 m = mat2(cos(t),sin(t),-sin(t),cos(t));
    p.yz*=m;
    vec2 uv = torusCoordinate(p, vec3(0., 6., 0.), 5.);
    vec4 d = vec4(torusColor(uv), torus(p, vec3(0., 6., 0.), 5., 1.5));
    d0 = cun(d0,d);    
    return d0;
}
//normals
vec3 norm(vec3 p){
    const vec2 e = vec2(eps,0.);
    float d = map(p).w;
    return normalize(vec3(
        map(p + e.xyy).w-d,
        map(p + e.yxy).w-d,
        map(p + e.yyx).w-d
    ));
}
// color of lighting for point
vec3 getLight(vec3 p, vec3 lp, vec3 n, vec3 lc, float po, bool mode){
    p += n * eps;
    vec3 ld=mode?lp:lp-p;
    float l = length(ld);ld/=l;
	float diff = dot(ld,n);
    
    float h, c=eps, r=1.;
    
    for (float t = 0.0; t < 50.0; t++){
        h = map(p + ld * c).w;
        if (h < eps){
            return vec3(0.);
        }
        r = min(r, h * softShadow / c);
        c += h;//clamp(h,0.,3.0);
        if(c>l)break;
    }
    
    return lc*po*r*diff/(l*l);
}
// ambient occlusion by point
float getOcc(vec3 ro, vec3 rd){
    float totao = 0.0;
    float sca = 1.0;
    for (int aoi = 0; aoi < 2; aoi++){
        float hr = 0.01 + 0.02 * float(aoi * aoi);
        vec3 aopos = ro + rd * hr;
        float dd = map(aopos).w;
        float ao = clamp(-(dd - hr), 0.0, 1.0);
        totao += ao * sca;
        sca *= 0.75;
    }
    const float aoCoef = 0.5;
    return totao*(1.0 - clamp(aoCoef * totao, 0.0, 1.0));
}
vec3 getFullLight(vec3 pos, vec3 n){   
    pos+=eps*n;
    vec3 col;

    if (length(pos) < depthmax){
        col = vec3(.25);
		col += getLight(pos, vec3(11., 13., 8.), n, vec3(1.,.9,.9), 60.,false);
        col += getLight(pos, vec3(-8.,13., 11.), n, vec3(1.,1.,1.), 60.,false);
        col += getLight(pos, vec3(-11.,13.,-8.), n, vec3(1.,1.,1.), 60.,false);
        col += getLight(pos, vec3(8., 13.,-11.), n, vec3(1.,.9,.9), 60.,false);
    }else{
        col = backcol;
    }
    return col;
}
//direction of ray by pixel coord
vec3 getDir(vec2 fragCoord, float angle){
	vec2 p = (fragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);    
    vec3 eye = cameraPos;
    float targetDepth = 2.;
    vec3 dir = normalize(vec3(p,targetDepth));
    dir.zy*=ro(-.25);
    dir.xz*=ro(angle);
    return dir;
}

//color and length of ray
vec3 rayCast(vec3 eye, vec3 dir){
    vec3 col = vec3(0.);
    float k=1.;
    
    vec3 pos; float depth=0., sdepth=0., dist;
    vec4 rc;
    const int maxsteps = 500;
    for (int i = 0; i < maxsteps; i++){
        pos = eye + dir * depth;
        rc = map(pos);
        dist = rc.w;;

        depth += dist;
        sdepth += dist;
        
        if(dist < eps){ //intersection with object
            break; 
        }else if(length(pos)>depthmax){ //ray 
            depth = depthmax+eps;
            break;
        }
    } 
    vec3 n = norm(pos);
    pos+=eps*n*5.;
    col+=map(pos).xyz*k*getFullLight(pos,n);
	if(map(pos).w<0.)col+=vec3(1e20);
    return col * exp(-0.003*sdepth);
}


//full render
void main( void )
{
    //direction calculation
    float angle = time*.2;    
    vec3 eye = cameraPos;
    eye.xz*=ro(angle);
    vec3 dir = getDir(gl_FragCoord.xy,angle);

    //raymarching
    vec3 col = rayCast(eye, dir);    
    gl_FragColor = vec4(1.5*log(1.+ col), 1.0);
}
