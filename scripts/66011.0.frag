
// 090720N MANDEL SKIN OF AN ORGANISME

// M a n d e l b r o t   a n d   J u l i a   s e t s
// by Matteo Basei
// http://www.matteo-basei.it
// https://www.youtube.com/c/matteobasei
 
//and now sort of trilobyte ...
//tweaked by psyreco

precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;


const int N = 40;
const float complexWidth = 2.8;
const float maxLength = 5.0;
const float logMaxLength = log(maxLength);
const float logTwo = log(2.0);
const vec2 zero = vec2(0.0);

const vec3 mandelbrotColor = vec3(.8, .8, .8);	
const vec3 juliaColor = vec3(0.0, 0.0, 0.3);	
const vec3 lineColor = vec3(1.0, 1.00, 0.75);

float width = resolution.x;
float height = resolution.y;
float zoom = complexWidth / width;
vec2 center = vec2(width, height) / 2.0;



vec2 screenToComplex(vec2 point)
{
	return zoom * (point - center);
}

vec2 mouseToComplex(vec2 point)
{
	return screenToComplex(point * resolution);
}

vec2 square(vec2 z)
{
	return vec2(z.x * z.x - z.y * z.y,
	            2.0 * z.x * z.y);
}


float smoothMandelbrot(vec2 z, vec2 c)
{
	float zLength = length(z);
	
	int count = 0;
	
	for (int n = 0; n < N; ++n)
	{
		if (zLength > maxLength) break;
		
		z = tan(square(z) + atan(c));
		
		zLength = exp2(length(z));
		
		++count;
	}
	
	float value = float(count) - log(log(zLength) / logMaxLength) / logTwo;
	
	return clamp(value / float(N), 0.0, 1.0);
}



void main()
{
	vec2 z = screenToComplex(gl_FragCoord.xy);
	
	z.y += 0.1*z.y*sin(1.*time);
	z.x += 0.1*z.x*cos(1.*time);
	z *= 3.;
	//z /= dot(z,z);
	
	vec3 color = vec3(0.0);	
	float t = 4. + 0.5*sin(time);
	float s = 0.5 + sin(t);
	float c = 0.5 + cos(t);
	float m1 = smoothMandelbrot(vec2(s, c), z);
	// float m2 = smoothMandelbrot(vec2(s, c), z);
	// float m3 = smoothMandelbrot(vec2(s, c), z);	
	
	gl_FragColor = vec4(vec3(m1), 1.0);
}
