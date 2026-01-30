#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	float disth=0.2;
	float distv=0.2;
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) -mouse+disth/1.;
		if(position.y>disth || position.y<disth/1.05)	
		gl_FragColor = vec4(0,1.0,mouse.x,1);
	else
		gl_FragColor = vec4(1.0,1.0,0,1);
	
}