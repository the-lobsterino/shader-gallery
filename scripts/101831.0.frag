/*
 * Original shader from: https://www.shadertoy.com/view/flGfWy
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

// --------[ Original ShaderToy begins here ]---------- //
// variant of https://shadertoy.com/view/7tGfzd

#define H(p)        fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453)
#define H2(p)       fract(sin((p)*mat2(127.1,311.7, 269.5,183.3)) *43758.5453123)
#define cross(a,b) ( (a).x*(b).y - (a).y*(b).x ) 
  #define R(a)      mat2(cos(a+vec4(0,11,33,0)))       // rotation

float line(vec2 p, vec2 a,vec2 b) {                    // --- distance to line
    p -= a, b -= a;
    float h = clamp(dot(p, b) / dot(b, b), 0., 1.);    // proj coord on line
    return length(p - b * h);                          // dist to segment
}
#define L(A,B) line(U,A.xy,B.xy)

              // midpoint   jittering
#define mid(A,B)  (A+B)/2. + vec4( J(A.zw,B.zw), 0,0 )
//#define k iMouse.y/R.y
  #define k .2
//#define J(A,B)  k* ( H((A+B)/2.) -.5 ) *(B-A)                // repro the original
//#define J(A,B)  k* ( H((A+B)/2.) -.5 ) *(B-A) *sin(iTime)*2. //     animated
//#define J(A,B)  k* ( H((A+B)/2.) -.5 ) *length(A-B)          // cheap diagonal jittering
//#define J(A,B)  k* ( H2((A+B)/2.) -.5) *length(A-B)          // full 2D jittering
  #define J(A,B)  k* ( H2((A+B)/2.) -.5)*R(iTime) *length(A-B) //     animated

void mainImage(out vec4 O, vec2 u) {
     vec2  R = iResolution.xy,
           U = ( u - .5*R ) /R.y + vec2(.5,.4);  
     // .xy = jittered version, .zw = non-jiterred, used for coherent seeding
     vec4  A = vec4(0), B = vec4(1,0,1,0), C = vec4(.5,.87,.5,.87), D,E,F;

     for (int i=0; i<64 ; i++ ) {       // --- fractal loop
	 if (i >= int(log2(R.y))-2) break;
         D = mid(A,B), E = mid(A,C), F = mid(B,C);
         float a = cross(U-F.xy,A-F), b = cross(U-E.xy,B-E), c = cross(U-D.xy,C-D);
           a > 0. && b < 0. ? A = E, B = F             // fractal recursion: 3 branches
         : c > 0.           ? A = D, C = F
         :                  ( B = D, C = E );
    }  
    O = vec4( sqrt( smoothstep(1./R.y,0., min(min( L(A,B), L(A,C) ), L(B,C) ) ) )); // draw triangle
} 
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}