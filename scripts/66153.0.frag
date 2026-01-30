// 170720N a strange rainbow :)

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 po = surfacePosition;//( gl_FragCoord.xy / resolution.xy );
	po *= 3.;

	gl_FragColor = vec4( 
		fract(vec3(
			sin(time + po.x*po.x - po.y*po.y), 
			sin(time + po.x*po.y),
			sin(time + po.x*po.x + po.y*po.y)
			)), 
		1.0 );

}