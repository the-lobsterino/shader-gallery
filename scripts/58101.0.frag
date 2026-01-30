#ifdef GL_ES
precision mediump float;
#endif

//uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


/* BECOME A GREAT MATHEMATICIAN IN JUST 10 SECONDS || a complex function grapher */

/* made by Tapio Saarinen aka twitter user @_ardeej */

/* recommended resolution: 1 */



// the hue represents the argument aka phase angle of a complex number at the point where it is drawn
// the saturation and brightness represent the magnitude
// http://en.wikipedia.org/wiki/Domain_coloring



// specify scale and origin
// by default the origin is at the center of the screen

vec2 scale = vec2 (1.0, 1.0)*4.0;
vec2 origin = vec2 (0.0, 0.0);



//// hsb to rgb conversion from:  http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}



// constants
float pi  = 3.1415926535897932384626433832795028841971693993751058209;
float tau = 6.2831853071795864769252867665590057683943387987502116419;
float e   = 2.7182818284590452353602874713526624977572470936999595749;



/*//////////
// syntax //
////////////

// the vector vec2 (a, b) represents the complex number a + bi

// two complex numbers add together as vectors do
a + bi + c + di = a + c + (b + d)i
vec2 (a, b) + vec2 (c + d) = (a + c, b + d)

// however, complex multiplication is different from elementwise vector multiplication
(a + bi)(c + di) = ac - bd + (ad + bc)i
vec2 (a, b) * vec2 (c, d) = (ac, bd)

// to multiply two vectors as complex numbers, use the function mult(z, w) instead
mult(vec2 (a, b), vec2 (c, d)) = (ac - bd, ad + bc)

available functions:

z + w		// sum of z and w
z - w		// subtract w from z
r*w		// scalar multiplication | r is a real number | r is of type float

rad(z)		// absolute value of cartesian z
arg(z)		// argument aka phase angle of cartesian z

real(z)		// real part of polar z
imag(z) 	// imaginary part of polar z

polr(z)		// cartesian z into polar coordinates
cart(z)		// polar z into cartesian coordinates

conj(z)		// conjugate of cartesian or polar z

	// the rest of the functions are for cartesian z, w,...
	// all numbers are complex unless otherwise noted 

invr(z)		// inverse of z
mult(z, w)	// product of z and w
mult(z, w, x)	// product of z, w and x
dvde(z, w)	// z divided with w
 
sqre(z)		// z^2
cube(z)		// z^3
sqrt(z)		// principal branch of √z

cexp(z)		// e^z
clog(z)		// principal branch of ln z

expb(b, z)	// b^z
logb(b, z)	// principal branch of log_b z

nlog(n, z)	// n:th branch of ln z | n is integer
nlgb(n, b, z)	// n:th branch of log_b z | n is integer

poww(w, z)	// principal branch of z^w
cwrt(w, z)	// principal branch of z^(1/w)

npow(n, w, z)	// n:th branch of z^w | n is integer
nwrt(n, w, z)	// n:th branch of z^(1/w) | n is integer

csin(z)		// complex sine of z
ccos(z)		// complex cosine of z
ctan(z)		// complex tangent of z
ccot(z)		// complex cotangent of z
csec(z)		// complex secant of z
ccsc(z)		// complex cosecant of z

sinh(z)		// hyperbolic sine of z
cosh(z)		// hyperbolic cosine of z
tanh(z)		// hyperbolic tangent of z
coth(z)		// hyperbolic cotangent of z
sech(z)		// hyperbolic secant of z
csch(z)		// hyperbolic cosecant of z

arcsin(z)	// inverse sine of z
arccos(z)	// inverse cosine of z
arctan(z)	// inverse tangent of z
arccot(z)	// inverse cotangent of z
arcsec(z)	// inverse secant of z
arccsc(z)	// inverse cosecant of z

arsinh(z)	// inverse hyperbolic sine of z
arcosh(z)	// inverse hyperbolic cosine of z
artanh(z)	// inverse hyperbolic tangent of z
arcoth(z)	// inverse hyperbolic cotangent of z
arsech(z)	// inverse hyperbolic secant of z
arcsch(z)	// inverse hyperbolic cosecant of z

// most of the function names are four letters long
// exceptions: rad, arg and inverse functions

// functions with branches (nlog, nglb, npow, nwrt): n is a whole number (of type float). choosing n = 0.0 gives the principal branch

// example functions in mathematical and program notation:

// f(z) = (z^2 + z*)/2
vec2 f(vec2 z) {
	return (sqre(z) + conj(z))/2.0;
}

// f(z) = (2 + i)^(1 - z)/(1 + z)^(2 - i)
vec2 f(vec2 z) {
	return dvde(expb(vec2 (2.0, 1.0), vec2 (1.0, 0.0) - z), poww(vec2 (1.0, 0.0) + z, vec2 (2.0, -1.0)));
}

// you can also use two-variable functions, the variable w gets mouse coordinates
// f(z) = log(zw)/z - w
vec2 f(vec2 z, vec2 w) {
	return dvde(clog(mult(z, w)), z) - w;
}

*/// the function being graphed is defined after the basic function definitions



