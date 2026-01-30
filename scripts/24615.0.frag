#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float u = 
		mix( 
			sin((floor(gl_FragCoord.y/42.-gl_FragCoord.x/14.)/ resolution.y ) * 246.0  ) +
			sin((floor(gl_FragCoord.x/1.)/ resolution.y +mouse.x) * 6.0 ) 
		      ,0.,3.);
	
	gl_FragColor =vec4(1.0,.60,.40,1.0) * (.01+u);

}