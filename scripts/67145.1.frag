// 240820N life form

// degree-3 polynomial by marcm200
// https://fractalforums.org/fractal-mathematics-and-new-theories/28/calculating-coordinates-on-the-boundary-of-fatou-components/3731
// by Matteo Basei
// http://www.matteo-basei.it
// https://www.youtube.com/c/matteobasei


#define tt (1. - 0.5*sin(time))
#define f(z, c)    multiply(vec2(3.0 / 2.0, 9.0 / 2.0), powerOf3(z * tt)) + multiply(vec2(2.0, -4.0), powerOf2(z* tt)) - multiply(vec2(0.0, 1.0 / 3.0), z* tt)
#define L(epsilon) 1.0 * clamp(pow(epsilon, 0.2), 0.0, 1.0)
#define S          0.5
#define ZOOM       0.8
#define DELTA      0.01
#define N          100
#define Z_OFFSET   vec2(0., 0.)



precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;



// |z| = (x^2 + y^2)^(1 / 2)
float modulus(vec2 z)
{
	return length(z);
}

// |z|^2 = x^2 + y^2
float squareModulus(vec2 z)
{
	return dot(z, z);
}

// arg(z) = arctan(y / x)
float phase(vec2 z)
{
	return atan(z.y, z.x);
}

// rho * (cos(theta) + i * sin(theta))
vec2 fromPolar(float rho, float theta)
{
	return rho * vec2(cos(theta), sin(theta));
}

// z* = x - i * y
vec2 conjugate(vec2 z)
{
	return vec2(z.x, -z.y);
}

// 1 / z = z* / (z z*) = z* / |z|^2
vec2 inverse(vec2 z)
{
	return conjugate(z) / squareModulus(z);
}

// z * w
vec2 multiply(vec2 z, vec2 w)
{
	return vec2(z.x * w.x - z.y * w.y,
	            z.x * w.y + z.y * w.x);
}

// i * z
vec2 multiplyByI(vec2 z)
{
	return vec2(-z.y, z.x);
}

// z / w = z * (1 / z)
vec2 divide(vec2 z, vec2 w)
{
	return multiply(z, inverse(w));
}

// e^z = e^(x + i y) = e^x * e^(i * y)
vec2 exponential(vec2 z)
{
	return fromPolar(exp(z.x), z.y);
}

// ln(z) = ln|z| + i * arg(z)
vec2 naturalLogarithm(vec2 z)
{
	return vec2(log(modulus(z)), phase(z));
}

// log_w(z) = ln(z) / ln(w)
vec2 logarithm(vec2 z, vec2 w)
{
	return divide(naturalLogarithm(z), naturalLogarithm(w));
}

// z^w = (e^ln(z))^w = e^(ln(z) * w)
vec2 power(vec2 z, vec2 w)
{
	return exponential(multiply(naturalLogarithm(z), w));
}

// z^2 = z * z
vec2 powerOf2(vec2 z)
{
	return multiply(z, z);
}

// z^3 = z * z^2
vec2 powerOf3(vec2 z)
{
	return multiply(z, powerOf2(z));
}

// z^x = |z|^x * e^(arg(z) * x)
vec2 power(vec2 z, float x)
{
	float rho = pow(modulus(z), x);
	float theta = phase(z) * x;
	
	return fromPolar(rho, theta);
}

// sin(z) = (e^(i * z) - e^(-i * z)) / (2 * i)
vec2 sine(vec2 z)
{
	vec2 iz = multiplyByI(z);

	return divide(exponential(iz) - exponential(-iz), vec2(0.0, 2.0));
}



vec3 hsl2rgb(float hue, float saturation, float lightness)
{
	float Hue = 6.0 * hue;
	float frhue = fract(Hue);
	
	vec3 color;
	if      (Hue < 1.0) color = vec3( 0.5,         -0.5 + frhue, -0.5);
	else if (Hue < 2.0) color = vec3( 0.5 - frhue,  0.5,         -0.5);
	else if (Hue < 3.0) color = vec3(-0.5,          0.5,         -0.5 + frhue);
	else if (Hue < 4.0) color = vec3(-0.5,          0.5 - frhue,  0.5);
	else if (Hue < 5.0) color = vec3(-0.5 + frhue, -0.5,          0.5);
	else                color = vec3( 0.5,         -0.5,          0.5 - frhue);
	
	float chroma = saturation * (1.0 - abs(2.0 * lightness - 1.0));
	
	return color * chroma + lightness;
}


#define MAX_ITERATION 120.
float mandelbrot(vec2 c)
{
	vec2 z = c;
	float count = 0.0;
	float t = time*0.2;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) - z*cos(t)+c*sin(t);
		if (length(z) > 2.0) break;
		
		count += 1.0;
	}

	float re = (length(z*count/MAX_ITERATION));
	if (re <= 0.0)
		return 1.;
	return re;
}


vec3 fractal(vec2 z, vec2 c)
{
	vec2 near = z + vec2(DELTA);
	float epsilon = 0.; // mandelbrot(z);
	for (int n = 0; n < N; ++n)
	{
		z = f(z*(1.8+sin(time)), c)*cos(time);
		near = f(near, c);
		epsilon += distance(z, near);
		c *= epsilon;
	}
	
	
	float hue = clamp(0.5 + phase(z) / 6.283185307179, 0.0, 1.0);
	
	return hsl2rgb(hue, S, L(epsilon));
}



void main()
{
	vec2 z = ZOOM * (2.0 * gl_FragCoord.xy / resolution.xy - 1.0);
	vec2 c = ZOOM * (2.0 * mouse - 1.0);
	
	float aspectRatio = resolution.x / resolution.y;
	z.x *= aspectRatio;
	c.x *= aspectRatio;
	z.x += 0.1*sin(time);
	z.y += 0.1*cos(time);
	
#ifdef C
	//c = C;
#endif
#ifdef Z_OFFSET
	//z += Z_OFFSET;
#endif
	
	vec3 color = fractal(z, c);

	gl_FragColor = vec4(color, 1.0);
}
