#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 n) { 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	//uv -=.1;	
	uv.x *= resolution.x/ resolution.y;
	const float PI = 3.14159265358979323846264;
	
	// set default color
	gl_FragColor = vec4(0.0,0.0,0.0,1.0);
	
	// back screen
	if(uv.y > rand(vec2(cos(uv.x), sin(1.0))))
	{		
		gl_FragColor = vec4(1.0,1.0,1.0,0.5);	
	}

}

