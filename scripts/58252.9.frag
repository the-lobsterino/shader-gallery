#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	//color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;
	
	vec4 in1 = vec4(1.0, 2.0, 3.0, 4.0);
	vec4 in2 = vec4(1.6, 5.1, 6.1, 7.1);
	vec4 winRange = vec4(.5);
	vec4 winMin = in1 - winRange;
	vec4 winMax = in1 + winRange;
	bvec4 inWin = bvec4(step(winMin, in2) * step(in2, winMax));
	if(any(inWin))
	{
		gl_FragColor = vec4( vec3( 0.0, .5, 0.0), 1.0 );
	}
	else
	{
		gl_FragColor = vec4( vec3( .5, 0.0, 0.0 ), 1.0 );
	}

}