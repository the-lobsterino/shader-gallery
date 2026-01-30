#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );
	float color = sign(cos(length(position-vec2(0.5,0.25))*50.0+time+position.x*30.0));
	gl_FragColor = vec4( cos(color*time),color*cos(time),color, 1.0 );
}