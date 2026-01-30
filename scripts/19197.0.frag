#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float hash(float p)
{	
	return fract(sin(p) * 45768.23); 
}

float hash(vec2 p)
{	
	return fract(sin(10.27 * p.x + 35.8* p.y) * 45768.23); 
}

vec2 hash2(vec2 p)
{
	mat2 m = mat2(15.27, 35.8, 75.45, 152.5);
	return fract(sin(m * p) * 45768.23);
}
	
void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution;
	//float c = hash(p.x * 1.0);
	//float c = hash(p * 1.0);
	float c = hash2(p).x;
	
	gl_FragColor = vec4(c, c, c, 1.0);
	
}
