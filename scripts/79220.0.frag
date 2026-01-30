/*
 * hoolshader from: https://www.shadertoy.com/view/XtfXDS
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate a black texture
#define texture(s, uv) vec4(20.0)
#define textureLod(s, uv, lod) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //

// **************************************************************************
// CONSTANTS

#define PI 3.14159
#define TWO_PI 6.28318
#define PI_OVER_TWO 1.570796

#define REALLY_SMALL_NUMBER 0.0001
#define REALLY_BIG_NUMBER 1000000.


#define RINGS_SURFACE_ID 1.
#define BASE_SURFACE_ID 2.
#define SKY_SURFACE_ID 3.
#define WATER_SURFACE_ID 4.
#define HELI_SURFACE_ID 5.

#define SUN_POSITION vec3(20., 6.5, 80.)
#define SUN_COLOR vec3(1., .93, .91)
#define GATE_POSITION vec3(0., 2., 0.)

#define DIST_MARCH_STEPS 50
#define DIST_MARCH_MAXDIST 30.

// **************************************************************************
// INLINE MACROS

#define MATCHES_SURFACE_ID(id1, id2) (id1 > (id2 - .5)) && (id1 < (id2 + .5))

// **************************************************************************
// DEFINES

// Increase to 5 to anti-alias (and to warm up your GPU)
#define NUM_AA_SAMPLES 1.

// **************************************************************************
// GLOBALS

vec4  g_debugcolor  = vec4(0.);
float g_time        = 0.;

float g_r0time      = 0.;
float g_r1time      = 0.;
float g_r2time      = 0.;
float g_r3time      = 0.;

vec3  g_helipos     = vec3(0.);
 
float g_gatetime    = 0.;
float g_gateburst   = 0.;
float g_gateradius  = 0.;
float g_exposure    = 1.;
float g_flareamount = .4;
vec3  g_burstcolor  = vec3(0.);
float g_camshake    = 0.;

// **************************************************************************
// MATH UTILITIES

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
    vec2 rg = textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).yx;
    return mix( rg.x, rg.y, f.z );
}

// Approximating a dialectric fresnel effect by using the schlick approximation
// http://en.wikipedia.org/wiki/Schlick's_approximation. Returns a vec3 in case
// I want to approximate a different index of reflection for each channel to
// get a chromatic effect.
vec3 fresnel(vec3 R, vec3 N, float eta)
{
    // assume that the surrounding environment is air on both sides of the 
    // dialectric
    float ro = (1. - eta) / (1. + eta);
    ro *= ro;
    
    float fterm = pow(max(0., 1. - dot(R, N)), 5.);  
    return vec3(ro + ( 1. - ro ) * fterm); 
}

// Rotate the input point around the x-axis by the angle given as a cos(angle)
// and sin(angle) argument.  There are many times where  I want to reuse the
// same angle on different points, so why do the  heavy trig twice. Range of
// outputs := ([-1.,-1.,-1.] -> [1.,1.,1.])
vec3 rotate_xaxis( vec3 point, float cosa, float sina )
{
    return vec3(point.x,
                point.y * cosa - point.z * sina,
                point.y * sina + point.z * cosa);
}

// Rotate the input point around the y-axis by the angle given as a cos(angle)
// and sin(angle) argument.  There are many times where I want to reuse the
// same angle on different points, so why do the heavy trig twice. Range of
// outputs := ([-1.,-1.,-1.] -> [1.,1.,1.])
vec3 rotate_yaxis( vec3 point, float cosa, float sina )
{
    return vec3(point.x * cosa  + point.z * sina,
                point.y,
                point.x * -sina + point.z * cosa);
}

// Rotate the input point around the z-axis by the angle given as a cos(angle)
// and sin(angle) argument.  There are many times where  I want to reuse the
// same angle on different points, so why do the  heavy trig twice. Range of
// outputs := ([-1.,-1.,-1.] -> [1.,1.,1.])
vec3 rotate_zaxis( vec3 point, float cosa, float sina )
{
    return vec3(point.x * cosa - point.y * sina,
                point.x * sina + point.y * cosa,
                point.z);
}

float length4( vec2 p )
{
    p = p*p*p*p;
    return pow( p.x + p.y, 1.0/4.0 );
}

// Reference: http://geomalgorithms.com/a05-_intersect-1.html. Does an
// intersection test against a plane that is assumed to be double sided and
// passes through the plane_origin and has the specified normal. *Overkill* 
// for intersecting with the x-z plane.

// Returns a vec2 where:
//   result.x = 1. or 0. if there is a hit
//   result.y = t such that ray_origin + t*ray_direction = intersection point
vec2 intersect_plane(vec3 ro,
                     vec3 rd,
                     vec3 pn,
                     vec3 po)
{
    float rddn = dot(rd, pn);
    float intersected = 0.;

    float t = REALLY_BIG_NUMBER;
    // If the denominator is not a really small number (positive or negative)
    // then an intersection took place.  If it is really small, then the ray
    // is close to parallel to the given plane.
    if (abs(rddn) > REALLY_SMALL_NUMBER) {
        t = -dot(pn, (ro - po)) / rddn;    
        if (t > REALLY_SMALL_NUMBER) {
            intersected = 1.;
        } else {
            t = REALLY_BIG_NUMBER;
        }

    }
    return vec2(intersected, t);
}

// intersection for a sphere with a ray. If the ray origin is inside the
// sphere - no intersection takes place.  So there is gauranteed to be a tmin
// and tmax return value.
// Returns a vec3 where:
//  result.x = 1. or 0. to indicate if a hit took place
//  result.y = tmin
//  result.z = tmax
vec3 intersect_sphere(vec3 ro,                 
                      vec3 rd, 
                      float sphr,
                      vec3 sphc)
{

    vec3 oro = ro - sphc;

    float a = dot(rd, rd);
    float b = dot(oro, rd);
    float c = dot(oro, oro) - sphr*sphr;
    float discr = b*b - a*c; 
    
    float tmin = 0.0;
    float tmax = 0.0;

    float sdisc = sqrt(discr);
    tmin = (-b - sdisc)/a;
    tmax = (-b + sdisc)/a; 

    float hit = step(0., tmin);

    float outside = step(sphr*sphr, dot(oro, oro));
    return outside * vec3(hit, tmin, tmax);
}

float flow_noise( in vec3 p )
{
    vec3 q = p - vec3(0., .5 * g_time, 0.);
    float f;
    f  = 0.50000*noise( q ); q = q*3.02 -vec3(0., .5 * g_time, 0.);
    f += 0.35000*noise( q ); q = q*3.03;
    f += 0.15000*noise( q ); q = q*3.01;
    return f;
}

float map4( in vec3 p )
{
    vec3 q = p;
    float f;
    
    f  = 0.50000*noise( q ); q = q*2.02;
    f += 0.25000*noise( q ); q = q*2.03;
    f += 0.12500*noise( q ); q = q*2.01;
    f += 0.06250*noise( q );
    return f;
}

//Grabbed and modified from nimitz: https://www.shadertoy.com/view/ltfGDs
vec2 fold16(in vec2 p)
{
    p.xy = abs(p.xy);
    const vec2 pl1 = vec2(-0.7071, 0.7071);
    const vec2 pl2 = vec2(-0.9237, 0.3827);
    const vec2 pl3 = vec2(-0.9808, 0.1951);
    
    p -= pl1*2.*min(0., dot(p, pl1));
    p -= pl2*2.*min(0., dot(p, pl2));
    p -= pl3*2.*min(0., dot(p, pl3));
    
    return p;
}

//Grabbed and modified from nimitz: https://www.shadertoy.com/view/ltfGDs
vec2 fold8(in vec2 p)
{
    p.xy = abs(p.xy);
    const vec2 pl1 = vec2(-0.7071, 0.7071);
    const vec2 pl2 = vec2(-0.9237, 0.3827);
    p -= pl1*2.*min(0., dot(p, pl1));
    p -= pl2*2.*min(0., dot(p, pl2));
    
    return p;
}

//Grabbed and modified from nimitz: https://www.shadertoy.com/view/ltfGDs
vec2 fold4(in vec2 p)
{
    p.xy = abs(p.xy);
    const vec2 pl1 = vec2(-0.7071, 0.7071);
    p -= pl1*2.*min(0., dot(p, pl1));
    
    return p;
}

// overlay ca on top of ci and return ci
void composite(inout vec4 ci, vec4 ca)
{
    // assume pre-multiplied alpha    
    ci += ca * (1. - ci.a);
}

// **************************************************************************
// DISTANCE FUNC MATH

float sphere_df( vec3 p, float r ) { return length( p ) - r; }
float plane_df( vec3 p, vec3 o, vec3 n ) { return abs(dot(p-o, n)); }
float roundbox_df ( vec3 p, vec3 b, float r ) {return length(max(abs(p-vec3(0., b.y, 0.))-b,0.0))-r; }
float ring_df (vec3 p, vec2 r) {return length( vec2(length(p.xz)-r.x,p.y) )-r.y; }
float flatring_df(vec3 p, vec2 r) {return length4( vec2(length(p.xz)-r.x,p.y) )-r.y; }

// **************************************************************************
// INFORMATION HOLDERS (aka DATA STRUCTURES)

struct CameraInfo
{
    vec3 camera_origin;
    vec3 ray_look_direction;
    mat3 camera_transform;
    vec2 image_plane_uv;
};

#define INIT_CAMERA_INFO() SurfaceInfo(vec3(0.) /* camera_origin */, vec3(0.) /* ray_look_direction */, mat3(1.) /* camera_transform */, vec2(0.) /* image_plane_uv */)

