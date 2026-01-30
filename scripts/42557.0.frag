#ifdef GL_ES
precision mediump float;
#endif
//nuclear throne tunnel
//2017.01.29 tigrou dot ind at gmail dot com
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 pattern(vec2 pos, float ang) 
{
        pos = vec2(pos.x * cos(ang) - pos.y * sin(ang), pos.y * cos(ang) + pos.x * sin(ang));	
	
	//if(length(pos) < 0.2)
	if(abs(pos.x) < 0.3 && abs(pos.y) < 0.3)
	   return vec4(.0, 0.0, 0.0, 0.0);
	else if((abs(pos.y) - abs(pos.x)) > 0.0)
	   return vec4(0.59, 0.45, 0.05, 1.0);
	else
	   return vec4(0.27, 0.07, 0.39, 1.0);			
}

void main( void ) 
{
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 0.5);
	vec4 color = vec4(0.0);
	
	for(float i =  1.; i < 27. ; i ++)
	{
		float o = (27. - i)/15.;
		vec2 offset = vec2(o*cos(o+time)*0.6, o*sin(o+time)*0.6);
		vec4 res = pattern(pos/vec2(i*i/150.)+offset, i/2.+time);
		if(res.a > 0.0)
		     color = res*i/7.;
	}

	gl_FragColor = color;
}

