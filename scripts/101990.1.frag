/*
 * Original shader from: https://www.shadertoy.com/view/cd3XR2
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution,1.)
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// Fork of "flex links radial - v4" by FabriceNeyret2. https://shadertoy.com/view/DdcXRj
// 2023-03-29 09:01:42

// radial variant of https://shadertoy.com/view/mdcXD7

#define rot(a)        mat2(cos(a+vec4(0,11,33,0)))         // 2D rotation 
#define rot3(P,A,a)  ( mix( A*dot(P,A), P, cos(a) ) + sin(a)*cross(P,A) ) // 3D rot around an arbitrary axis
#define d(q)  (t = length(q) - 4., a = fract(vec3( atan((q).z,(q).x), atan((q).y,length((q).yxz)),0) /.88) - .5, min(t, length(q)*length(a.xy) - 1.35) )

void mainImage(out vec4 O, vec2 U)
{
    float t=11.;
    vec3  R = iResolution,
          D = normalize(vec3(U+U, -3.85*R.y) - R),          // ray direction
          p = vec3(0,0,90), q,a,                           // marching point along ray 
          M = iMouse.z > 0. ? 3.*iMouse.xyz/R -3.
                            :  vec3(.0,.5,0) * cos(.5*iTime + vec3(0,11,0)); 
        p.yz *= rot(-M.y),                                 /* rotations */
        p.xz *= rot(-M.x-1.57), 
        D.yz *= rot(-M.y),
        D.xz *= rot(-M.x-1.47);

    O=vec4(1);
    for (int i=0;i<200; i++ ) {        // march scene  
        if (t <= .5) break;
        q = rot3( p, vec3(sin(iTime),0,cos(iTime)), 14.14 *smoothstep(.0023, .099, 1./length(p)) ), 
        t = d(q),
        p += .09*t*D;                                       // step forward = dist to obj
        O-=0.005;
    }

 // O *= O*O*2.;                                           // color scheme
    if (length(q)<1.8)                                     //   sphere
        a = cos(4.28*a), t = a.x*a.y,
        O.rgb *= .5+.5*smoothstep(1.,0.,t/fwidth(t)); 
    else
        D = vec3(-1,1,0)*1e-3,                             // efficient FD normals https://iquilezles.org/articles/normalsSDF/
        O.rgb *= .7 -.8* normalize(  D.xxy* d( q + D.xxy ) + D.xyx* d( q + D.xyx ) + D.yxx* d( q + D.yxx ) + D.yyy * d( q + D.yyy ) );
} 
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}