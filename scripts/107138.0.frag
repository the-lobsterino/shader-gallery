#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {


	
	
	
	
	
	
	
	vec4 old;
	old.r= texture2D(backbuffer, gl_FragCoord.xy/resolution).g;
	old.g= texture2D(backbuffer, gl_FragCoord.xy/resolution).b;
	old.b= texture2D(backbuffer, gl_FragCoord.xy/resolution).r;
	
	
	vec2 mousePos = mouse * resolution;
	if( distance( gl_FragCoord.xy, mousePos) < 6. )
	{
	gl_FragColor = vec4( 1.0,0.0,0.0, 1.0 );
	}else{
	gl_FragColor = old;
	}
}