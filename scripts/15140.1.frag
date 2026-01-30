#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );
	float light = sign(1.0-length(64.0*vec2(mod(position.x+time/5.0,0.0325),mod(position.y+cos(time/2.0)/8.0,0.0325))-vec2(1.0,1.0)));
	gl_FragColor = vec4( light*position.x,light*position.y,light*cos(time), 1.0 );

}