/*
 * Original shader from: https://www.shadertoy.com/view/7d3GD8
 */

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
#define hue(v) ( .6 + .6 * cos( v  + vec4(0,23,21,0)  ) )     // hue

void mainImage(out vec4 O, vec2 U) {    
    vec3  R = iResolution,     // 3.*R.y for normal field of view
          D = normalize(vec3( U+U, -R.y ) - R ),              // ray direction
          p = 30./R, q,                                       // marching point along ray 
          M = cos(iTime+vec3(0,11,0)) / vec3(1,2,.5);         // camera animation
    float t=9.,d;

    O += 1.1-O;
    for (int i = 0; i < 100; ++i) {
        if (O.x <= 0. || t <= .01) break; //  O.x<=0. just for security
        q = p, 
        q.yz *= r( .5+M.y ),                                  // rotations
        q.xz *= r(    M.x ),          // R0=20        R1=17
        t = abs( length(vec2(d=length(q.xz)-20., q.y)) - 17.),// abs for inside + outside
        p += .9*t*D;                                          // step forward = dist to obj
        O-=.01;
    }

    U  = 2.* atan( q.zy, vec2(q.x,d) );                       // strip texture  
    O *= ( .5 + .5* sin(9.*(U.x+=U.y)) )  * hue(U.x);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}