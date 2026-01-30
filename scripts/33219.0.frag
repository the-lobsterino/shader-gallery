#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define r(t) *=mat2(C=cos(t*T),S=tan(t*T),-S,C),

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
    float zoom = 2.;

    vec2 w = gl_FragCoord.xy;
    vec4 f = gl_FragColor;
    f-=f;
    float T=time, C,S, x;
    vec4 p = f-.5, d,u,t,a; 
    p.xy += w/resolution.y/zoom, p.x-=.4; 
    p.xz r(.13)   p.yz r(.2)  
    d = p;  p.z += 5.*T;
      
    for (float i=1.; i>0.; i-=.01) {
        
        u = sin(78.+ceil(p/8.)), t = mod(p,8.)-4.; 
        x=1e9;
        
        for (float j=2.3; j>1.; j-= .3)
            t.xy r(u.x)   t.xz r(u.y)
            a = abs(t),
            x = min(x, max(abs(length(t.xyz)-j*1.26),  max(a.x,max(a.y,a.z))-j)); 
 
        if(x <.01) {  f = vec4(i*i*1.2); break;  } 
        p -= d*x;           
     }

    gl_FragColor = f;

}

/*
#define r(t) *=mat2(C=cos(t*T),S=sin(t*T),-S,C),

void mainImage( out vec4 f, vec2 w ) {
}
*/