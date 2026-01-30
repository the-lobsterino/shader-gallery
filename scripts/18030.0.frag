#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


float metaball(vec2 pos, float offset) 
{
	float t = time + offset;
	vec2 metaballPos = vec2(sin(t * .8), cos(t));
	return 1. / length(pos - metaballPos);
}
	
void main( void ) 
{
	vec2 position = surfacePosition;
	float color = 0.;
	for(int i = 0; i < 20; i++) 
	{
		color += metaball(position, float(i) / 5.) / 20.;
	}
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
}