//////////////////////////
// elementary functions //
//////////////////////////



// radius and argument for cartesian z
float rad(vec2 z) { return sqrt(z.x*z.x + z.y*z.y);
}

float arg(vec2 z) {
	if (z.x > 0.0) { return atan(z.y / z.x); }
	if (z.x < 0.0) {
		if (z.y < 0.0) { return atan(z.y / z.x) - pi; }
		return atan(z.y / z.x) + pi;
	}
	if (z.y > 0.0) { return pi/2.0; }
	if (z.y < 0.0) { return pi/2.0; }
	return 0.0;
}

//real and imaginary parts for polar z
float real(vec2 z) { return z.s*cos(z.t);
}
float imag(vec2 z) { return z.s*sin(z.t);
}

// cartesian z into polar z
vec2 polr(vec2 z) { return vec2 (rad(z), arg(z));
}

//polar z into cartesian z
vec2 cart(vec2 z) { return vec2 (cos(z.t), sin(z.t))*z.s;
}


// conjugate of cartesian or polar z
// z* = a - bi
vec2 conj(vec2 z) { return vec2 (z.x, -z.y);
}



/////////////////////////////////////////
// operators to compose functions with //
// these operators are for cartesian z //
/////////////////////////////////////////

//// multiplication, division, inverses

// inverse of z
// 1/z = (a - bi)/(a^2 + b^2)
vec2 invr(vec2 z) {
	if (length(z) == 0.0) { return vec2 (1e10); }
	return vec2 (z.x, -z.y)/(z.x*z.x + z.y*z.y);
}

// product of z and w
// zw = ac - bd + (bc + ad)i
vec2 mult(vec2 z, vec2 w) { return vec2 (z.x*w.x - z.y*w.y, z.x*w.y + z.y*w.x);
}

// product of z, w and x
// zwx = ace - bde - adf - bcf + (acf - bdf + ade + bce)i
vec2 mult(vec2 z, vec2 w, vec2 x) { return mult(mult(z, w), x);
}


// divide z with w
// z/w = (ac + bd + (bc - ad)i)/(c^2 + d^2)
vec2 dvde(vec2 z, vec2 w) {
	if (length(w) == 0.0) { return vec2 (1e10); }
	return vec2 (z.x*w.x + z.y*w.y, -z.x*w.y + z.y*w.x)/(w.x*w.x + w.y*w.y);
}



//// basic functions: square, cube, squareroot

// square of z
// z^2 = a^2 - b^2 + 2abi
vec2 sqre(vec2 z) { return vec2 (z.x*z.x - z.y*z.y, 2.0*z.x*z.y);
}

// cube of z
// z^3 = a(a^2 -3b^2) + b(3a^2 - b^2)i
vec2 cube(vec2 z) {
	float p = z.x*z.x;
	float q = z.y*z.y;
	return vec2 (z.x*(p - 3.0*q), z.y*(3.0*p - q));
}

