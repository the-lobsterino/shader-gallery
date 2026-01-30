#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float makeCool(float val)
{
	vec2 pos = gl_FragCoord.xy / resolution.xy ;
	if(mod(pos.x-time*0.03, 0.02) < 0.01)
	{
		if(mod(pos.y+time*0.03, 0.02) > 0.01)
		{
			val = floor(val*16.0)/16.0;
		}
		else
		{
			val = ceil(val*16.0)/16.0;
		}
	}
	else
	{
		if(mod(pos.y+time*0.03, 0.02) < 0.01)
		{
			val = floor(val*16.0)/16.0;
		}
		else
		{
			val = ceil(val*16.0)/16.0;
		}
	}
	
	return val;
}

vec4 makeCool(vec4 col)
{
	col.x = makeCool(col.x);
	col.y = makeCool(col.y);
	col.z = makeCool(col.z);
	return col;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy ;
	gl_FragColor = makeCool(vec4( abs(sin(position.x*10.0)), abs(sin(position.y*10.0)), sin(position.x*50.0-time*5.0), 1.0 ));
}
