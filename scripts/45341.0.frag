/*
 * Original shader from: https://www.shadertoy.com/view/MljBDG
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 U = 12.*gl_FragCoord.xy/resolution.y, V; U.x -= time; V = floor(U);
	U.y = dot( cos( (8.*(time+V.x)+-4.-V.y) * max(0.,.10-length(U = fract(U)-.5)) - vec2(33,0) ), U);
	gl_FragColor += smoothstep(-1.,1.,U/fwidth(U)).y;
}