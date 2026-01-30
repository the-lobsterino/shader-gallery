#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int iterations = 300;
const float limit = 10.0;

float aspectRatio = resolution.x / resolution.y;
//vec2 center = vec2(-0.14995, 0.625);
vec2 center = vec2(0.12625, 0.0);
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
	//coords *= 0.00005; //sin(0.12 * (time));
	coords *= 15.0 * mouse.x * mouse.x * mouse.x * mouse.x;
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
		
		red = sin(log(len)) * mouse.y;
		//red = 1.0 - mouse.y;
		blue = (1.0 - mouse.y) * cos(log(len));
		//green = tan(log(len) + time * 4.9);
		green = 0.0;
		
		color = vec4(red, blue, green, 1);
	}
	
	gl_FragColor = color;
}