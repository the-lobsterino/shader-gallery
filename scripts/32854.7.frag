#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec2 P0 = vec2(-1.0, 0.0);
vec2 P1 = vec2(-0.5, 0.0);
vec2 P2 = vec2(1.0, -0.5);
vec2 P3 = vec2(1.0, 1.0);

float spline(vec2 uv)
{
	uv.x *= 2.0;
	
	float c = 0.0;
	c += (uv.y - pow(uv.x + 2.0, 3.0) * 0.25) * step(uv.x, -1.0);
	c += (uv.y - (3.0 * pow(abs(uv.x), 3.0) - 6.0 * pow(uv.x, 2.0) + 4.0) * 0.25) * step(abs(uv.x), 1.0);
	c += (uv.y - pow(2.0 - uv.x, 3.0) * 0.25) * step(1.0, uv.x);
	//c *= step(abs(uv.x), 2.0);
	
	c = smoothstep(0.0, 0.01, abs(c));
	c = 1.0 - c;
	
	return c;
}

float bezier1(vec2 uv)
{	
	float c = 0.0;
	
	for (float i = 0.0; i < 100.0; i += 1.0)
	{
		float t = i / 100.0;
		//vec2 B = (1.0 - t) * P0 + t * P1;
		//vec2 B = pow((1.0 - t), 2.0) * P0 + 2.0 * t * (1.0 - t) * P1 + pow(t, 2.0) * P2;
		vec2 B = pow((1.0 - t), 3.0) * P0 + 3.0 * t * pow((1.0 - t), 2.0) * P1 + 3.0 * pow(t, 2.0) * (1.0 - t) * P2 + pow(t, 3.0) * P3;
	
		c = distance(uv, B);
		
		if (c < 0.01)
		{
			break;	
		}
	}  
	
	c = smoothstep(0.0, 0.01, c);
	c = 1.0 - c;
	return c;
}


float bezier2(vec2 uv)
{	
	float c = 0.0;
	
	float t = fract(time * 100.0);
	vec2 B = pow((1.0 - t), 3.0) * P0 + 3.0 * t * pow((1.0 - t), 2.0) * P1 + 3.0 * pow(t, 2.0) * (1.0 - t) * P2 + pow(t, 3.0) * P3;
	
	c = smoothstep(0.0, 0.01, distance(B, uv));
	c = 1.0 - c;
	return c;
}


float bezier3(vec2 uv)
{	
	//uv.x *= 2.0;
	float c = 0.0;
	
	float t = fract(time * 0.5);
	vec2 B = pow((1.0 - t), 3.0) * P0 + 3.0 * t * pow((1.0 - t), 2.0) * P1 + 3.0 * pow(t, 2.0) * (1.0 - t) * P2 + pow(t, 3.0) * P3;
	
	c = distance(uv, B);
	c = smoothstep(0.0, 0.01, c);
	c = 1.0 - c;
	return c;
}

float bezier4(vec2 uv)
{	
	uv.x *= 4.0;
	float c = 0.0;
	
	{
		float t = uv.x;
	
		vec2 B = pow((1.0 - t), 3.0) * P0 + 3.0 * t * pow((1.0 - t), 2.0) * P1 + 3.0 * pow(t, 2.0) * (1.0 - t) * P2 + pow(t, 3.0) * P3;
		c += 1.0 - smoothstep(0.0, 0.02, abs(B.y - uv.y));
	}

	
	{
		float t = uv.y;
		
		vec2 B = pow((1.0 - t), 3.0) * P0 + 3.0 * t * pow((1.0 - t), 2.0) * P1 + 3.0 * pow(t, 2.0) * (1.0 - t) * P2 + pow(t, 3.0) * P3;
		c += 1.0 - smoothstep(0.0, 0.02, abs(B.x - uv.x));
	}

	return c;
}


vec2 curve(float t)
{
	return pow((1.0 - t), 3.0) * P0 + 3.0 * t * pow((1.0 - t), 2.0) * P1 + 3.0 * pow(t, 2.0) * (1.0 - t) * P2 + pow(t, 3.0) * P3;
}

float bezier5(vec2 uv)
{
	uv *= 4.0;
	
	vec2 B = curve(uv.x) + curve(uv.y);
	B /= 2.0;
	
	float c = smoothstep(0.0, 0.1, distance(B, uv));
	
	c = 1.0 - c;
	
	return c;
}


float anotherCurve(vec2 uv)
{
	uv *= 4.0;

	uv.x += time ;
	
	float c = 0.0;

	c = sin(3.14 + uv.x) + 2.0 * sin(3.14 + uv.x * 2.0) + 3.0 * sin(3.14 * 2.0 + uv.x * 1.1);
	
	c = smoothstep(0.0, 0.1, abs(uv.y - c));
	c = 1.0 - c;
	return c;
}

float bezier6(vec2 uv)
{
	uv *= 4.0;
	
	float d = curve(uv.x).y + curve(uv.y).x;
	
	float c = smoothstep(0.0, 0.1, abs(uv.y + uv.x - d));
	
	c = 1.0 - c;
	
	return c;
}


void main( void ) 
{
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	//P0.x += sin(time);
	//P0.y += cos(time);

	float c = 0.0;
	//c += bezier1(uv);
	//c += bezier2(uv);
	c += bezier3(uv);
	//c += bezier4(uv);
	//c += bezier5(uv);
	//c += bezier6(uv);
	//c += anotherCurve(uv);	
	gl_FragColor = vec4(c);
	gl_FragColor += texture2D(backbuffer, gl_FragCoord.xy / resolution.xy);
}