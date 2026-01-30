/*
 * Original shader from: https://www.shadertoy.com/view/DllSRr
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution,0.)
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// variant of https://shadertoy.com/view/DlsXRn
// variant of https://shadertoy.com/view/dlj3Dd

#define rot(a)  mat2(cos(a+vec4(0,11,33,0)))                // rotation 
#define H(p)    fract(1e4*sin(dot(p,R.xy-17.)))

void mainImage(out vec4 O, vec2 U)
{
    float t=9.,m, h, r=8.; 
    vec3  R = iResolution, 
          D = normalize(vec3(U+U, -12.*R.y) - R),           // ray direction
          p = vec3(0,0,20), q,a,                            // marching point along ray 
          M = iMouse.z > 0. ? 6.*iMouse.xyz/R -3.
              :  vec3( 1,.5,0) * cos(.3*iTime + vec3(0,11,0)); 
    p.y += 7.;
    O=vec4(1);
    for (float o = 1.; o > 0.; o-=.003) {                   // march scene
        if (t <= .001) break;
        q = p, // t = 9.,
        q.yz *= rot(-M.y),                                  // rotations
        q.xz *= rot(-M.x-1.57), 
        t = length(q) - r,
        a = abs(q), 
        m = max(a.x, max(a.y,a.z)), 
        q = m==a.x ? q.yzx : m==a.y ? q.xzy : q,        
        U = vec2(atan(q.x,q.z),atan(q.y,q.z))*q.z*4./3.1416,// kastorp's way : more regular
        U *= 2.*r/m, h = H(ceil(U)),
        q.xy = ( fract(U) - .5 ) / 2./r *.7,                // distance to walls
        t = min ( t+.4, max( t ,                            // trimmed by sphere
                  min( max(abs(q.x+sign(h-.5)*q.y),         // wall = random tile diagonal
                           .02-length(vec2(q.x-sign(h-.5)*q.y,(t+.2)*.2)) // hole in walls
                          ),
                       length(abs(.5-abs(fract(U)-.5)))/2./r*.7) ) ), // columns at wall ends
        p += .5*t*D;                                        // step forward = dist to obj
        O-=.003;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}