// principal branch of the complex square root of z
// sqrt z = sqrt((sqrt(a^2 + b^2) + a)/2) + sgn(b)sqrt((sqrt(a^2 + b^2) - a)/2)i
vec2 csrt(vec2 z) {
	float r = sqrt(z.x*z.x + z.y*z.y);
	float a = sqrt((r + z.x)/2.0);
	float b = sqrt((r - z.x)/2.0);
	if (z.y < 0.0) { return vec2 (a, -b); }
	return vec2 (a, b);
}



//// exponentials and logarithms

// exponential base e of z
// e^z = e^a(cos(b) + sin(b)i)
vec2 cexp(vec2 z) { return vec2 (cos(z.y), sin(z.y))*exp(z.x);
}

// principal branch of the logarithm base e of z
// adding a multiple of 2πi gives another branch
// log z = log(a^2 + b^2)/2 + arg(z)i
vec2 clog(vec2 z) { return vec2 (log(z.x*z.x + z.y*z.y)/2.0, arg(z));
}

// exponential base b of z, b is complex
// b^z = e^(z log b)
vec2 expb(vec2 b, vec2 z) { return cexp(mult(z, clog(b)));
}

// principal branch of the logarithm base b of z, b is complex
// log_b z = log(z)/log(b)
vec2 logb(vec2 b, vec2 z) { return dvde(clog(z), clog(b));
}



//// branches of exponentials and logarithms

// n:th branch of the logarithm base e of z
// 0:th branch is the principal branch
// log z = log(a^2 + b^2)/2 + (arg(z) + n2π)i
vec2 nlog(float n, vec2 z) {return vec2 (log(z.x*z.x + z.y*z.y)/2.0, arg(z) + n*tau);}

// n:th branch of the logarithm base b of z
// 0:th branch is the principal branch
// log_b z = log(z)/log(b)
vec2 nlgb(float n, vec2 b, vec2 z) { return dvde(nlog(n, z), clog(b));
}



//// roots and powers

// principal branch of z to the w:th power
vec2 poww(vec2 w, vec2 z) { return cexp(mult(w, clog(z)));
}

// principal branch of w:th root of z, w is complex
// z^(1/w)
vec2 cwrt(vec2 w, vec2 z) { return cexp(dvde(clog(z), w));
}



//// branches of roots and powers

// n:th branch of z to the w:th power
vec2 npwz(float n, vec2 w, vec2 z) { return cexp(mult(w, nlog(n, z)));
}

// n:th branch of w:th root of z
// z^(1/w)
vec2 nwrt(float n, vec2 w, vec2 z) { return cexp(dvde(nlog(n, z), w));
}



//// trigonometric functions

// complex sine
// sin z = sin(a)cosh(b) + cos(a)sinh(b)i
vec2 csin(vec2 z) { return vec2 (0.5*sin(z.x)*(exp(z.y) + exp(-z.y)), 0.5*cos(z.x)*(exp(z.y) - exp(-z.y)));
}

// complex cosine
// cos z = cos(a)cosh(b) - sin(a)sinh(b)i
vec2 ccos(vec2 z) { return vec2 (0.5*cos(z.x)*(exp(z.y) + exp(-z.y)), -0.5*sin(z.x)*(exp(z.y) - exp(-z.y)));
}

// complex tangent
// tan z = sin(z)/cos(z)
vec2 ctan(vec2 z) { return dvde(csin(z), ccos(z));
}

// complex cotangent
// cot z = cos(z)/sin(z)
vec2 ccot(vec2 z) { return dvde(ccos(z), csin(z));
}

// complex secant
// sec z = 1/cos(z)
vec2 csec(vec2 z) { return invr(ccos(z));
}

// complex cosecant
// csc z = 1/sin(z)
vec2 ccsc(vec2 z) { return invr(csin(z));
}



//// inverse trigonometric functions

