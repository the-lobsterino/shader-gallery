/*
 * Original shader from: https://www.shadertoy.com/view/wsXyz4
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
// Base code:
///// "RayMarching starting point" 
//// by Martijn Steinrucken aka BigWings/CountFrolic - 2020
//// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

#define MAX_STEPS 100
#define MAX_DIST 50.
#define SURF_DIST .001

#define S(a, b, t) smoothstep(a, b, t)
#define M(x, y, a) mix(x, y, a) 

mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

float sdLine(vec3 p, vec3 o, vec3 dir, float t) {
    vec3 a = o;
    vec3 b = a+dir;
    vec3 bMinusA = b-a;
    float h = min(t, max(-t, dot((p-a), bMinusA)/dot(bMinusA,bMinusA)));
    //float h = dot(p-a, bMinusA)/dot(bMinusA,bMinusA);
    float dist = length(p - a +-(b-a) * h )- 0.01;
    return dist;
}

mat3 rx(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(1,0,0,0,c,-s,0,s,c);
}
mat3 ry(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(c,0,s,0,1,0,-s,0,c);
}
mat3 rz(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(c,-s,0,s,c,0,0,0,1);
}

float smoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}


vec4 sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz)-t.x,p.y);
    return vec4(length(q)-t.y, 0.4, 0.4, 0.4);
}


vec4 stick(vec3 p, float m) {
      vec3 pp = vec3(p.x, p.y, mod(p.z+0.5*m, m)-m/2.);
    pp = rz(-iTime+p.z*1.)*pp;
    float dist = sdLine(pp, vec3(0), vec3(1., 1.,0.), .195); 
    return vec4(dist, 1., 1., 1.);
}


vec4 handle(vec3 p, float m) {
    vec3 pp = vec3(p.x, p.y, mod(p.z+0.5*m, m)-m/2.);
    pp = rz(-iTime+3.141592/4.+p.z)*pp;
    pp = rx(3.141592/2.+p.z)*pp;
    pp.x += 0.33;
    vec4 t1 = sdTorus(pp, vec2(0.04, .01)); 
    pp.x -= 0.66;
    vec4 t2 = sdTorus(pp, vec2(0.04, .01)); 
    return vec4(min(t1.x, t2.x), t1.yzw);
}


vec4 GetDist(vec3 p) {
    // vec4 best = vec4(MAX_DIST, fract(p.z), 1.-fract(p.z), 0.5+0.5*sin(iTime*fract(p.z)));
    vec4 best = vec4(MAX_DIST, 0.5+0.5*sin(1.3*p.z), 0.5+0.5*sin(p.z), 0.5+0.5*cos(p.z));

    vec3 pp = p;
    // pp = rx(iTime/25.)*pp;
    pp.x = sin(pp.x);
    pp.y = cos(pp.y);
    pp.z += cos(iTime/2.);
    float m = 0.1;
    vec4 distStick = stick(pp, m);
    vec4 distHandle = handle(pp, m);
    float d = smoothUnion(distStick.x, distHandle.x, 0.03);
    best.x = min(best.x, d);
    
    return best;
    
}

vec4 RayMarch(vec3 ro, vec3 rd) {
    vec4 dCol = vec4(0.);

    for(int i=0; i<MAX_STEPS; i++) {
        vec3 p = ro + rd*dCol.x;
        vec4 dS = GetDist(p);
        dCol.x += dS.x;
        dCol.yzw = dS.yzw;
        if(dCol.x>MAX_DIST || abs(dS.x)<SURF_DIST) break;
    }

    return dCol;
}

vec3 GetNormal(vec3 p) {
    float d = GetDist(p).x;
    vec2 e = vec2(.001, 0);

    vec3 n = d - vec3(
        GetDist(p-e.xyy).x,
        GetDist(p-e.yxy).x,
        GetDist(p-e.yyx).x);

    return normalize(n);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = p+f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i-p);
    return d;
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    vec2 m = iMouse.xy/iResolution.xy;

    vec3 col = vec3(.00001);
   
    vec3 ro = vec3(2.23*cos(1.58+iTime/2.234), 1.7*sin(2.78+iTime/3.43214), -iTime*0.7);

    //vec3 rd = GetRayDir(uv, ro, vec3(cos(iTime)/10., sin(iTime)/20., -(iTime+1.)), 1.);
	vec3 rd = GetRayDir(uv, ro,
                        vec3(
                            ro.x+7.234*sin(iTime/13.13),
                            ro.y+8.1*cos(iTime/14.48),
                            ro.z+5.97*sin(1.587+iTime/15.32443)),
                        1.);

    vec4 d = RayMarch(ro, rd);

    if(d.x<MAX_DIST) {
        vec3 p = ro + rd * d.x;
        vec3 n = GetNormal(p);

        float dif = clamp(dot(n, normalize(vec3(1,2,3)))*.5+.5, 0.2, 0.8);
        col = vec3(dif)/d.x;
        col *= d.yzw;
        col = M(col*3., vec3(0.00001), S(10., 20., d.x));
    }

    col = pow(col, vec3(.4545));	// gamma correction

    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}