struct SurfaceInfo
{
    float surface_id;
    vec3 view_origin;
    vec3 view_dir;
    vec3 surface_point;
    vec3 surface_normal;
    vec2 surface_uv;
    float surface_depth;
    float shade_light;
};
#define INIT_SURFACE_INFO(view_origin, view_dir) SurfaceInfo(-1. /* surface_id */, view_origin, view_dir, vec3(0.) /* surface_point */, vec3(0.) /* surface_normal */, vec2(0.) /* surface_uv */, 0. /* surface_depth */, 1. /* shade_light */)

struct MaterialInfo
{
    vec3 bump_normal;
    vec3 diffuse_color;
    vec3 reflection_color;  // (aka specular color)    
    float reflection_glossiness;  // (aka specular exponent)
    float environment_amount;
    vec3 ambient_color;
};
#define INIT_MATERIAL_INFO(surface_normal) MaterialInfo(surface_normal /* bump_normal */, vec3(0.) /* diffuse_color */, vec3(0.) /* reflection_color */, 1. /* reflection_glossiness */, 0. /* environment_amount */, vec3(0.) /* ambient_color */)

// **************************************************************************
// SETUP WORLD
    
void setup_globals()
{
    // Way to globally control playback rate.
    g_time = 1. * iTime;
    //g_time = .2 * iMouse.x;
    
    g_r0time = max(0., g_time - 20.);
    g_r0time = .0035 * pow(g_r0time, 2.25);
    
    g_r1time = max(0., g_time - 15.);
    g_r1time = .007 * pow(g_r1time, 2.25);
    
    g_r2time = max(0., g_time - 10.);
    g_r2time = .015 * pow(g_r2time, 2.35);
    
    g_r3time = max(0., g_time - 5.);
    g_r3time = .03 * pow(g_r3time, 2.4);

    vec3 heli_orig = vec3(-7.5, .8, -0.2);
    g_helipos = heli_orig + .5 * g_time * vec3(0.966, 0., .259);    
    
    float gate_flicker = noise(vec3(10. * g_time));
    g_gatetime = max(0., g_time - 30.);
    float burst_time = max(0., g_gatetime - 45.);
    g_gateburst = 8. * mod(.8 * burst_time, 3.);
    float burst_boost = step(REALLY_SMALL_NUMBER, burst_time) * smoothstep(2.5, 0., g_gateburst);
	burst_boost *= burst_boost;
    
    g_gateradius = min(2.5, .05 * g_gatetime) + 5. * burst_boost;
    
    g_burstcolor = (2.5 + 4. * burst_boost)  * smoothstep(0., 30., g_gatetime) * vec3(1., .88, 1.);        
    g_burstcolor *= .8 + .2 * gate_flicker;
    
    g_flareamount = (.4 + 1. * burst_boost) * smoothstep(30., 40., g_gatetime);
    g_flareamount *= .7 + .3 * gate_flicker;

    g_exposure = .4 + .6 * smoothstep(30., 10., g_gatetime);
    
    g_camshake = .1 * cos(40. * g_time) * smoothstep(6., 7., g_gateburst) * smoothstep(10., 8., g_gateburst);
}