// inverse sine
// arcsin z = -log(-b + ai + sqrt(1 + b^2 - a^2 - 2abi))i
vec2 arcsin(vec2 z) {
	vec2 a = csrt(vec2 (1.0 + z.y*z.y - z.x*z.x, -2.0*z.x*z.y));
	a = clog(vec2 (-z.y + a.x, z.x + a.y));
	return vec2 (a.y, -a.x);
}

// inverse cosine
// arccos z = log(a + bi - sqrt(1 + b^2 - a^2 - 2abi)i)i
vec2 arccos(vec2 z) {
	vec2 a = csrt(vec2 (1.0 + z.y*z.y - z.x*z.x, -2.0*z.x*z.y));
	a = clog(vec2 (z.x + a.y, z.y - a.x));
	return vec2 (-a.y, a.x);
}

// inverse tangent
// arctan z = i(log(1 + b - ai) - log(1 - b + ai))/2
vec2 arctan(vec2 z) {
	vec2 a = clog(vec2 (1.0 + z.y, -z.x));
	vec2 b = clog(vec2 (1.0 - z.y, z.x));
	return vec2 (b.y - a.y, a.x - b.x)/2.0;
}

// inverse cotangent
// arccot z = i(log((a^2 + b^2 - b - ai)/(a^2 + b^2)) - log((a^2 + b^2 + b + ai)/(a^2 + b^2)))/2
vec2 arccot(vec2 z) {
	float p = z.x*z.x;
	float q = z.y*z.y;
	float r = p + q;
	vec2 a = clog(vec2 (p + q - z.y, -z.x)/r);
	vec2 b = clog(vec2 (p + q + z.y, z.x)/r);
	return vec2 (b.y - a.y, a.x - b.x)/2.0;
}

// inverse secant
// arcsec z = -log((a + sqrt((a^2 + b^2)^2 - a^2 + b^2 + 2abi)i - bi)/(a^2 + b^2))i
vec2 arcsec(vec2 z) {
	float p = z.x*z.x;
	float q = z.y*z.y;
	float r = p + q;
	vec2 a = csrt(vec2 (r*r - p + q, 2.0*z.x*z.y));
	a = clog(vec2 (z.x - a.y, a.x - z.y));
	return vec2 (a.y, log(r) - a.x);
}

// inverse cosecant
// arccsc z = -log((sqrt((a^2 + b^2)^2 - a^2 + b^2 + 2abi) + b + ai)/(a^2 + b^2))i
vec2 arccsc(vec2 z) {
	float p = z.x*z.x;
	float q = z.y*z.y;
	float r = p + q;
	vec2 a = csrt(vec2 (r*r - p + q, 2.0*z.x*z.y));
	a = clog(vec2 (a.x + z.y, a.y + z.x));
	return vec2 (a.y, log(r) - a.x);
}



//// hyperbolic functions

// hyperbolic sine
// sinh z = sinh(a)cos(b) + cosh(a)sin(b)i
vec2 sinh(vec2 z) { return vec2 (0.5*(exp(z.x) - exp(-z.x))*cos(z.y), 0.5*(exp(z.x) + exp(-z.x))*sin(z.y));
}

// hyperbolic cosine
// cosh z = cosh(a)cos(b) + sinh(a)sin(b)i
vec2 cosh(vec2 z) { return vec2 (0.5*(exp(z.x) + exp(-z.x))*cos(z.y), 0.5*(exp(z.x) - exp(-z.x))*sin(z.y));
}

// hyperbolic tangent
// tanh z = sinh(z)/cosh(z)
vec2 tanh(vec2 z) { return dvde(sinh(z), cosh(z));
}

// hyperbolic cotangent
// coth z = cosh(z)/sinh(z)
vec2 coth(vec2 z) { return dvde(cosh(z), sinh(z));
}

// hyperbolic secant
// sech z = 1/cosh(z)
vec2 sech(vec2 z) { return invr(cosh(z));
}

