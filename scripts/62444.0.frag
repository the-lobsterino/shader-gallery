#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) 
{
	
	vec4 old;
	old.r = texture2D(backbuffer, gl_FragCoord.xy/resolution).r;
	old.g = texture2D(backbuffer, gl_FragCoord.xy/resolution).g;
	old.b = texture2D(backbuffer, gl_FragCoord.xy/resolution).b;
	
	vec2 mousePos = mouse * resolution;
	
	if(distance(gl_FragCoord.xy, mousePos) < 1.)
	{
		gl_FragColor = vec4( 1.0,8.0,0.0, 1.0 );
	}
	else
	{
		gl_FragColor = old;//vec4( 0.0, .0,0.0, 1.0 );
	}
}