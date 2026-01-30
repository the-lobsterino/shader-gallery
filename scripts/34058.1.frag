#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
void main( void ) {

	vec2 s = surfacePosition;

	gl_FragColor = vec4( 0,0,0,1 );
	
	float onepx = 1./min(resolution.x, resolution.y);
	float width = 1.5*onepx;
	float l = length(s);
	
	gl_FragColor.rgb = max(gl_FragColor.rgb, vec3(mix(1.,0.,abs(l-.2)/width)));
	gl_FragColor.rgb = max(gl_FragColor.rgb, vec3(0,1,0)*(mix(1.,0.,abs(l-.03-.17*fract(time*0.5))/width)));
	
}