#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
uniform sampler2D backgroundSurface;

void main( void ) {
	
	vec2 uv = surfacePosition;
	
	vec4 a = texture2D( backgroundSurface, gl_FragCoord.xy/resolution );
	
	vec3 b = fract( vec3( uv, fract(dot(uv,uv.yx)) ) );
	
	vec3 n = a.xyz + (b - a.zxy) * 0.125;
	
	gl_FragColor = vec4( n, 1.0 );

}