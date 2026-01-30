// K a l e i d o s c o p e
// by Matteo Basei
// http://www.matteo-basei.it
// https://www.youtube.com/c/matteobasei



precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;



const float PI = 3.14159265358;
const float ZOOM = 1.0;
const   int N = 10;



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
	return power(z, -2.0) + parameter;
}

vec3 fractal(vec2 z, vec2 parameter)
{
	float delta = 0.0;
	
	for (int n = 0; n < N; ++n)
	{
		vec2 previous = z;
		
		z = function(z, parameter);
		
		delta += length(z - previous);
	}
	
	float phase = atan(z.y, z.x);
	
	float hue = 0.5 + phase / (2.0 * PI);
	
	float lightness = log(20.0 * delta) / 20.0;
	
	return hslToRgb(hue, 1.0, lightness);
}



void main()
{
	vec2 z = ZOOM * (2.0 * gl_FragCoord.xy / resolution.xy - 1.0);
	vec2 parameter = ZOOM * (2.0 * mouse - 1.0);
	
	float aspectRatio = resolution.x / resolution.y;
	z.x *= aspectRatio;
	parameter.x *= aspectRatio;

	vec3 color = fractal(z, parameter);

	gl_FragColor = vec4(color, 1.0);
}
