#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


#define iGlobalTime (time+surfacePosition.y*64.)
#define iMouse mouse
#define iResolution resolution

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// https://www.shadertoy.com/view/Ms3SzB
// inspired from Shane's ribbon variant of https://www.shadertoy.com/view/ls3XWM 

#define d  O = max(O,O-O+.55*(1.+.8*cos(A= K.x/K.y*a + iGlobalTime)) * smoothstep(1., .9, 8.*abs(r-.2*sin(A)-.5))); a += 6.28;

void mainImage( out vec4 O, vec2 U )
{
    U = 4.*(U+iMouse.xy)/iResolution.y;
    vec2 K = ceil(U); U = 2.*fract(U)-1.;  // or K = 1.+2.*floor(U) to avoid non-fractionals
    float a = atan(U.y,U.x), r=length(U), A;
    
	O -= O;  
    d d d d d d d
        
    O *= vec4(vec3(0.025/(0.025+length(mouse-(gl_FragCoord.xy/resolution)))),1);
    O = pow(O, vec4(.75,.5+length(O),.6-0.2*length(O),0));  
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

void main( void ) {
	mainImage( gl_FragColor, 2.*(surfacePosition+vec2(.5))*resolution.x );
}