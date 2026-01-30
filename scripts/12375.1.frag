#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.;
	float s = sin(time*0.3);
	float c = cos(time*0.001*p.x);
	float dy = 2. / ( 100. * abs(p.y*s*p.x*c) );
	gl_FragColor = vec4( dy * 0. * dy, dy*0.5, dy, 1.0 );
}