// hyperbolic cosecant
// csch z = 1/sinh(z)
vec2 csch(vec2 z) { return invr(sinh(z));
}



//// inverse hyperbolic functions

// inverse hyperbolic sine
// arsinh z = log(a + bi + sqrt(a^2 - b^2 + 1 + 2abi))
vec2 arsinh(vec2 z) { return clog(z + csrt(vec2 (z.x*z.x - z.y*z.y + 1.0, 2.0*z.x*z.y)));
}

// inverse hyperbolic cosine
// arcosh z = log(a + bi + sqrt(a + 1 + bi)sqrt(a - 1 + bi))
vec2 arcosh(vec2 z) { return clog(z + mult(csrt(vec2 (z.x + 1.0, z.y)), csrt(vec2 (z.x - 1.0, z.y))));
}

// inverse hyperbolic tangent
// artanh z = log((1 - a^2 - b^2 + 2bi)/(1 + a^2 + b^2 - 2a))/2
vec2 artanh(vec2 z) {
	float r = z.x*z.x + z.y*z.y;
	return clog(vec2 (1.0 - r, 2.0*z.y)/(1.0 + r - 2.0*z.x))/2.0;
}

// inverse hyperbolic cotangent
// arcoth z = log((a^2 + b^2 - 1 - 2bi)/(a^2 + b^2 - 2a + 1))/2
vec2 arcoth(vec2 z) {
	float r = z.x*z.x + z.y*z.y;
	return clog(vec2 (r - 1.0, -2.0*z.y)/(r - 2.0*z.x + 1.0))/2.0;
}

// inverse hyperbolic secant
// arsech z = log((sqrt(a^2 - b^2 - (a^2 + b^2)^2 - 2abi) + a - bi)/(a^2 + b^2))
vec2 arsech(vec2 z) {
	float r = z.x*z.x + z.y*z.y;
	vec2 a = mult(csrt(vec2 (z.x - r, -z.y)), csrt(vec2 (z.x + r, -z.y)));
	a = clog(vec2 (a.x + z.x, a.y - z.y));
	return vec2 (a.x - log(r), a.y);
}

// inverse hyperbolic cosecant
// arcsch z = log((sqrt((a^2 + b^2)^2 + a^2 - b^2 - 2abi) + a - bi)/(a^2 + b^2))
vec2 arcsch(vec2 z) {
	float p = z.x*z.x;
	float q = z.y*z.y;
	float r = p + q;
	vec2 a = csrt(vec2 (r*r + p - q, -2.0*z.x*z.y));
	a = clog(vec2 (a.x + z.x, a.y - z.y));
	return vec2 (a.x - log(r), a.y);
}

//// possibly added later: different branches for multivalued trigonometric / hyperbolic functions



////////////////////////////////
// the function to be graphed //
////////////////////////////////

// the function has two variables to allow for mouse interaction / time dependency / whatever
// the first variable (z) is the running variable, the second variable (w) is mouse coordinates

vec2 f(vec2 z, vec2 w) {
	return dvde(clog(mult(z, w)), conj(z) + sqre(w*0.5)) - w;
}



/////////////////////////////

void main( void ) {
	
	// z is the running variable to be graphed
	vec2 z = ((gl_FragCoord.xy/resolution.xy - 0.5)*scale.xy + origin.xy);
	z.y *= min(resolution.y/resolution.x, resolution.x/resolution.y);
	
	// m is the cartesian complex number at mouse coordinates
	vec2 m = ((mouse.xy - 0.5)*scale.xy + origin.xy);
	m.y *= min(resolution.y/resolution.x, resolution.x/resolution.y);
	
	// w is the function's value. the function also calls m as the second value
	vec2 w = f(z, m);
	
	float r = log(1.0 + rad(w));
	
	// c is the rgb color at each z
	vec3 c = hsv2rgb(vec3 (arg(w)/tau, 1.0/(1.0 + 0.3*r), 1.0 - 1.0/(1.1 + 5.0*r)));

	gl_FragColor = vec4(c, 1.0);
}