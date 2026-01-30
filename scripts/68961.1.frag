/*
 * Original shader from: https://www.shadertoy.com/view/WsKcD3
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution, 1.)
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //

#define rot(a)    mat2( cos(a+vec4(0,11,33,0)) )                    // rotation                  
#define C(e,r,w)  t = min(t,  max( max(abs( length(q.xy*vec2(1,e))-r) , abs(q.z)-w ) -.3 , max(-q.y-1., H ) ) )             // 1/2 flat ring band with holes
#define H         .2 - length(vec2(mod(atan(q.y,q.x),.63)-.31,q.z)) // holes
void mainImage(out vec4 O, vec2 U) {    
    float t=9.,s;
    vec3  R = iResolution, e = vec3(1,-1,0), X=e.xzz, Y=e.zxz, Z=e.zzx,
      //  M =  iMouse.xyz/R -.5,
          M = iMouse.z > 0. ? iMouse.xyz/R -.5: vec3(8,4,0)/1e2*cos(iTime+vec3(0,11,0)),
          D = normalize(vec3( U+U, -3.5*R.y ) - R ),             // ray direction
          p = 50./R, q,r;                                        // marching point along ray 

    O-=O;
    for ( int i = 0; i < 100 ; ++i ) {
        if (O.x >= 1. || t <= .01) break;
        q = p, t=9.,
        q.yz *= rot( .5+6.*M.y),                                 // rotations
        q.xz *= rot( 2.-6.*M.x),
	s = length(vec2(q.z>0.?q.z*q.z/40.:q.z/2.8,q.x))-6.4;
        t = min(t, s = max( s, abs(q.y)-.6) ), // sole
        t = min(t, s = max( s, abs(q.y)-.5) ), // sole
        //t = min(t, s = max( length(q.zx/vec2(2.45,6./q.x))-6.4, abs(q.y)-.68) ), // sole
        q.y-=1.5, q.z -= 7., 
        r = q, q.yz*= rot(1.), q.y-=3.,q.z+=1.5, t = C(1,6.,.5), // ankle loop
        q = r, q.yz*= rot(-.5), q.y += .5, t = C(.8,6.1,1.5),    // main loop
        q = r, q.z += 16.,
        q.xz *= rot(-.3), C(2,6.,1.),                            // toes loops
        q.xz *= rot (.6), C(2,6.,1.),                                  
        p += .5*t*D;                                             // step forward = dist to obj          
        O += .01;
    }

    O = exp(-2.5*O);
    if ( t!= s ) O *= vec4(1,.5,.5,1);                           // coloring
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}