CameraInfo setup_camera(vec2 aaoffset)
{
    // remap the mouse click ([-1, 1], [-1/AspectRatio, 1/AspectRatio])
    //vec2 click = iMouse.xy / iResolution.xx;  
    //click = 2.0 * click - 1.0;  
    
    vec3 camera_origin = vec3(0.0, .1, 8.0);
    
    //float rotxang    = .01 * g_camshake;
    //float cosrotxang = cos(rotxang);
    //float sinrotxang = sin(rotxang);
    //camera_origin = rotate_xaxis(camera_origin, cosrotxang, sinrotxang);
    
    //float rotyang    = TWO_PI * click.x;
    //float rotyang    = .1 * sin(.1 * g_time + PI_OVER_TWO) + TWO_PI * .71;
    float rotyang    = .2 * g_camshake + .1 + TWO_PI * .71;
    float cosrotyang = cos(rotyang);
    float sinrotyang = sin(rotyang);    
    camera_origin = rotate_yaxis(camera_origin, cosrotyang, sinrotyang);

    vec3 camera_points_at = vec3(0., 1., 2.);

    float inv_aspect_ratio = iResolution.y / iResolution.x;
    vec2 image_plane_uv = (gl_FragCoord.xy + aaoffset) / iResolution.xy - .5;
    image_plane_uv.y *= inv_aspect_ratio;

    // calculate the ray origin and ray direction that represents mapping the
    // image plane towards the scene.  Assume the camera is facing y-up (0., 1.,
    // 0.).
    vec3 iu = vec3(0., 1., 0.);

    vec3 iz = normalize( camera_points_at - camera_origin );
    vec3 ix = normalize( cross(iz, iu) );
    vec3 iy = cross(ix, iz);

    // project the camera ray through the current pixel being shaded using the
    // pin-hole camera model.
    float focus = .5;
    vec3 ray_look_direction = normalize( image_plane_uv.x * ix + image_plane_uv.y * iy + focus * iz );

    return CameraInfo(camera_origin, ray_look_direction, mat3(ix, iy, iz), image_plane_uv);

}

// **************************************************************************
// MARCH WORLD

vec2 mergeobjs(vec2 a, vec2 b) { return mix(b, a, step(a.x, b.x)); }

float uniondf(float a, float b) { return min(a, b); }
float intersdf(float a, float b) { return max(a, b); }
float diffdf(float a, float b) { return max(a, -b); }

