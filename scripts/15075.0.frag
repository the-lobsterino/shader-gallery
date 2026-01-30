#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.y );
	float len = 1.0-abs(mod(length(vec2(position.x,position.y))-0.5+time/5.0, 0.05));
	float color = pow(len,100.0);
	gl_FragColor = vec4( pow(color,0.5)*3.0,pow(color,position.y),pow(color,position.x), 1.0 );

}