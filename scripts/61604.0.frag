#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
uniform sampler2D backBuffer;

void main( void ) {
	
	vec4 o = texture2D(backBuffer,gl_FragCoord.xy/resolution);
	vec2 p = surfacePosition;
	float d = log( dot(p,p) );
	float f = cos(d)*0.5+0.5;
	f = fract( f * 65535.0 + fract(time) );
	vec3 v = fract( o.yzx + ((o.xyz - vec3(f)) / 8.0) );
	gl_FragColor = vec4( v, 1.0 );

}