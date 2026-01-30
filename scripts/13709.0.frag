#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float zoom = 200.0;
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) * zoom;


	
	float blue = sin(pos.y) - sin(pos.x); 
	float green = cos(pos.y + 10.0*sin(time)) - sin(pos.x - 10.0*cos(time));
	float red = cos(pos.y - 10.0*sin(time)) - sin(pos.x + 10.0*cos(time));
	
	gl_FragColor = vec4( (red + green)/2.0, (red - green)/2.0, blue*2.0, 1.0 );

}