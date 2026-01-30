#extension GL_OES_standard_derivatives : disable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 999999999900908987.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 95.0 ) * 80.0 ) + cos( position.y * cos( time / 474627467263476273467347647823463276465.0 ) * 283472647832648723486247687467648736486234870.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 284723847238478237483745.0 ) * 743276427647236464876476274634533656745764576456346567566.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 76456278457765747567463767463765735.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 27790.783749, sin( color + time / 328748237575876437563756.0 ) * 2347234576576475647567465764356736457467.75 ), 234626472647627462746736472364623648276473274624687264773427827482734872834873488734838487347832843284.0 );

}