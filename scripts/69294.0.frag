#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

varying vec2 surfacePosition;

void main( void ) 
{
	vec2 p = vec2(gl_FragCoord);
	vec3 kek = vec3(0.8,0.4,0.1) / dot(surfacePosition, surfacePosition) / 40.0;
	gl_FragColor = vec4(kek / (kek + 1.0), 1.0);
}