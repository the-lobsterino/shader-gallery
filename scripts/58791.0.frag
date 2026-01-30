#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	float s = sin(time*1.3);
	float c = cos(time*0.01*p.x)*0.4;
	c = s/c*c;
	float dy = 1. / ( 100. * abs(p.y*s*p.x*c) );
	float dx = 1. / ( 100. * abs(p.x*s*p.y-c) );
	gl_FragColor = vec4( dx * 0.5 * dy, dy*0.5, 0.5/dy+dx*dx, 2.0 );
}