vec2 heli_df( vec3 p )
{
    vec3 hp = p;
    
    // main body
    float heli_d = roundbox_df(hp, vec3(.02, .006, .012), .01);
    
    // butt piece
    heli_d = uniondf(heli_d, roundbox_df(hp - vec3(-0.02, .01, 0.), vec3(.03, .0, .0), .005));
    
    // rails under heli
    vec3 rail = hp;
    rail.z = abs(rail.z) - 0.012;
    heli_d = uniondf(heli_d, roundbox_df(rail - vec3(0., -0.021, 0.), vec3(.03, .002, .002), .0));

    // tail bar
    vec3 tail = hp;
    tail.xy *= mat2(0., 1., -1., 0.);
    heli_d = uniondf(heli_d, roundbox_df(tail - vec3(.018, -0.02, 0.), vec3(.0, .07, .0), .003));
    
    // tail tip
    heli_d = uniondf(heli_d, roundbox_df(hp - vec3(-.115, 0.01, 0.), vec3(.005, .01, .0), .00));
    
    // spinning blade
    vec3 blade = hp;
    float t = 50. * g_time;
    vec2 cs = vec2(cos(t), sin(t));
    blade.xz *= mat2(cs.x, cs.y, -cs.y, cs.x);
    heli_d = uniondf(heli_d, roundbox_df(blade - vec3(0., .03, 0.), vec3(.1, .0, .002), .002));        
            
    return vec2(heli_d, HELI_SURFACE_ID);
}

vec2 scene_df( vec3 p )
{
    
    // spinning rings
    vec3 pc = p - GATE_POSITION;
    float r1 = flatring_df(pc, vec2(1., .08));
    r1 = diffdf(r1, sphere_df(pc, 1.02));
    
    pc = rotate_yaxis(pc, cos(g_r0time), sin(g_r0time));
    
    float ir1 = flatring_df(pc, vec2(1.02, .04));
    vec3 ipc = pc;
    ipc.xz = fold16(ipc.xz) - vec2(0., 1.);
    ir1 = diffdf(ir1, sphere_df(ipc, .06));
    
    pc = rotate_zaxis(pc, cos(g_r1time + 1.57), sin(g_r1time + 1.57));
    float r2 = flatring_df(pc, vec2(.95, .07));
    r2 = diffdf(r2, sphere_df(pc, .97));
    
    pc = rotate_xaxis(pc, cos(g_r2time + 1.57), sin(g_r2time + 1.57));
    float r3 = flatring_df(pc, vec2(.9, .07));
    r3 = diffdf(r3, sphere_df(pc, .92));
        
    pc = rotate_zaxis(pc, cos(g_r3time + 1.57), sin(g_r3time + 1.57));
    float r4 = diffdf(flatring_df(pc, vec2(.85, .07)), sphere_df(pc, .87));
    
    float innerrings = ir1;
    
    float rings = uniondf(uniondf(uniondf(r1, r2), r3), r4);
    vec2 ring_obj = vec2(rings, RINGS_SURFACE_ID);      
    
    vec2 innerrings_obj = vec2(innerrings, RINGS_SURFACE_ID);
    
    // supports
    pc = p;    
    float sr = flatring_df(pc - vec3(0., 2.03, 0.), vec2(1.1, .035));

    pc.xz = fold4(p.xz) - vec2(0.,1.4);    
    float supports = uniondf(sr, roundbox_df(pc, vec3(0.02, 1., .13), .01));
    supports = uniondf(supports, roundbox_df(pc, vec3(.05, 1., .06), .01));
    
    vec3 pcb = pc + vec3(0., .2, .0);
    supports = uniondf(supports, roundbox_df(pcb - vec3(0.,.9,0.), vec3(.1, .05, .17), .02));

    vec3 s1pc = pcb;
    s1pc.xy *= mat2(.9659, .2588, -.2588, .9659);
    s1pc -= vec3(0.28, 0., 0.);
    supports = uniondf(supports, roundbox_df(abs(s1pc), vec3(.08, .41, .06), .01));

    vec3 s2pc = pcb;
    s2pc.z = abs(s2pc.z);
    s2pc.yz *= mat2(.9659, -.2588, .2588, .9659);
    s2pc -= vec3(0.07, 0., 0.3);
    supports = uniondf(supports, roundbox_df(s2pc, vec3(.03, .41, .08), .01));
    
    vec3 tpc = pc - vec3(0., 1.86, 0.);
    supports = uniondf(supports, roundbox_df(tpc, vec3(.06, .045, .17), .01));
    tpc.y -= .1;
    supports = uniondf(supports, roundbox_df(tpc, vec3(.07, .02, .24), .01));
    tpc -= vec3(0.0, .05, -0.06);
    supports = uniondf(supports, roundbox_df(tpc, vec3(.07, .02, .34), .01));
    
    vec2 supports_obj = vec2(supports, RINGS_SURFACE_ID);
    
    // crane
    pc = p + vec3(-.83, 0., .83);
    pc.xz *= mat2(.7071, .7071, -.7071, .7071);
    float crane = roundbox_df(pc, vec3(.03, 1.7, .08), .01);
    crane = uniondf(crane, roundbox_df(pc , vec3(.06, 1.7, .05), .0));
    
    // crane supports
    pcb = pc - vec3(0., .4, .0);
    s1pc = pcb;
    s1pc.x = abs(s1pc.x);
    s1pc.xy *= mat2(.9659, .2588, -.2588, .9659);
    s1pc -= vec3(0.2, 0., 0.);
    crane = uniondf(crane, roundbox_df(abs(s1pc), vec3(.08, .41, .06), .01));

    s2pc = pcb;
    s2pc.xz = abs(s2pc.xz);
    s2pc.yz *= mat2(.9659, -.2588, .2588, .9659);
    s2pc -= vec3(0.03, 0., 0.26);
    crane = uniondf(crane, roundbox_df(abs(s2pc), vec3(.01, .41, .08), .01));
        
    // crane tanks    
    pcb = pc - vec3(0., 2.6, 0.);
    pcb.xz = fold8(pcb.xz) - vec2(0., .1);
    crane = uniondf(crane, roundbox_df(pcb, vec3(.0, .2, .0), .05));    
      
    tpc = pc - vec3(0., 3.5, 0.);
    
    // beam
    crane = uniondf(crane, roundbox_df(tpc - vec3(0., 0., .21), vec3(.08, .02, 1.05), .01));
    crane = uniondf(crane, roundbox_df(tpc - vec3(0., -.02, .21), vec3(.02, .001, 1.05), .03));
    
    // pivot
    crane = uniondf(crane, roundbox_df(tpc - vec3(0., -.1, .0), vec3(.06, .01, .2), .04));
    crane = uniondf(crane, roundbox_df(tpc - vec3(0., -.2, .0), vec3(.13, .05, .1), .01));

    // counter weight
    crane = uniondf(crane, roundbox_df(tpc - vec3(0., -0.1, -.8), vec3(.08, .06, .14), .03));
    
    // drop pod bay  
    crane = uniondf(crane, ring_df((tpc - vec3(0., -0.03, 1.2)) * vec3(1., .6, 1.), vec2(.08, .05)));

    vec2 crane_obj = vec2(crane, RINGS_SURFACE_ID);    
    
    // base
    pc = p - vec3(0., .55, 0.);
    float base = flatring_df(pc * vec3(1., .8, 1.), vec2(.6, .05));
    
    pc = p + vec3(.0, 0.1, 0.);
    pc.xz = fold8(pc.xz) - vec2(0., 1.2);
    pc.yz *= mat2(.7071, -.7071, .7071, .7071);
    float base_struts = roundbox_df(pc, vec3(0.1, .45, 0.02), .01);
    base = uniondf(base, base_struts);
            
    vec2 base_obj = vec2(base, RINGS_SURFACE_ID);
    
    // ground    
    vec3 pb = p * vec3(.3, 1., .3) + vec3(0., .15, 0.) * (2.*map4(vec3(2.5) * p)-1.) + vec3(0., 1.3, 0.);
    vec2 ground_obj = vec2(sphere_df(pb, 1.5), BASE_SURFACE_ID);
    

    vec2 obj = ring_obj;
    obj = mergeobjs(obj, ground_obj);
    obj = mergeobjs(obj, innerrings_obj);
    obj = mergeobjs(obj, supports_obj);
    obj = mergeobjs(obj, crane_obj);
    obj = mergeobjs(obj, base_obj);
    
    if (g_helipos.x < 6.)
    {
        vec2 heli_obj = heli_df(p - g_helipos);
        obj = mergeobjs(obj, heli_obj);
    }
    
    return obj;
}

