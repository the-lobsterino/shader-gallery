// N e w t o n   f r a c t a l
// by Matteo Basei
// http://www.matteo-basei.it
// https://www.youtube.com/c/matteobasei



precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;



const float PI = 3.14159265358;
const float ZOOM = 1.0;
const float EPSILON = 0.001;
const   int N = 20;



vec3 hslToRgb(float hue, float saturation, float lightness)
{
	float hexaHue = 6.0 * hue;
	
	vec3 color;
	if      (hexaHue < 1.0) color = vec3( 0.5,                   -0.5 + hexaHue,        -0.5);
	else if (hexaHue < 2.0) color = vec3( 0.5 - (hexaHue - 1.0),  0.5,                  -0.5);
	else if (hexaHue < 3.0) color = vec3(-0.5,                    0.5,                  -0.5 + (hexaHue - 2.0));
	else if (hexaHue < 4.0) color = vec3(-0.5,                    0.5 - (hexaHue - 3.0), 0.5);
	else if (hexaHue < 5.0) color = vec3(-0.5 + (hexaHue - 4.0), -0.5,                   0.5);
	else                    color = vec3( 0.5,                   -0.5,                   0.5 - (hexaHue - 5.0));
	
	float chroma = saturation * (1.0 - abs(2.0 * lightness - 1.0));
	
	return color * chroma + lightness;
}



vec2 conjugate(vec2 z)
{
	return vec2(z.x, -z.y);
}

vec2 reciprocal(vec2 z)
{
	return conjugate(z) / dot(z, z);
}

vec2 product(vec2 z, vec2 w)
{
	return vec2(z.x * w.x - z.y * w.y,
	            z.x * w.y + z.y * w.x);
}

vec2 division(vec2 z, vec2 w)
{
	return product(z, reciprocal(w));
}

vec2 power(vec2 base, float exponent)
{
	float modulus = pow(length(base), exponent);
	float phase = atan(base.y, base.x) * exponent;
	
	return vec2(modulus * cos(phase),
		    modulus * sin(phase));
}



vec2 function(vec2 z, vec2 parameter)
{
	return power(z, 3.0) + parameter;
	//return power(z, 6.0) + power(z, 3.0) + parameter;
	//return power(z, 9.0) + power(z, 3.0) + parameter;
}

vec2 derivative(vec2 z)
{
	return 3.0 * product(z, z);
	//return 6.0 * power(z, 5.0) + 3.0 * product(z, z);
	//return 9.0 * power(z, 8.0) + 3.0 * product(z, z);
}

vec3 newtonFractal(vec2 z, vec2 parameter)
{
	float delta = 0.0;
	
	for (int n = 0; n < N; ++n)
	{
		vec2 previous = z;
		
		z = z - division(function(z, parameter), derivative(z));
		
		delta += length(z - previous);
	}
	
	float phase = 0.5 + atan(z.y, z.x) / (2.0 * PI);
	
	float lightness = log(10.0 * delta) / 10.0;
	
	return hslToRgb(phase, 1.0, lightness);
}



void main()
{
	vec2 z = ZOOM * (2.0 * gl_FragCoord.xy / resolution.xy - 1.0);
	vec2 parameter = ZOOM * (2.0 * mouse - 1.0);
	
	float aspectRatio = resolution.x / resolution.y;
	z.x *= aspectRatio;
	parameter.x *= aspectRatio;

	vec3 color = newtonFractal(z, parameter);

	gl_FragColor = vec4(color, 1.0);
}
