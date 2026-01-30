#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float cntr = 0.0;

void main( void ) 
{
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;
	
	float posx = position.x * 3.0 * 3.141592;
	
	float cosx = (cos(time/5.0) * posx  / 0.1  + 1.0 ) / 2.0;
	
	if(abs(position.y - cosx ) < 10.0)

	gl_FragColor = vec4( (sin(time) + 1.0) / 2.0 , time - floor(time)  , position.y, 1.0 );

}