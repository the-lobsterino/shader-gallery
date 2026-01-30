/*
 * Original shader from: https://www.shadertoy.com/view/wsyBDm
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

// Emulate some GLSL ES 3.x
int int_mod(int a, int b)
{
    int c = (a - (b * (a/b)));
    return (c < 0) ? c + b : c;
}
ivec3 int_mod(ivec3 a, int b)
{
    return ivec3(
       int_mod(a.x, b),
       int_mod(a.y, b),
       int_mod(a.z, b));
}

// --------[ Original ShaderToy begins here ]---------- //
// variant of "hexastairs"  https://shadertoy.com/view/3sGfWm
// using "hexa world" https://shadertoy.com/view/tsKBDD

#define H(I)   fract(1e4*sin(1e4*length(vec2(I))))         // cheap hash
//#define H(I) hash(uvec3(I.xy,0))                         // the one used in "hexa world": integer hash from https://www.shadertoy.com/view/XlXcW4
#define h(x,y) int( 4.* H( I + ivec3(x,y,0) ) )            // O-3 random int at relative cell(dx,dy)

void mainImage( out vec4 O, vec2 u )
{
    vec2 R = iResolution.xy, 
         U = 12.* u / R.y + iTime;                         // === std hexagonal tiling data

    U *= mat2(1,0,.5,.87);                                 // parallelogram frame
    vec3  V = vec3( U, U.y-U.x +3. );                      // 3 axial coords
    ivec3 I = ivec3(floor(V)), J;
          I += I.yzx;
          J = int_mod(I , 3);                              // J.xy = ~ hexagon face
    int   f = J.x==2 ? 1 : J.y==2 ? 2 : 0,                 // f: front face id 
          b = J.x==1 ? 1 : J.y==0 ? 2 : 0, k,o=0;          // b: back face id
    I.x += 4; I /= 3;                                      // I.xy = hexagon id
    V = mod( V + vec3( I.y, I.y+I.x, I.x ), 2. );          // local coords
    k = h(0,0);                                            // rand values per hexagon
    
                                                           // === custom hexatile pattern drawing
    if (k==3) {                                            // --- plain cubes (i.e. stairless)
        k = f+2;                                           // base color = face id
#define check(i,j,s, X,Y)  if (h( i, j)==s && abs(X-1.5)<.25 && Y<.75)  k++
             check(-f,-1, 1-f,  V.x+float(f), (f==2 ? V.x : f==1 ? V.y : V.z) );    // regular doors
        else check( 0, 1,  1,   V.y   , 2.-V.z );          // horiz doors
        else check( 1, 1,  0,   V.z   , 2.-V.y );         
        else check(-1, 0,  2,   V.y+1.,  V.x   );          // tilted doors
        else check( 1, 0,  2,   V.z+1., 2.-V.x );             
    }
    else {                                                 // --- cubes with stairs
        float s=1.,f=1.,l=1.;
        V = k==1 ? f=-f, l=0., V.yzx                       // apply random hexagon rotation
          : k==2 ? s=-s, V.yxz : V;
        s *= mod(8.*V.y+l,2.) - 1.;                        // stair striping
        l =  2.*V.x-V.y +(abs(s)-9.)/8.;                   // stair dented slope
        k =  f*( 2.*V.x-V.y-1.)>.5 || -f*l>.5 ? o=1, b+2   // draw rear faces. set o for ambiant occlusion
           : f*l > .3 ? k+2                                // draw stair sides
           :  s  < 0. ? k+1 : k;                           // draw stair steps
    }
    O = vec4(int_mod(k,3))/2.;
    if (o>0) O *= min(1.,length(V-1.)*.8);                 // ambiant occlusion behind stairs
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}