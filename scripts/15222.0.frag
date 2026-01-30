#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define p 0.15915494309
void main( void ) 
{
	vec2 position = ( gl_FragCoord.xy / resolution.x );
	float a = max(sign(mod((atan(-position.y+0.25,position.x-0.5)*p+0.5)*25.0+time,5.0)-0.5),0.0);
	float r = length(position-vec2(0.5,0.25));
	if (r<0.25)
	{
	if (r>0.025)
	{
	gl_FragColor = vec4( a,a,a, 1.0 );
	}
	}
	else
	{
	gl_FragColor = vec4(1.0);
	}
}