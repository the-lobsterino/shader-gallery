#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition;//vec2(( gl_FragCoord.x - 0.5 / resolution.x),(gl_FragCoord.y - 0.5 / resolution.y));
	
	float x=p.x;
	float y=p.y;
		
	float color = 0.0;
	color += 10.*sin(10.*x)+5.0*cos(5.*y);
	
	for ( int i=0; i < 5; i++) {
		float var=sin(0.5*time+dot(p,vec2(-p.y,p.x)))*sin(x*y);
		color -= var;
	}
	
	
	/*color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;*/

	gl_FragColor = vec4( abs(vec3( sin(color), color * 0.5, sin( color / 3.0 ) * 0.75 )), 1.0 );

}