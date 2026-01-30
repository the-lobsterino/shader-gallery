#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;
 
float rand3d(vec3 a){
	return fract(a.z + cos(a.x*a.y*22424.0)*sin(a.x*a.y*224.0) * 345.2);
} 
void main( void ) {
	
	vec2 p = length(surfacePosition)*vec2(sin(atan(surfacePosition.x, surfacePosition.y)*1.5), cos(atan(surfacePosition.x, surfacePosition.y)*1.5));
	float color = rand3d(vec3(pow(abs(p)*00.0125, vec2(cos(time*0.51+length(surfacePosition)*10.))), 0.1*time)); 
	gl_FragColor = vec4( vec3( color ), 1.0 );
	
	gl_FragColor += 0.9*(texture2D(backbuffer, gl_FragCoord.xy/resolution) - gl_FragColor);
}