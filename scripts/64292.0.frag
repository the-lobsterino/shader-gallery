/*
 * Original shader from: https://www.shadertoy.com/view/MdtfDl
 */

#extension GL_OES_standard_derivatives : enable

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
// variant of https://shadertoy.com/view/ldfcRS

// --- noise from procedural pseudo-Perlin (better but not so nice derivatives) ---------
                    // ( adapted from IQ )

float noise3( vec3 x ) {
    vec3 p = floor(x),f = fract(x);

    f = f*f*(3.-2.*f);  // or smoothstep     // to make derivative continuous at borders

#define hash3(p)  fract(sin(1e3*dot(p,vec3(1,57,-13.7)))*4375.5453)        // rand
    
    return mix( mix(mix( hash3(p+vec3(0,0,0)), hash3(p+vec3(1,0,0)),f.x),       // triilinear interp
                    mix( hash3(p+vec3(0,1,0)), hash3(p+vec3(1,1,0)),f.x),f.y),
                mix(mix( hash3(p+vec3(0,0,1)), hash3(p+vec3(1,0,1)),f.x),       
                    mix( hash3(p+vec3(0,1,1)), hash3(p+vec3(1,1,1)),f.x),f.y), f.z);
}

#define noise(x) (noise3(x)+noise3(x+11.5)) / 2. // pseudoperlin improvement from foxes idea 

void mainImage( out vec4 O, vec2 U ) // ------------ draw isovalues
{
    vec2 u = U/iResolution.y;
    U = 6.*u - iTime;
    O -= O; 
  // O += noise(vec3(U*4.,0)); return;
    for (float z=0.; z<=1.; z+=.1) { // consider 1 isovalue per altitude
        float n = ( 1.8*noise(vec3(U.x-U.y*.1,U.y/.6,.0*iTime)) -.8 -.2) / .6,
              v = smoothstep(1.5+12.*abs(u.y-.5),0., abs(n-z)/fwidth(n));
                 // /12./abs(u.y-.5);
	 // O += v * vec4(.5,1,1,1);
	    O += v * (.5+.5*cos(6.3*n + vec4(0,23,21,0) ));
        U.y -= .2;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}