vec3 calc_normal( vec3 p )
{
    vec3 epsilon = vec3( 0.01, 0.0, 0.0 );
    vec3 n = vec3(
        scene_df(p + epsilon.xyy).x - scene_df(p - epsilon.xyy).x,
        scene_df(p + epsilon.yxy).x - scene_df(p - epsilon.yxy).x,
        scene_df(p + epsilon.yyx).x - scene_df(p - epsilon.yyx).x );
    return normalize( n );
}

vec2 intersect_water(vec3 ro, vec3 rd)
{
    return intersect_plane(ro, rd, vec3(0., 1., 0.), vec3(0., 0., 0.));
}

SurfaceInfo march_scene(vec3 ray_origin,
                        vec3 ray_direction,
                        float consider_water )
{

    SurfaceInfo surface = INIT_SURFACE_INFO(ray_origin, ray_direction);

    vec2 water = consider_water * intersect_water(ray_origin, ray_direction);
    vec3 air_burst = intersect_sphere(ray_origin, ray_direction, g_gateburst, GATE_POSITION);    
    
    float epsilon = 0.001;
    float dist = 10. * epsilon;
    float total_t = 0.;
    float curr_t = 0.;
    
    vec3 sky_n = normalize(ray_origin);
    vec3 sky_o = -6. * sky_n ;
    
    vec3 ro = ray_origin;
    vec3 rd = ray_direction;
    
    float burst_ior = 1. + .02 * smoothstep(8., 7., g_gateburst);
    for (int i=0; i < DIST_MARCH_STEPS; i++) 
    {
        if ( abs(dist) < epsilon || curr_t + total_t > DIST_MARCH_MAXDIST ) 
        {
            break;
        }        

        vec3 p = ro + curr_t * rd;        
        vec2 dfresult = scene_df( p );
        
        // calculate sky on it's own since it shifts with ray_origin
        // and normal
        vec2 sky_obj = vec2(plane_df(p, sky_o, sky_n), SKY_SURFACE_ID);
        dfresult = mergeobjs(sky_obj, dfresult);

        dist = dfresult.x;        
        curr_t += dist;
        surface.surface_id = dfresult.y;
   
        // air_burst and water are not distance marched
        // air_burst because it causes refraction
        // water as an optimization
        if (air_burst.x > .5 && curr_t > air_burst.y && air_burst.y < water.y - epsilon )
        {
            ro = ro + air_burst.y * rd;
            // calculate the burst normal to be bent towards the viewing direction to avoid
            // the refraction revealing the fact that the sky is a camera aligned 
            // textured card
            
            // refract the march directions
            vec3 burst_n = normalize(ro - GATE_POSITION - 2. * rd);
            rd = refract(rd, burst_n, burst_ior);
            total_t = air_burst.y;
            curr_t = 0.;            
            air_burst *= 0.;
            
            water = consider_water * intersect_water(ro, rd);
            surface.view_dir = rd;
        }        
        
        
        else if ( water.x > .5 && curr_t > water.y )
        {
            surface.surface_id = WATER_SURFACE_ID;
            curr_t = water.y;
            break;
        }   

                                          
    }
    
    surface.surface_point = ro + curr_t * rd;
    total_t += curr_t;
    
    if (MATCHES_SURFACE_ID(surface.surface_id, WATER_SURFACE_ID))
    {
        vec3 n = vec3(0., 1., 0.);
        vec3 u = normalize(-vec3(1., 0., 1.) * ray_origin);
        vec3 v = cross(n, u);
        surface.surface_uv = vec2(100., 10.) * vec2( dot(surface.surface_point, u), 
                                                    dot(surface.surface_point, v) );

        n += u * (.2 * flow_noise(surface.surface_uv.xxy) - .1);
        surface.surface_normal = normalize(n);
       
    }    
    else if (MATCHES_SURFACE_ID(surface.surface_id, SKY_SURFACE_ID))
    {
        surface.surface_normal = -rd;
        surface.surface_uv = surface.surface_point.xz;
    }
    else if (surface.shade_light > .5) 
    {        
        surface.surface_normal = calc_normal( surface.surface_point );
        surface.surface_uv = surface.surface_point.xz;
    }
    
            
    surface.surface_depth = total_t;

    return surface;
}

