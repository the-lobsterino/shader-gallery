// Newton fractal for dummies
// x^3 - 1
// -------------------------------------
// by Matteo Basei
// http://www.matteo-basei.it
// https://www.youtube.com/c/matteobasei



#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;



const float max = 3.0;
const int count = 100;
//const vec2 epsilon = vec2(0.01);



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
	//return power(argument, 6.0) + power(argument, 3.0) - vec2(1.0, 0.0);
	return power(argument, 3.0) - vec2(1.0, 0.0);
}

vec2 derivative(vec2 argument)
{
	return 3.0 * product(argument, argument);
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
	
	return 0.25 + 0.75 * clamp(vec3(z.x, z.x * z.y, z.y), 0.0, 1.0);
}



void main()
{
	vec2 argument = vec2(max * (2.0 * gl_FragCoord.x / resolution.x - 1.0),
	                     max * (2.0 * gl_FragCoord.y / resolution.y - 1.0) * resolution.y / resolution.x);

	vec3 color = newtonFractal(argument);

	gl_FragColor = vec4(color, 1.0);
}
