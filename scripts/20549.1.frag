#ifdef GL_ES
precision mediump float;
#endif 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 format_to_screen( vec2 p );

//float mix(float a, float b, float x);
//float smoothstep(float a, float b, float x);
float smoothmin(float a, float b, float x);
float smoothmax(float a, float b, float x);
float linstep(float a, float b, float x);
float expstep(float a, float b, float x);
float impulse(float a, float x );
float parabola(float a, float b, float x );
float cubicpulse(float a, float b, float x);	
float smooth(float x);
//float clamp(float a, float b, float x);

void main( void ) 
{
	//display
	vec2 uv		= gl_FragCoord.xy/resolution;
	vec2 divisions	= vec2(4., 3.);
	vec2 position	= format_to_screen(fract(uv * divisions));
	vec2 tile	= floor(uv * divisions);
	float axis	= step(1., float((abs(position.x - .01) > .02)^^(abs(position.y - .01) > .01))+float(abs(position.x-.01)<.02));
	float edges	= 1.-float(abs(position.x) > 1.8  || abs(position.y) > .98);
	
	//mouse input
	vec2 m  	= format_to_screen(mouse);

	//coefficients 
	position *= 2.;
	float a 	= m.x;
	float b 	= m.y;
	float x 	= position.x;

	//various curves - credit to iq http://www.iquilezles.org/www/articles/functions/functions.htm
	mat4 curves;
	curves[0][2] = parabola(a, b, x);
	curves[1][2] = cubicpulse(a, b, x);
	curves[2][2] = smoothmin(a, b, x);
	curves[3][2] = smoothmax(a, b, x);
	
	curves[0][1] = linstep(a, b, x);
	curves[1][1] = smoothstep(a, b, x);
	curves[2][1] = expstep(a, b, x);
	curves[3][1] = impulse(a, x);	
	
	curves[0][0] = mix(a, b, x);	
	curves[1][0] = step(a, x);
	curves[2][0] = floor(a * x);
	curves[3][0] = fract(a * x);
	
	float result = 0.;
	for(int x = 0; x < 4; x++)
	{
		for(int y = 0; y < 3; y++)
		{
			bool display = tile.x == float(x) && tile.y == float(y);
			float curve = step(position.y, curves[x][y]) * .1;
			curve += smoothstep(.1, .11, smoothstep(.0, curves[x][y]-position.y, -.01));
			result = display ?  curve : result;
		}
	}
	
	
	gl_FragColor	= vec4(result * edges) + vec4(axis * edges) * vec4(.25, .75, .25, 0.);
}//sphinx

vec2 format_to_screen( vec2 p )
{
    p       = p * 2. - 1.;
    p.x     *= resolution.x / resolution.y;
    return p;
}

float smoothmax(float a, float b, float x)
{
	return log(exp(x*a)+exp(x*b))/x;
}

float smoothmin(float a, float b, float x)
{
	return -(log(exp(x*-a)+exp(x*-b))/x);
}

float linstep(float a, float b, float x)
{
    return clamp((x-a)/(b-a),0.,1.);
}

float expstep(float a, float b, float x)
{
    return exp(-b*pow(a,x));
}

float impulse(float a, float x )
{
    float h = a*x;
    return h*exp(1.-h);
}

float cubicpulse(float a, float b, float x)
{
    x = abs(x - a);
    if(x > b) return 0.0;
    x /= b;
    return 1. - smooth(x);
}
	
float parabola( float a, float b, float x)
{
	x=2.*clamp((x-a)/(b-a),0.,1.)-1.;
	return 1.-x*x;
}

float smooth(float x)
{
    return x*x*(3.-2.*x);
}

/*
float clamp(float a, float b, float x)
{
	return (x > a) ? (x < b) ? x : b : a;
}

float mix(float a, float b, float x)
{
	return a * (1.-x) + b * x;
}

float smoothstep(float a, float b, float x)
{
    x = clamp((x - a)/(b - a), 0.0, 1.0); 
    return smooth(x);
}
*/