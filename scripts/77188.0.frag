/*
 * Original shader from: https://www.shadertoy.com/view/7tGGWz
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
// All the distance functions from:http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
// raymarching based from https://www.shadertoy.com/view/wdGGz3
#define MAX_STEPS 64
#define MAX_DIST 64.
#define SURF_DIST .001
#define Rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))
#define matRotateX(rad) mat3(1,0,0,0,cos(rad),-sin(rad),0,sin(rad),cos(rad))
#define matRotateY(rad) mat3(cos(rad),0,-sin(rad),0,1,0,sin(rad),0,cos(rad))
#define matRotateZ(rad) mat3(cos(rad),-sin(rad),0,sin(rad),cos(rad),0,0,0,1)

vec3 path(float z)
{
    vec3 p = vec3(sin(z) * .6, cos(z * .5), z);
    return p;
}

vec4 combine(vec4 val1, vec4 val2 ){
    return (val1.w < val2.w)?val1:val2;
}

float B3D(vec3 p, vec3 s) {
    p = abs(p)-s;
    return max(max(p.x,p.y),p.z);
}
vec4 GetDist(vec3 p) {
    vec3 prevP = p;
    p.z+=iTime*1.0;
    p.xy -= path(p.z).xy;
    p.z+=iTime*0.5;
    p.z=mod(p.z,1.0)-0.5;
    float y=p.y;
    float d = B3D(p,vec3(0.01));
    for (float i = 0.; i < 5.; i++) {
            p.xz*=Rot(radians(90.0));
            p.yz*=Rot(radians(38.0));
            p=abs(p)-(3.3*pow(.54, i));
            d=B3D(p,vec3(0.18));
	}
    
    vec3 col = vec3(1.0);
    
    return vec4(col,d*0.6);
}

vec4 RayMarch(vec3 ro, vec3 rd) {
    vec4 r = vec4(0.0,0.0,0.0,1.0);
    
    float dist;
    for(int i=0; i<MAX_STEPS; i++) {
        vec3 p = ro + rd*r.w;
        vec4 dS = GetDist(p);
        dist =  dS.w;
        r.w += dS.w;
        r.rgb = dS.xyz;
        
        if(r.w>MAX_DIST || dS.w<SURF_DIST) break;
    }
    
    return r;
}

vec3 GetNormal(vec3 p) {
    float d = GetDist(p).w;
    vec2 e = vec2(.001, 0);
    
    vec3 n = d - vec3(
        GetDist(p-e.xyy).w,
        GetDist(p-e.yxy).w,
        GetDist(p-e.yyx).w);
    
    return normalize(n);
}

vec2 GetLight(vec3 p) {
    vec3 lightPos = vec3(3,5,0);
    vec3 l = normalize(lightPos-p);
    vec3 n = GetNormal(p);
    
    float dif = clamp(dot(n, l)*.5+.5, 0., 1.);
    float d = RayMarch(p+n*SURF_DIST*2., l).w;
    
    float lambert = max(.0, dot( n, l))*0.2;
    
    return vec2((lambert+dif),0.9) ;
}

vec3 R(vec2 uv, vec3 p, vec3 l, float z) {
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
    
    float t = iTime*2.0;
    vec3 col = vec3(1.0);
    vec3 ro = vec3(0.0,0.0,1.0);
    vec3 rd = R(uv, ro, vec3(0,0.0,0), 1.0);
    rd*=matRotateZ(radians(iTime*15.0));
	vec4 r = RayMarch(ro, rd);
    
    if(r.w<MAX_DIST) {
        vec3 p = ro + rd * r.w;
        vec3 n = GetNormal(p);
        vec2 dif = GetLight(p);
        col = vec3(dif.x)*r.rgb;
        col *= dif.y;
        col *= exp( -0.0001*r.w*r.w*r.w );
    }

    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}