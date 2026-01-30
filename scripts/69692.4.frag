// f(z) = log_z (-z + c)
// by Matteo Basei
// http://www.matteo-basei.it
// https://www.youtube.com/c/matteobasei



#define f(z, c)    logarithm(-z + c, z)
#define L(epsilon) 1.0 - 1.0 / (1.0 + epsilon)
#define S          0.5
#define ZOOM       10.0 * pow(mod(mouse.x, 1.0), 4.0)
#define DELTA      0.0001 * ZOOM
#define N          20
#define C          vec2(-0.1, 0.01)
//#define Z_OFFSET   vec2(0.0, 0.0)



precision mediump float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){ p.y+=1.75*CHS;	d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS))); p+=vec2(0.5,-3.25)*CHS; return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} 
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}
 
float GetText(vec2 uv)
{
	uv.x += 2.75;
	float d = 2000.0;
	
		d = B(uv,1.0);uv.x -= 1.1;
		d = R(uv,d);uv.x -= 1.1;
		d = E(uv,d);uv.x -= 1.1;
		d = X(uv,d);	uv.x -= 1.1;
		d = I(uv,d);uv.x -= 1.1;
		d = T(uv,d);
	return smoothstep(0.0,0.03,d-0.22*CHS);
}

#define PI 3.14159265

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
// [-PI, PI]
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
// (principal value)
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



// HSL => RGB
vec3 hsl2rgb(float hue, float saturation, float lightness)
{
	float hexhue = 6.0 * hue;
	float frahue = fract(hexhue);
	
	vec3 color;
	if      (hexhue < 1.0) color = vec3( 0.5,          -0.5 + frahue, -0.5);
	else if (hexhue < 2.0) color = vec3( 0.5 - frahue,  0.5,          -0.5);
	else if (hexhue < 3.0) color = vec3(-0.5,           0.5,          -0.5 + frahue);
	else if (hexhue < 4.0) color = vec3(-0.5,           0.5 - frahue,  0.5);
	else if (hexhue < 5.0) color = vec3(-0.5 + frahue, -0.5,           0.5);
	else                   color = vec3( 0.5,          -0.5,           0.5 - frahue);
	
	float chroma = saturation * (1.0 - abs(2.0 * lightness - 1.0));
	
	return color * chroma + lightness;
}


vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

// epsilon = SUM_n |f_n(z + delta) - f_n(z)|
vec3 fractal(vec2 z, vec2 c)
{
	vec2 near = z + vec2(DELTA);

	float epsilon = 0.0;
	
	for (int n = 0; n < N; ++n)
	{
		z = f(z +(1.-GetText(vec2(mod(z.x+.5,-.5),z.y)*(100.*(1.132-pow(mouse.y,.2)))+vec2(3.5,0.))), c);
		near = f(near, c);
		
		epsilon += distance(z, near);
	}
	
	float hue = clamp(0.5 + 0.5 * phase(z) / PI, 0.0, 1.0);
	
	return hsv(hue,1.,L(epsilon));
	//return hsl2rgb(hue, S, L(epsilon));
}



void main()
{
	vec2 z = ZOOM * (2.0 * gl_FragCoord.xy / resolution.xy - 1.0);
	vec2 c = ZOOM * (2.0 * mouse -1.0);
	
	float aspectRatio = resolution.x / resolution.y;
	z.x *= aspectRatio;
	c.x *= aspectRatio;
	
#ifdef C
	c = C;
#endif
#ifdef Z_OFFSET
	z += Z_OFFSET;
#endif
	
	vec3 color = fractal(z, c);

	gl_FragColor = vec4(color, 1.0);
}
