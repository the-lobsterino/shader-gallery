#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float color = 0.5;
	color = sin( time);
	vec2 pos = gl_FragCoord.xy / resolution.xy;
	
	gl_FragColor = vec4( abs(sin(pos.x/pos.y)), 1.0 , 1.0, 1.0 );
	if (pos.x > 0.5+ 0.045 && pos.x < 0.5 + 0.055)
	{
		gl_FragColor = vec4( 0.5, 0.5 , 1.0, 1.0 );
	}	
	

}