#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define white 1.0
#define black 0.0
#define red vec3(1,0,0)
void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
        float c = 1.;
	gl_FragColor = vec4( red , 1.0 );

}