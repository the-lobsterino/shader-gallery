#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
        
	vec2 p = ( gl_FragCoord.xy / resolution.xy + mouse);
	
	float r = cos (p.x * p.y * 3.14 * 10.0 + time );
	float g = tan (p.x * p.y * 3.14 * 100.0 + time );
	float b = sin (p.x * p.y * 3.14 * 200.0 + time);
	gl_FragColor = vec4( r, g, b, 1.0 );
		


}