// **************************************************************************
// SHADE WORLD

vec3 light_from_point_light(SurfaceInfo  surface,
                            MaterialInfo material,
                            vec3 light_position,
                            vec3 light_color,
                           float falloff_with_distance,
                           float specular_sharpen)
{
    vec3 light_direction = normalize(light_position - surface.surface_point);
    vec3 light_reflection_direction = reflect(light_direction, material.bump_normal);
    
    // Phong reflection model
    vec3 reflective_shading = material.reflection_color * pow(max(0., dot(light_reflection_direction, surface.view_dir)), 
        material.reflection_glossiness * specular_sharpen);
    
    float ldist = length(surface.surface_point - light_position);
    float dist_atten = 1./ldist;
    vec3 diffuse_shading = material.diffuse_color * max(0., dot(light_direction, material.bump_normal)) * mix(1., dist_atten, falloff_with_distance);    
    vec3 scene_color = light_color * (diffuse_shading + reflective_shading);
 
    return scene_color;

}


vec3 light_from_environment(SurfaceInfo  surface,
                            MaterialInfo material)
{

    vec3 surface_reflection_direction = reflect(surface.view_dir, material.bump_normal);
    vec3 fresnel_color = material.environment_amount * fresnel(surface_reflection_direction, material.bump_normal, .8);
    vec3 environment_shading = .8 * fresnel_color * texture(iChannel2, surface_reflection_direction).rgb;
    vec3 ambient_shading = material.ambient_color;
    vec3 scene_color = ambient_shading + environment_shading;
 
    return scene_color;
}

vec4 shade_gate(vec3 ro, vec3 rd, float depth)
{
    vec4 gate_rgba = vec4(0.);
    vec3 cn = normalize(ro);
    float num_gates = 0.;

    if (g_gatetime <= REALLY_SMALL_NUMBER)
    {
        return gate_rgba;
    }
            
    
    for (float i = 0.; i < 3.; i += 1.)
    {
        vec3 cp = cn * (.2  - .2 * i) ;
        vec2 ch = intersect_plane(ro, rd, cn, cp);

        float t = g_gatetime + i;
        
        if (ch.x > .5 && ch.y < depth )
        {
            vec3 hp = ro + rd * ch.y;
            vec3 chp = hp - cp - GATE_POSITION;
            vec3 uvhp = vec3(length(chp),
                             atan(chp.z + .3 * (noise(30. * length(chp) - vec3(10. * t)) - .5), chp.y),
                             5. * t);
                            
            float falloff = smoothstep(g_gateradius * (.3 + .7 * map4(vec3(0., 2., 1.4) * uvhp)), 0., uvhp.x);
            falloff *= falloff;
            
            float gate_alpha = .6 * map4(vec3(-3., 1., 1.) * (uvhp - vec3(1. * t, 0., 0.))) * falloff;
            vec3 gate_color = 4. * vec3(.6, .7, .6 + .5 * i);
            
            composite(gate_rgba, vec4(gate_color * gate_alpha, gate_alpha));
            num_gates += 1.;
        }
        else
        {
            break;
        }
    }

    return gate_rgba * smoothstep(0., 1., g_gatetime);
}

