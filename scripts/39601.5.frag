#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

//https://www.shadertoy.com/view/4djcRD

#define CS(a)  vec2(cos(a),sin(a))
#define rnd(x) ( 2.* fract(456.68*sin(1e3*x+mod(time+1e5,100.))) -1.) // NB: mod(t,1.) for less packed pattern
#define T(U) texture2D(backbuffer, (U)/R, -10.)
const float r = 1.5, N = 50., da = .5, // width , number of worms , turn angle at hit
            L = 10., l= 6.;            // sinusoidal path parameters: L straight + l turn

void main()
{
    vec2 R = resolution.xy;
    vec4 O = vec4(0,0,0,1);
	vec2 U = gl_FragCoord.xy;
    if (T(R).x==0.) { U = abs(U/R*2.-1.); O  = vec4(max(U.x,U.y)>1.-r/R.y); O.w=0.; return; }

    if (U.y==.5 && T(U).w==0.) {                           // initialize heads state: P, a, t
        O = vec4( R/2. + R/2.4* vec2(rnd(U.x),rnd(U.x+.1)) , 3.14 * rnd(U.x+.2), 1);
        if (T(O.xy).x>0.) O.w = 0.;                        // invalid start position
        return;
    }
    
    O = T(U);
    
    for (float x=.5; x<N; x++) {                           // draw heads
        vec4 P = T(vec2(x,.5));                            // head state: P, a, t
        if (P.w>0.) O += smoothstep(r,0., length(P.xy-U))  // draw head if active
                         *(.5+.5*sin(.01*P.w+vec4(0,-2.1,2.1,1)));  // coloring scheme
    }
    
    if (U.y==.5) {                                         // head programms: worm strategy
        vec4 P = T(U);                                     // head state: P, a, t
        if (P.w>0.) {                                      // if active
            float a = P.z;
           a -= 100./sqrt(P.w);
            	for (int ii=0;ii<1000;ii++)
		{
            		if ( T(P.xy+(r+2.)*CS(a)).w < 0. && a > 13. )  break;
		   	a += da; 
		}
            if (a>=13.) { O.w = 0.; return; }              // stop head
            O = vec4(P.xy+CS(a),mod(a,6.2832),P.w+1.);     // move head
        }
    }
	
	gl_FragColor = O;
	gl_FragColor.a = 1.;
}