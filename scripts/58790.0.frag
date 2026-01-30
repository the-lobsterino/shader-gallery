#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	float s = sin(time*15.951);
	float dy = 1.545 / ( 155. * abs(sin(p.y)*s) );
	gl_FragColor = vec4( sin(p.x*54.3+time*44.44)*0.3+dy * 0.5 * dy, 0.5 * dy*dy+p.x*2.0, dy*p.y*4.0, 1.0 );
}