vec3 shade_anamorphicflare(CameraInfo camera)
{
    vec3 gate_flare = vec3(0.);

    if (g_gatetime <= REALLY_SMALL_NUMBER)
    {
        return gate_flare;
    }
    
    // find the center of the flare based on the burst position in world space    
    vec3 flare_dir = normalize(GATE_POSITION - camera.camera_origin);    
    vec2 flare_plane = intersect_plane(camera.camera_origin, 
                                       flare_dir, 
                                      -camera.camera_transform[2],
                                       0.5 * camera.camera_transform[2] + camera.camera_origin);
    
    vec3 flare_hit = flare_plane.y * flare_dir;// + camera.camera_origin;
    flare_hit -= camera.camera_transform[2];// + camera.camera_origin;
    
    vec2 flare_uv_center = vec2(dot(flare_hit, camera.camera_transform[0]), 
                         dot(flare_hit, camera.camera_transform[1]));

    vec2 flare_uv = 10. * (camera.image_plane_uv - flare_uv_center);
    
    gate_flare = (1./(.5 * length(flare_uv))) * vec3(1., .8, 1.) * smoothstep(1., .0, pow(abs(flare_uv.y), .5));
                
    return gate_flare * g_flareamount;
}

vec4 shade_clouds(vec3 ro, vec3 rd, float depth)
{
    vec4 cloud_rgba = vec4(0.);
    vec3 cn = normalize(ro);
    float num_clouds = 0.;
    
    for (float i = 0.; i < 4.; i += 1.)
    {
        vec3 cp = ro - cn * (1. * i + 0.1) ;
        vec2 ch = intersect_plane(ro, rd, cn, cp);

        if (ch.x > .5 && ch.y < depth )
        {
            vec3 hp = ro + rd * ch.y;
            vec3 uvhp = vec3(dot(hp - cp, vec3(0.,1.,0.)), 
                             dot(hp - cp, cross(vec3(0., 1, 0.), cn)), 
                                 
                                 0.);
                           
            float height_s = smoothstep(1., 5., hp.y);
            
            float cloud_alpha = (.1 + .15 * i) * (.2 + .8 * smoothstep(.4, .75 - .25 * height_s, map4(vec3(1.8, .4, 0.) * uvhp + vec3(3. * i, 5. * i , .05 * g_time))));
            cloud_alpha *= smoothstep(0., .08, hp.y) * smoothstep(.2 + 1.2 * i, .1, hp.y);
            vec3 cloud_color = 1.2 * vec3(1.+.09*i,1.,1.);
            composite(cloud_rgba, vec4(cloud_color * cloud_alpha, cloud_alpha));
            num_clouds += 1.;
        }
        else
        {
            break;
        }
    }

    //g_debugcolor.rgb = vec3(num_clouds * .25);
    //g_debugcolor.a = 1.;
    return cloud_rgba;
}

vec3 shade_reflected_world(SurfaceInfo surface)
{
    vec4 scene_color = vec4(0.);
    
    MaterialInfo material = INIT_MATERIAL_INFO(surface.surface_normal);
    if (MATCHES_SURFACE_ID(surface.surface_id, RINGS_SURFACE_ID))
    {

        material.diffuse_color = .5 * vec3(.65, .62, .68);
        material.reflection_color = 1.2 * vec3(0.5, 0.6, 0.7);
        material.reflection_glossiness = 70.;

        material.ambient_color = vec3(.04, .03, .035);

        material.environment_amount = .7;
    } 
    
    else if (MATCHES_SURFACE_ID(surface.surface_id, BASE_SURFACE_ID))
    {
        vec3 surface_color = .2 * vec3(1., .45, .4);        

        material.diffuse_color = surface_color;

        material.ambient_color = .14 * surface_color;
        material.reflection_color = .1 * surface_color;
        material.reflection_glossiness = 50.;

    }
    
    else if (MATCHES_SURFACE_ID(surface.surface_id, SKY_SURFACE_ID))
    {
        vec3 sky_color = .7 * mix(.9 * vec3(.9, .85, .85), 
                                  1.45 * vec3(.58, .58, .7), 
                                    smoothstep(1., 6., surface.surface_point.y));        

        sky_color += .5 * vec3(1.,1.,.9) * pow(max(0., dot(surface.view_dir, normalize(SUN_POSITION - surface.view_origin))), 8.);
        sky_color += .4 * vec3(1.,1.,.9) * smoothstep(5., 10., surface.surface_point.y);
        material.ambient_color = sky_color;
    }
    
    else if (MATCHES_SURFACE_ID(surface.surface_id, HELI_SURFACE_ID))
    {
        vec3 surface_color = 2. * vec3(.05, .05, .03);        

        material.diffuse_color = surface_color;
        material.ambient_color = vec3(.02);
        material.reflection_color = vec3(0.);

    }
    
    else if (MATCHES_SURFACE_ID(surface.surface_id, WATER_SURFACE_ID))
    {
        return vec3(0.);
    }

    if (surface.shade_light > .5)
    {
        vec4 gate_rgba = shade_gate(surface.view_origin, surface.view_dir, surface.surface_depth);
        vec4 clouds_rgba = shade_clouds(surface.view_origin, surface.view_dir, surface.surface_depth);

        vec3 lit_color = light_from_point_light(surface, 
                                                material, 
                                                SUN_POSITION, 
                                                SUN_COLOR, 
                                                0., 
                                                1.);
        
        lit_color += light_from_environment(surface, material); 
        
        lit_color *= g_exposure;
        clouds_rgba.rgb *= g_exposure;

        lit_color += light_from_point_light(surface, 
                                            material, 
                                            GATE_POSITION, 
                                            g_burstcolor, 
                                            1., 
                                            1.);          
        
        scene_color = gate_rgba; 
        composite(scene_color, clouds_rgba);
        composite(scene_color, vec4(lit_color, 1.));
    }
    else
    {
        scene_color.rgb = material.diffuse_color + 1.3 * material.ambient_color;
    }
    
    return scene_color.rgb;
}


