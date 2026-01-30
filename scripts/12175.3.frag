#ifdef GL_ES
precision mediump float;
#endif

//uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define s 0.1
void main( void ) {

	vec2 ms = mouse * resolution;
	//float pix=0.;
	float pix = 1. - abs( (gl_FragCoord.x - ms.x)*(gl_FragCoord.x - ms.x) + (gl_FragCoord.y - ms.y)*(gl_FragCoord.y - ms.y) - (0.05 *s*s * (resolution.x * resolution.x)))/s*1600./(resolution.x*resolution.x);
	gl_FragColor = vec4( pix , pix, pix, 0.0 );
}