// bars - thygate@gmail.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 position;
vec3 color;

float barsize = 0.11;
float barsangle = 1.4;


vec3 mixcol(float value, float r, float g, float b)
{
	return vec3(value * r, value * g, value * b);
}

void bar(float pos, float r, float g, float b)
{
	 if ((position.y <= pos + barsize) && (position.y >= pos - barsize))
		color = mixcol(1.0 - abs(pos - position.y) / barsize, r, g, b);
}

void main( void ) {

	position = ( gl_FragCoord.xy / resolution.xy );
	position = position; 	

	
	color = vec3(0., 0., 0.);
	float t = time*1.1;

	bar(cos(2.0+t+t)*0.4,  1.0, 0.0, 0.0);
	bar(cos(1.5+t+t)*0.4,  1.0, 1.0, 0.0);
	bar(cos(1.0+t+t)*0.4,  0.0, 1.0, 0.0);
	bar(cos(0.5+t+t)*0.4,  0.0, 1.0, 1.0);
	bar(cos(0.0+t+t)*0.4,  0.5, 0.0, 1.0);
	
	bar(cos(-0.5+t+t)*0.4,  1.0, 0.0, 1.0);
	bar(cos(-1.0+t+t)*0.4,  1.0, 1.0, 1.0);
	bar(cos(-1.5+t+t)*0.4,  1.0, 1.0, 0.5);
	bar(cos(-2.0+t+t)*0.4,  1.0, 0.5, 1.0);
	 
	
	gl_FragColor = vec4(color, 1.0);

}