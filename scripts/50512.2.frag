#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	//float interpolation = sin((gl_FragCoord.y/resolution.y)+(time*5.0));
	float interpolation = time;

	//float color = 0.0;
	//color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;
	
	gl_FragColor = vec4( vec3( 1.0,0.0,0.0 ), 1.0 );
	//Flash greyscale
	//gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), interpolation);
	//Flash negative
	//gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0-gl_FragColor.r,1.0-gl_FragColor.g,1.0-gl_FragColor.b), interpolation);
	//Flash White
	gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0,1.0,1.0), interpolation);
	
}