#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int iterations = 200;
const float limit = 10.0;

float aspectRatio = resolution.x / resolution.y;
vec2 center = vec2(-0.16001, 0.64999);
float zoom = 1.0;

float compute(vec2 v)
{
	float xz = v.x;
	float yz = v.y;
	float xn = v.x;
	float yn = v.y;
	
	float xm;
	float ym;
	
	float len = 0.0;
	
	//int i;
	
	for (int i = 0; i < iterations; i++)
	{
		xm = xn;
		ym = yn;
		xn = xm * xm - ym * ym + xz;
		yn = 2.0 * xm * ym + yz;
	
		len = sqrt(xn * xn + yn * yn);
		
		if (len > limit) return len;
	}
	
	return len;
}

void main( void ) {

	vec2 offset = center;
	//zoom = 1.0 / (time);
	//zoom = sin(0.12 * (time));
	
	vec2 coords = (gl_FragCoord.xy / resolution) - vec2(0.5, 0.5);
	coords *= ((sin(0.12 * (time))) / (time * time * time * time));
	coords = center + coords;
	coords.x *= aspectRatio;
	float len = compute(coords);
	
	float red;
	float green;
	float blue;
	
	vec4 color;
	
	if (len < limit)
	{
		color = vec4(0,0,0,0);
	} else {
		len = abs(len);
		red = 1. - 0.5 * sin(len);
		blue = 1. - 0.5 * sin(len);
		green = 1. - 0.5 * sin(len);
		color = vec4(red, blue, green, 1);
	}
	
	gl_FragColor = color;
}