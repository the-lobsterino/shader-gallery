#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dist( float test, float val )
{
	return abs(test - val);
}

bool sinusoide(vec2 uv, float sinAmplitude, float sinPeriod, float sinOffset, float widthfactor, float widthSpeed, float widthOffset)
{
   	float sinWidth = cos(time * widthSpeed + widthOffset) * widthfactor*0.5 + widthfactor;
	
	float valSin = sin(uv.x * sinPeriod + time + sinOffset) * sinAmplitude;
	vec4 color = vec4(0., 0.0, 0.0, 0.0);
	
	return dist(uv.y, valSin) < sinWidth;
}

float rand( vec2 p )
{
	return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float rand(float p)
{
	return fract(sin(dot(vec2(p,p) ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv = (uv * 2.0) - 1.0;
	uv.x *= resolution.x/ resolution.y;
	
	vec4 color = vec4(0., 0.0, 0.0, 0.0);
	
	const int sinCount = 10;
	
	float sinCountf = 10.;
		
/*	for(int i=0; i < sinCount; i++)
	{
		float sinAmplitude =  rand(float(i));
		
		float sinPeriod = rand(float(i + 1)) * 5.;
		
		float sinOffset = rand(float(i + 2));
		
		if(sinusoide(uv, sinAmplitude, sinPeriod, sinOffset, 0.15, 2.0, 0.0))
		{
			vec2 radn = vec2(float(i), float(i));
			
			
			
			color.x = rand(radn) * rand(float(i)) + 0.8;
			color.y = rand(radn) * rand(float(i + 1)) + 0.1;
			color.z = rand(radn) * rand(float(i + 2)) + 0.3;
		}
	}*/
	
	/*for(int i=0; i < sinCount; i++)
	{
		float sinAmplitude =  rand(uv.y);
		
		float sinPeriod = rand(uv.y);
		
		float sinOffset = rand(uv.y);
		
		if(sinusoide(uv, sinAmplitude, sinPeriod, sinOffset, 0.15, 2.0, 0.0))
		{			
			color.x = rand(uv.y);
			color.y = rand(uv.x);
			color.z = rand(uv.y);
		}
	}*/
	
	
	
	if(sinusoide(uv, 1.0, 2.0, 0.0, 0.3, 1.0, 0.0))
	{
		color.z = 0.9;
	}
	else if(sinusoide(uv, 0.5, 1.0, 1.0, 0.2, 2.0, 2.0))
	{
		color.y = 0.9;
	}
	else if(sinusoide(uv, 0.8, 3.0, 2.0, 0.25, 3.0, 1.0))
	{
		color.x = 0.9;
	}
	else if(sinusoide(uv, 0.5, 2.0, 1.0, 0.15, 0.4, 3.0))
	{
		color.x = 0.9;
		color.y = 0.9;
	}
	else if(sinusoide(uv, 0.75, 3.5, 1.0, 0.1, 0.2, 1.0))
	{
		color.x = 1.0;
		color.y = 0.5;
		color.z = 0.1;
	}
	
	
	gl_FragColor = color;
	//gl_FragColor = vec4(0., 0.0, 0.0, 0.0);
}

