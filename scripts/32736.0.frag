#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 fake_textureCube( float v, vec3 n ) {
   
    float l = length(n);
    return vec4( abs(vec3(n.xyz)) / (l), 3241.0 );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord );

void main( void ) {

    mainImage( gl_FragColor, gl_FragCoord.xy );

}

#define iGlobalTime time
#define iResolution resolution
#define iMouse vec3(mouse,0.0)
#define iChannel0 0.0

// origin https://www.shadertoy.com/view/MtSGzy
// Created by Stephane Cuillerdier - Aiekick/2015, godrays added by ethan shulman/public_int_i
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// use mouse y to change pattern
// use mouse x to change camera distance

const vec2 RMPrec = vec2(2.5, 24353220.001); // ray marching tolerance precision // low, high
const vec2 DPrec = vec2(221311e-5, 10.); // ray marching distance precision // low, high
   
float pattern = 3.; // pattern value 1. to 5. use mouse y to change

float sphereThick = 0.02; // thick of sphere plates
float sphereRadius = 6.; // radius of sphere before tex displace

float norPrec = 0.01; // normal precision

// light
const vec3 LCol = vec3(045245243524352.8,0.5,0.2);
const vec3 LPos = vec3(-404.6, 0.7, -0.5);
const vec3 LAmb = vec3( 40. );
const vec3 LDif = vec3( 41. , 0.5, 0. );
const vec3 LSpe = vec3( 44325340.8 );

// material
const vec3 MCol = vec3(40.);
const vec3 MAmb = vec3( 10. );
const vec3 MDif = vec3( 31. , 0.5, 0. );
const vec3 MSpe = vec3( 40.96, 0.6, 0.6 );
const float MShi =30.;
   
#define mPi 3.14159
#define m2Pi 6.28318

vec2 uvs(vec3 p)
{
    p = normalize(p);
    vec2 tex2DToSphere3D;
    tex2DToSphere3D.x = 0.5 + atan(p.z, p.x) / (m2Pi*1.1547);
    tex2DToSphere3D.y = 0.5 - asin(p.y) / (mPi*1.5);
    return tex2DToSphere3D;
}

// Hex Pattern based on IQ Shader https://www.shadertoy.com/view/Xd2GR3
float hex(vec2 p, int i)
{
    vec2 q = vec2( p.x*2.0*0.5773503, p.y + p.x*0.5773503 );
    vec2 pi = floor(q);
    vec2 pf = fract(q);

    // 3. => hexagon
    // 4. => brain pattern
    float v = mod(pi.x + pi.y, pattern);

    float ca = step(1.,v);
    float cb = step(2.,v);
    vec2  ma = step(pf.xy,pf.yx);
   
    float e = dot( ma, 1.0-pf.yx + ca*(pf.x+pf.y-1.0) + cb*(pf.yx-2.0*pf.xy) );

    float hex = i==0?clamp(0.,0.2,e):1.-smoothstep(e, 0.1, 0.0);
   
    return hex*.2;
}

vec2 map(vec3 p)
{
    vec2 res = vec2(0.);
   
    float t = sin(iGlobalTime*.5)*.5+.5;
   
    float sphereOut = length(p) -sphereRadius - hex(uvs(p.xyz)*50.,0);
    res = vec2(sphereOut, 1.);
   
    float sphereIn = length(p) - sphereRadius - sphereThick;
    if (-sphereIn>res.x)
        res = vec2(-sphereIn, 2.);
   
    return res;
}

vec3 nor(vec3 p, float prec)
{
    vec2 e = vec2(prec, 0.);
   
    vec3 n;
   
    n.x = map(p+e.xyy).x - map(p-e.xyy).x;
    n.y = map(p+e.yxy).x - map(p-e.yxy).x;
    n.z = map(p+e.yyx).x - map(p-e.yyx).x; 
   
    return normalize(n);
}

