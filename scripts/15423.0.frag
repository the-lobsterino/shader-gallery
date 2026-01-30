#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
void main( void ) {

	vec4 tex = texture2D(backbuffer,( gl_FragCoord.xy / resolution.xy ))*0.9;
	vec2 position = ( gl_FragCoord.xy / resolution.x );
	float l = pow(1.0-length(position-vec2(mouse.x,mouse.y/2.0)),100.0);
	gl_FragColor = vec4( pow(l,0.5)*2.0,l,pow(l,2.0), 1.0 );
	gl_FragColor.rgb +=  tex.brg;

}

// Draw big circle with your mouse as fast as possible. If you're lucky, you'll see it! ;)