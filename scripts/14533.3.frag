#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy )*100.;
	float ripple = 0.;
	vec2 center = vec2(50,50);
	float l = length(position-center);
	float l2 = length(position-mouse*100.//center+vec2(25,0)
			 );
	
	float factor = .5;		
	ripple+=sin(l-time*4.);
	ripple+=sin(l2-time*4.);
	
	gl_FragColor = vec4(clamp(ripple,0.1,.9));

}