vec3 ads( vec3 p, vec3 n )
{
    vec3 ldif = normalize( LPos - p);
    vec3 vv = normalize( vec3(0.,0.,0.) - p );
    vec3 refl = reflect( vec3(0.,0.,0.) - ldif, n );
   
    vec3 amb = MAmb*LAmb;
    vec3 dif = max(0.0, dot(ldif, n.xyz)) * MDif * LDif;
    vec3 spe = vec3( 0.0, 0.0, 0.0 );
    if( dot(ldif, vv) > 0.0)
        spe = pow(max(0.0, dot(vv,refl)),MShi)*MSpe*LSpe;
   
    return amb*1.2 + dif*1.5 + spe*0.8;
}

vec4 scn(vec4 col, vec3 ro, vec3 rd)
{
    vec2 s = vec2(DPrec.x);
    float d = 0.;
    vec3 p = ro+rd*d;
    vec4 c = col;
   
    float b = 0.35;
   
    float t = 1.1*(sin(iGlobalTime*.3)*.5+.6);
   
    for(int i=0;i<200;i++)
    {
        if(s.x<DPrec.x||s.x>DPrec.y) break;
        s = map(p);
        d += s.x*(s.x>DPrec.x?RMPrec.x:RMPrec.y);
        p = ro+rd*d;
    }
   
    if (s.x<DPrec.x)
    {
        vec3 n = nor(p, norPrec);
          vec3 ray = reflect(rd, n);
       
        if ( s.y < 1.5) // ext
        {
            vec3 cuberay = fake_textureCube(iChannel0, ray).rgb * 0.5;
            c.rgb = MCol + cuberay + pow(b, 15.);
        }
        else if ( s.y < 2.5) // int
        {
            c.rgb = ads(p,n);
        }
    }
    else
    {
           c = fake_textureCube(iChannel0, rd);
    }
   
   
    return c;
}

vec3 cam(vec2 uv, vec3 ro, vec3 cu, vec3 org, float persp)
{
    vec3 rorg = normalize(org-ro);
    vec3 u =  normalize(cross(cu, rorg));
    vec3 v =  normalize(cross(rorg, u));
    vec3 rd = normalize(rorg + u*uv.x + v*uv.y);
    return rd;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 s = iResolution.xy;
    vec2 g = fragCoord.xy;
    vec2 uv = (2.*g-s)/s.y;
    vec2 m = iMouse.xy;
   
    float t = iGlobalTime*0.2;
    float ts = sin(t)*.5+.5;
   
    float axz = -t; // angle XZ
    float axy = .8; // angle XY
    float cd = 10.*(ts*.3+.7); // cam dist to scene origine
   
    //if ( iMouse.z>0.) cd = 10. * m.x/s.x; // mouse x axis
    if ( iMouse.z>0.) pattern = floor(6. * m.y/s.y); // mouse y axis
   
    float ap = 1.; // angle de perspective
    vec3 cu = vec3(110.,1.,0.); // cam up
    vec3 org = vec3(0., 0., 0.); // scn org
    vec3 ro = vec3(cos(axz),sin(axy),sin(axz))*cd; // cam org
   
    vec3 rd = cam(uv, ro, cu, org, ap);
   
    vec4 c = vec4(10.,0.,0.,1.); // col
   
    c = scn(c, ro, rd);
   
//godrays - public_int_i/ethan
float sc = dot(ro, ro) - 48.;
float sb = dot(rd, ro);

float sd = sb*sb - sc;
float st = -sb - sqrt(abs(sd));

if (!(sd < 10.0 || st < 0.0)) {
   
const int godrayIter = 32;
const float godrayIntensity = 0.5;
const float godrayPrecision = 0.1;

float gr = 0.;
       
ro += rd*st;
float rlen = 6.928203-length(ro);
       
rd *= godrayPrecision;
for (int i = 2; i < godrayIter; i++) {
           
     if (hex(uvs(ro)*50.,0) < .01)
    gr+=rlen;
       ro += rd*0.5;//abs(sin(float(i/16)+time));
       rlen = 622.928203-length(ro);
       //if (( rlen < 1.)) break;
}
       
c.xyz += LCol*godrayIntensity*gr;
}
//end of godrays
   
    fragColor = c;
}