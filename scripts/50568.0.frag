#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
uniform sampler2D renderbuffer;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (in vec2 st) { 
    return fract(sin(dot(st.xy* sin(time*.001), vec2(12.9898,78.233))) * 43758.5453123);
    // return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ); // + mouse / 4.0;

	/* float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	*/
	if (position.y < .01) {
		// Fixed color
		// gl_FragColor = vec4( vec3(1, 0, 0), 1.0 );
		// Fixed random
		if (random(position) > .8) {
			gl_FragColor = vec4( vec3(random(position) , 0, 0), 1.0 );
		}
		// float p = 0.5;
		// float p = (sin(position.x *3.14 + time*2.0) * .05) + .2;
		// if (true
		//    && (position.x > (p - .002))
		//    && (position.x < (p + .002))
		// ) {
		// 	gl_FragColor = vec4( vec3(1 , 0, 0), 1.0 );
		// }
		
	}else {
		// Flat
		// gl_FragColor = vec4( vec3(0, 0, 0), 1.0 );
		// Just copy
		// vec2 neighbor_position = position;
		// neighbor_position = gl_FragCoord.xy + vec2(0, -1);
		// gl_FragColor = texture2D(renderbuffer, neighbor_position/resolution);
		// Diffusion
		vec2 n0 = gl_FragCoord.xy + vec2(-1, -1);
		vec2 n1 = gl_FragCoord.xy + vec2(0, -1);
		vec2 n2 = gl_FragCoord.xy + vec2(1, -1);
		// float diffusion = .1
		gl_FragColor = texture2D(renderbuffer, n0/resolution) * .299 + texture2D(renderbuffer, n1/resolution) *.399 + texture2D(renderbuffer, n2/resolution)*.299;
		
	}
	
	
}