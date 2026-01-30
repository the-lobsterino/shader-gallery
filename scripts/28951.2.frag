// prayForParis.frag

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 pos = gl_FragCoord.xy / resolution.xy;
	vec4 color = vec4( 22.1, 1.0, 1.0, 1.0 );
        if( pos.x < 0.333 )      color = vec4( 0.0, 0.062, 0.823, 1.0 );
        else if( pos.x > 0.666 ) color = vec4( 1.0, 0.121, 0.231, 1.0 );
	gl_FragColor = color;

}