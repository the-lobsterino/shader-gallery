#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float Circle(vec2 p, float radius)
{
	float fDist = distance(p, vec2(0.2));
	if(fDist <= radius)
		return 1.0;
	else
		return 0.5;
		
}

void main( void ) {
	
	vec2 coord = gl_FragCoord.xy/resolution.xy;
	
	coord.x *= (resolution.x/resolution.y);
	
	//float color = Circle(coord, 0.2);
	
	gl_FragColor = vec4(0.5, 1.0); 
}