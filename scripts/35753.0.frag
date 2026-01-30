#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) 
{
	
	//Position
	vec2 pos = vec2(surfacePosition);
	//Pacman
	vec2 pac = vec2(length(vec2(pos.x,pos.y)), atan(pos.x,pos.y));
	//Eye
	vec2 eye = vec2(length(vec2(pos.x-0.04,pos.y-0.15)), atan(pos.x,pos.y));
	
	//Angles
	vec2 mouth = vec2(0.65, 0.83);
	float sy = -0.5*(pac.y/3.14159);	
	float ph = mod(sy ,1.0); 

	//Draw
	if(pac.x < 0.3 )
	{						
		
		if(ph < mouth.x)
		{
			gl_FragColor = vec4(1.0,1.0,0.0,0.0);
		}
		else if(ph > mouth.y)
		{
			gl_FragColor = vec4(1.0,1.0,0.0,0.0);
		}
				
		
	}
	if(eye.x < 0.03 )gl_FragColor = vec4(0.0,0.0,0.0,0.0);
	
}