/*
 * Original shader from: https://www.shadertoy.com/view/fscGDH
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
#define iResolution vec3(resolution,1.)

// --------[ Original ShaderToy begins here ]---------- //
#define r(a)    mat2( cos(a+vec4(0,11,33,0)) )                // rotation                  

void mainImage(out vec4 O, vec2 U) {    
    vec3  R = iResolution,     // 3.*R.y for normal field of view
          D = normalize(vec3( U+U, -R.y ) - R ),              // ray direction
          p = 20./R, q,                                       // marching point along ray 
          M = cos(iTime+vec3(1,31,1)) / vec3(3,6,2);          // camera animation
    float t=9.,d;

    O += 1.1-O;
    for (int i = 0; i < 30; ++i) { //  O.x>0. just for security
        if (O.x <= 0. || t <= .01) break;
        q = p, 
        q.yz *= r( .5+M.y ),                                  // rotations
        q.xz *= r(    M.x ),   // R0=20   R1=17
        t = 14. - length(vec2(d=length(q.xz)-19., q.y)),      // abs for inside + outside
        p += t*D;                                             // step forward = dist to obj
                                                              // texture
        O-=.01;
    }
    U = min( abs(U = sin(21.*atan(q.yz,vec2(d,q))) ) / fwidth(U), 1.); // mesh
    O *= U.x * U.y;     
	//O *= vec4(U,0,0); // colored
  //U  = 18.*atan(q.zy,vec2(q.x,d)); O *= .5+.5*sin(U.x+U.y);          // strips
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 2.;
}