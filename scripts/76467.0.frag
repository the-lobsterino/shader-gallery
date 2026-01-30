/*
 * Original shader from: https://www.shadertoy.com/view/7dVSWt
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

// --------[ Original ShaderToy begins here ]---------- //
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST 0.00001

// The SDF
vec4 GetDist(vec3 p) {
    float bg = p.y;
    p -= vec3(0,1,0);
    
    float t = iTime * 0.4 + 1.*3.14;
    mat2 m1 = mat2(cos(t),-sin(t),sin(t),cos(t));
    
    float size = 0.9;
    vec3 col = vec3(0.0, 0.0, 0.0);
    for (int i = 0; i < 13; i++) {
        size = size*0.66;
        p.xz = m1*p.xz;
        col.y -= (p.x)*size;
        p.x = abs(p.x) - size;
    }
    
    float d = min(bg, length(p)-5.8*size);
    
    col.x = - col.y;
    col.z = (col.z+1.)/2.;
    
    col = bg < length(p)-5.8*size ? vec3(1.) : col;
    return vec4(d, col);
}

// Get the distance from camera
vec4 RayMarch( vec3 ro, vec3 rd ) {
    float dO = 0.;
    vec3 col = vec3(1.);
    
    for( int i = 0; i < MAX_STEPS; i++ ) {
        vec3 p = ro + rd*dO;
        vec4 ds = GetDist(p);
        dO += ds.x;
        col = ds.yzw;
        if (dO > MAX_DIST || dO < SURF_DIST) break;
    }
    return vec4(dO, col);
}

// Normal from SDF
vec3 GetNormal(vec3 p) {
    float d = GetDist(p).x;
    vec2 e = vec2(.0001, 0);
    
    vec3 n = d - vec3(
        GetDist(p - e.xyy).x,
        GetDist(p - e.yxy).x,
        GetDist(p - e.yyx).x);
    
    return normalize(n);
}

// Darker light if close to lightray
float softshadow( in vec3 ro, in vec3 rd, float k )
{
    float res = 1.0;
    float dO = 0.;
    for( int i=0; i<MAX_STEPS; i++ )
    {
        float ds = GetDist(ro + rd*dO).x;
        if( ds<SURF_DIST )
            return 0.0;
        res = min( res, k*ds/dO );
        dO += ds;
    }
    return res;
}

// Lighting
vec3 GetLight(vec3 p, vec3 lightPos) {
    vec3 l = normalize(lightPos - p);
    vec3 n = GetNormal(p);
    
    // Diffuse lighting
    vec3 dif = vec3(clamp(dot(n, l), 0., 1.));
    
    // Smooth shadow
    // float d = softshadow(p + n*SURF_DIST*2.0, l, 10.);
    // dif *= d;
    
    // Hard shadow
    vec4 d = RayMarch(p+n*SURF_DIST*2., l);
    if(d.x<length(lightPos-p)) dif *= 0.3*d.x*d.yzw;
    
    return dif;
}

// The camera
vec3 camDir(vec3 origin, vec2 uv) {
    vec3 up = vec3(0., 0., 1.);
    float zoom = 1.;
    vec3 lookat = vec3(0, 0, 0);
    
    vec3 f = normalize(lookat - origin);
    vec3 r = cross(up, f);
    vec3 u = cross(f, r);
    vec3 c = origin + f * zoom;
    vec3 i = c + uv.x*r + uv.y*u;
    vec3 rd = i - origin;
    return rd;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    float t = -iTime * 0.4;
    mat2 m1 = mat2(cos(t),-sin(t),sin(t),cos(t));

    vec3 col = vec3(0.);  
    
    // Camera origin
    vec3 ro = vec3(0, 4, 0);
    uv = m1*uv;
    // Camera direction
    vec3 rd = camDir(ro, uv);

    // Distance
    vec4 d = RayMarch(ro, rd);
    // Intersection point
    vec3 p = ro + rd * d.x;
    vec3 lightOff = vec3(2, 0, -2);
    lightOff.xz = m1*lightOff.xz;
    vec3 dif = GetLight(p, ro + lightOff);
    col = dif * d.yzw;
    

    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}