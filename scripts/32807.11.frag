#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 uv;

float Draw(float c)
{
	return 1.0 - smoothstep(0.0, 0.02, abs(c));
}

float line(vec2 start, vec2 end)
{
	float c = (uv.y - start.y) * (end.x - start.x) - (uv.x - start.x) * (end.y - start.y);
	
	return Draw(c);
}

float rectangle(vec2 upleft, vec2 downright)
{
	vec2 center = (upleft + downright) / 2.0;
	float width = abs(upleft.x - downright.x);
	float height = abs(upleft.y - downright.y);
	
	float c = abs((uv.x - center.x)/ width + (uv.y - center.y)/ height) + abs((uv.x - center.x)/ width - (uv.y - center.y)/ height);

	c = 1.0 - c;
	
	return Draw(c);
}

float circle(vec2 center, float r)
{
	float c = pow(uv.x, 2.0) + pow(uv.y, 2.0) - pow(r, 2.0);
	
	return Draw(c);
}

void main( void ) 
{
	uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	float c = 0.0;
	
	c = line(vec2(-0.5, 0.5), vec2(0.5, -0.5));
	c += rectangle(vec2(-0.5, 0.5), vec2(0.5, -0.5));
	c += circle(vec2(0.0, 0.0), 0.5);
	
	gl_FragColor = vec4(c, c, c, 0.0);
}