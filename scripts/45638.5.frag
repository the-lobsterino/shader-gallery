#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	
	if(gl_FragCoord.y < 4.){
		
		vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
		float color = 0.0;
		color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
		color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
		color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
		color *= sin( time / 10.0 ) * 0.5;
	
		gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	}else{
		vec2 coord = gl_FragCoord.xy;
		coord.y -= 1.;
		coord.x += -1.+coord.y;
		
		gl_FragColor = mix(texture2D(backbuffer, fract(coord/resolution)), texture2D(backbuffer, fract(gl_FragCoord.xy/resolution)), 0.7);
	}

}