#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0;// - 1.0;

	float wave = (sin(position.x*29.0*1.+time*5.0) + sin(position.x*51.0*1.+time)) / 10.0*0.5;
	wave = abs(position.y + wave);

	wave = pow(wave, 88.0);
	
	float mx = resolution.x;
	
	float wave2 = (sin(position.x*29.0*(1./9.)+time*5.0) + sin(position.x*51.0*(1./3.)+time)) / 10.0*0.5;
	wave2 = abs(position.y + wave2);

	wave2 = pow(wave2, 88.0);
	
	wave += wave2;
	
	
	gl_FragColor = vec4( 0, 0., 1.-(wave), 1. );
}