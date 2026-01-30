// Newton fractal for dummies (by Matteo Basei)
// x^9 + x^3 - mouse
// --------------------------------------------
// http://www.matteo-basei.it
// https://www.youtube.com/c/matteobasei



#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;



const float max = 3.0;
const int count = 100;
const vec2 epsilon = vec2(0.01);



vec3 hslToRgb(float hue, float saturation, float lightness)
{
	float sixTimesHue = 6.0 * hue;
	
	float red;
	float green;
	float blue;
	
	int intSixTimesHue = int(sixTimesHue);
	
	if (intSixTimesHue == 0)
	{
		red = 0.5;
		green = -0.5 + sixTimesHue;
		blue = -0.5;
	}
	else if (intSixTimesHue == 1)
	{
		red = 0.5 - (sixTimesHue - 1.0);
		green = 0.5;
		blue = -0.5;
	}
	else if (intSixTimesHue == 2)
	{
		red = -0.5;
		green = 0.5;
		blue = -0.5 + (sixTimesHue - 2.0);
	}
	else if (intSixTimesHue == 3)
	{
		red = -0.5;
		green = 0.5 - (sixTimesHue - 3.0);
		blue = 0.5;
	}
	else if (intSixTimesHue == 4)
	{
		red = -0.5 + (sixTimesHue - 4.0);
		green = -0.5;
		blue = 0.5;
	}
	else
	{
		red = 0.5;
		green = -0.5;
		blue = 0.5 - (sixTimesHue - 5.0);
	}
	
	float chroma = saturation * (1.0 - abs(2.0 * lightness - 1.0));
	
	return vec3(red * chroma + lightness,
		    green * chroma + lightness,
		    blue * chroma + lightness);
}



vec2 conjugate(vec2 value)
{
	return vec2(value.x, -value.y);
}

vec2 reciprocal(vec2 value)
{
	return conjugate(value) / dot(value, value);
}

vec2 product(vec2 left, vec2 right)
{
	return vec2(left.x * right.x - left.y * right.y,
	            left.x * right.y + left.y * right.x);
}

vec2 division(vec2 left, vec2 right)
{
	return product(left, reciprocal(right));
}

vec2 power(vec2 base, float exponent)
{
	float modulus = pow(length(base), exponent);
	float phase = atan(base.y, base.x) * exponent;
	
	return vec2(modulus * cos(phase),
		    modulus * sin(phase));
}



vec2 function(vec2 argument)
{
	//return power(argument, 3.0) - vec2(1.0, 0.0);
	//return power(argument, 6.0) + power(argument, 3.0) - vec2(1.0, 0.0);
	return power(argument, 9.0) + power(argument, 3.0) - 2.0 * (mouse - 0.5);
}

vec2 derivative(vec2 argument)
{
	//return 3.0 * product(argument, argument);
	//return 6.0 * power(argument, 5.0) + 3.0 * product(argument, argument);
	return 9.0 * power(argument, 8.0) + 3.0 * product(argument, argument);
}

vec2 recurrenceRelation(vec2 argument)
{
	vec2 image = function(argument);
	
	//vec2 derivative = division(function(argument + epsilon) - image, epsilon);
	vec2 derivative = derivative(argument);
	
	return argument - division(image, derivative);
}

vec3 newtonFractal(vec2 argument)
{
	vec2 z = argument;
	
	for (int i = 0; i < count; ++i)
	{
		z = recurrenceRelation(z);
	}
	
	float phase = 0.5 + atan(z.y, z.x) / (2.0 * 3.1415926);
	
	return hslToRgb(phase, 0.75, 0.5);
}



void main()
{
	vec2 argument = vec2(max * (2.0 * gl_FragCoord.x / resolution.x - 1.0),
	                     max * (2.0 * gl_FragCoord.y / resolution.y - 1.0) * resolution.y / resolution.x);

	vec3 color = newtonFractal(argument);

	gl_FragColor = vec4(color, 1.0);
}
