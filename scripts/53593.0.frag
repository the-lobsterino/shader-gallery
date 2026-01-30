#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv= ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float c= step(0.02,mod(uv.x,0.1));
	float y=step(0.02,mod(uv.y,0.1));
	float cy=min(c,y);
	//wcolor += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( cy) , 1.0 );

}