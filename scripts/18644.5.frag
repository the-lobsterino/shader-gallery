#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = 0.15*surfacePosition;//( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	#define time time + length(p)*100.
	float color = 0.0;
	
	const float iLim = 128.;
	float iMax = 128. + 32.*cos(time);
	vec2 z = vec2(0.);
	for(float i = 0.; i < iLim; i++){
		z = vec2(z.x*z.x + cos(time)*z.y*z.y, z.x*z.x + sin(time)*z.y*z.y) + p*i;
	}
	
	color = fract(length(z));

	gl_FragColor = vec4( color );

}