vec3 shade_world(SurfaceInfo surface)
{

    vec4 scene_color = vec4(0.);
    
    if (MATCHES_SURFACE_ID(surface.surface_id, WATER_SURFACE_ID))
    {
        MaterialInfo material = INIT_MATERIAL_INFO(surface.surface_normal);
        
        vec3 surface_color = vec3(.07,.08,.1) + mix(vec3(.18, .22, .35),
                                 vec3(.21, .25, .38), 
                                 flow_noise(surface.surface_uv.xxy));

        material.diffuse_color = .8 * surface_color;
        material.ambient_color = .15 * surface_color;
        material.reflection_color = vec3(.8);
        material.reflection_glossiness = 100.;
        
        SurfaceInfo refl_surface = march_scene( surface.surface_point, 
                                                reflect(surface.view_dir, 
                                                        surface.surface_normal), 
                                                0. );
        refl_surface.shade_light = 0.;
        vec3 refl_color = shade_reflected_world( refl_surface );
        
        // fresnel like falloff to reflection
        refl_color *= (.3 + .7 * smoothstep(0.3, 2.5, surface.surface_depth));

        // loss of reflection with wave occlusion in the distance
        refl_color *= (.2 + .8 * smoothstep(3., 1., surface.surface_depth));
            
        vec4 gate_rgba = shade_gate(surface.view_origin, surface.view_dir, surface.surface_depth);
        vec4 clouds_rgba = shade_clouds(surface.view_origin, surface.view_dir, surface.surface_depth);
        
        vec3 lit_color = light_from_point_light(surface, 
                                                material, 
                                                SUN_POSITION, 
                                                SUN_COLOR, 
                                                0., 1.);
        
        lit_color += light_from_environment(surface, material);    
        lit_color += .2 * refl_color;
        
        lit_color *= g_exposure;      
        clouds_rgba.rgb *= g_exposure;
        
        lit_color += .7 * light_from_point_light(surface, 
                                            material, 
                                            GATE_POSITION, 
                                            g_burstcolor, 
                                            1., 
                                            1. + 6. * smoothstep(2., 0.1, g_gateradius));
        
        scene_color = gate_rgba; 
        composite(scene_color, clouds_rgba);
        composite(scene_color, vec4(lit_color, 1.));

    }
    else
    {
        
        scene_color.rgb = shade_reflected_world(surface);
    }

    return scene_color.rgb;
}

// **************************************************************************
// MAIN

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{   
    
    // ----------------------------------
    // SETUP GLOBALS

    setup_globals();

    // ----------------------------------
    // SETUP CAMERA

    float denom = TWO_PI/max(1., NUM_AA_SAMPLES-1.);
    vec3 scene_color = vec3(0.);

    for (float aa = 0.; aa < NUM_AA_SAMPLES; aa += 1.) 
    {

        vec2 aaoffset = step(.5, aa) * .5 * vec2( cos((aa-1.) * denom ),
                                                  sin((aa-1.) * denom ) );

        CameraInfo camera = setup_camera( aaoffset );
        
        // ----------------------------------
        // SCENE MARCHING

        SurfaceInfo surface = march_scene( camera.camera_origin,
         camera.ray_look_direction, 1. );
        
        // ----------------------------------
        // SHADING
        
        scene_color += shade_world( surface );
        
        // anamorphic lens flare
        scene_color += shade_anamorphicflare(camera);   

    }

    scene_color /= NUM_AA_SAMPLES;

    // ----------------------------------
    // POST PROCESSING
    
    // Brighten
    // scene_color *= 1.;
  
    // Gamma correct
    scene_color = pow(scene_color, vec3(.7));

    // Contrast adjust - cute trick learned from iq
    scene_color = mix( scene_color, vec3(dot(scene_color,vec3(0.333))), -.2 );

    // Color tint
    scene_color *= .5 + .5 * vec3(.95, 1., 1.);
      
    // Vignette - inspired by iq
    vec2 uv = fragCoord.xy / iResolution.xy;
    scene_color *= 0.4 + 0.6*pow( 16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y), 0.1 );
    
    // Debug color - great debugging tool.  
    if (g_debugcolor.a > 0.) 
    {
        fragColor.rgb = g_debugcolor.rgb;
    } else {
        fragColor.rgb = scene_color;
    }

    fragColor.a = 1.;
}


// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}