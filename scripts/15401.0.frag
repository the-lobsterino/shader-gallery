#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
void main( void ) {

	vec4 tex = texture2D(backbuffer,( gl_FragCoord.xy / resolution.xy ))*0.9;
	vec2 position = ( gl_FragCoord.xy / resolution.x );
	float l = pow(1.0-length(position-vec2(mouse.x,mouse.y)),190.0);
	gl_FragColor = vec4( pow(l,0.5)*2.0,l,pow(l,2.0), 1.0 );
	gl_FragColor.rgb +=  tex.rrr * 1.1;

}

