#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;


void main( void ) 
{
        vec2 O = gl_FragColor.xy;
	vec2 U =  gl_FragCoord.xy;
	gl_FragColor = .19 / abs( 30.*length(U+=U-(O=resolution.xy))/O.y 
                 - sin ( 7.*atan(U.y,U.x)  - time ) 
                 - .1*vec4(111,51,19,10) );;

}
