precision mediump float;

uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
vec4 me;
vec2 position;

void pixel( )
{
    if((position.x <= 0.01)&&(position.y <= 0.02)&&(position.x >= 0.005)&&(position.y >= 0.01))
    {
	me.r = 1.0;
	me.g = 0.0;
	me.b = 1.0;
	gl_FragColor = me;
    }	
}

void main( void ) 
{
	position = ( gl_FragCoord.xy / resolution.xy );
	me = texture2D(backbuffer, position);
	vec2 mouse_distance = mouse - (gl_FragCoord.xy / resolution);
	float red = 1.0 - length(mouse_distance);
	
	float mradius = 0.01;
	float x;
	float y;
	pixel();
	
	/*if (length(mouse-position) < mradius) 
	{
		me.r = 1.0;
		me.g = 0.0;
		me.b = 0.0;
	}
	else if((position.x <= 0.05)&&(position.y <= 0.1))
	{
		me.r = 0.0;
		me.g = 1.0;
		me.b = 1.0;
	}
	else if((position.x <= 0.1)&&(position.y <= 0.2)&&(position.x >= 0.05)&&(position.y >= 0.1))
	{
		me.r = 1.0;
		me.g = 0.0;
		me.b = 1.0;
	}
	else
	{
		me.r = 0.0;
		me.g = 0.0;
		me.b = 0.0;	
	}
	
	gl_FragColor = me;*/
}