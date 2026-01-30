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

const float PI = 3.1415926;
const float TAU = PI * 2.0;

void main( void ) {
	
	vec2 uv = surfacePosition/2.0;
	vec4 last = texture2D(backgroundSurface,gl_FragCoord.xy/resolution);
	float z = dot(uv,uv); 
	z = mix(z,1.0-uv.x*uv.y,max(0.0,cos(fract(time)*TAU)));
	vec3 o = fract( last.yzx + vec3(uv.y,uv.x,z) );
	gl_FragColor = vec4( o, 1.0 );

}