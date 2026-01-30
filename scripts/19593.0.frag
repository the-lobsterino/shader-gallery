#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Double Mandelbrot


vec2 add (vec2 dsa, vec2 dsb)
{
	vec2 dsc;
	float t1, t2, e;
	
	t1 = dsa.x + dsb.x;
	e = t1 - dsa.x;
	t2 = ((dsb.x - e) + (dsa.x - (t1 - e))) + dsa.y + dsb.y;
	
	dsc.x = t1 + t2;
	dsc.y = t2 - (dsc.x - t1);
	return dsc;
}

// Subtract: res = ds_sub(a, b) => res = a - b
vec2 sub (vec2 dsa, vec2 dsb)
{
	vec2 dsc;
	float e, t1, t2;
	
	t1 = dsa.x - dsb.x;
	e = t1 - dsa.x;
	t2 = ((-dsb.x - e) + (dsa.x - (t1 - e))) + dsa.y - dsb.y;
	
	dsc.x = t1 + t2;
	dsc.y = t2 - (dsc.x - t1);
	return dsc;
}

// Compare: res = -1 if a < b
//              = 0 if a == b
//              = 1 if a > b
float cmp(vec2 dsa, vec2 dsb)
{
	if (dsa.x < dsb.x) return -1.;
	else if (dsa.x == dsb.x)
	{
		if (dsa.y < dsb.y) return -1.;
		else if (dsa.y == dsb.y) return 0.;
		else return 1.;
	}
	else return 1.;
}

// Multiply: res = ds_mul(a, b) => res = a * b
vec2 mul (vec2 dsa, vec2 dsb)
{
	vec2 dsc;
	float c11, c21, c2, e, t1, t2;
	float a1, a2, b1, b2, cona, conb, split = 8193.;
	
	cona = dsa.x * split;
	conb = dsb.x * split;
	a1 = cona - (cona - dsa.x);
	b1 = conb - (conb - dsb.x);
	a2 = dsa.x - a1;
	b2 = dsb.x - b1;
	
	c11 = dsa.x * dsb.x;
	c21 = a2 * b2 + (a2 * b1 + (a1 * b2 + (a1 * b1 - c11)));
	
	c2 = dsa.x * dsb.y + dsa.y * dsb.x;
	
	t1 = c11 + c2;
	e = t1 - c11;
	t2 = dsa.y * dsb.y + ((c2 - e) + (c11 - (t1 - e))) + c21;
	
	dsc.x = t1 + t2;
	dsc.y = t2 - (dsc.x - t1);
	
	return dsc;
}

// Divide: res = ds_div(a, b) => res = a / b
vec2 div (vec2 dsa, vec2 dsb)
{
	vec2 dsc;
	float a1, a2, b1, b2, cona, conb, split = 8193.;
	float c11, c21, c2, e, t1, t2, s1, s2;
	float t11, t12, t21, t22;
	
	s1 = dsa.x / dsb.x;
	cona = s1 * split;
	conb = dsb.x * split;
	a1 = cona - (cona - s1);
	b1 = conb - (conb - dsb.x);
	a2 = s1 - a1;
	b2 = dsb.x - b1;
	
	c11 = s1 * dsb.x;
	c21 = (((a1 * b1 - c11) + a1 * b2) + a2 * b1) + a2 * b2;
	
	c2 = s1 * dsb.y;
	
	t1 = c11 + c2;
	e = t1 - c11;
	t2 = ((c2 - e) + (c11 - (t1 - e))) + c21;
	
	t12 = t1 + t2;
	t22 = t2 - (t12 - t1);
	
	t11 = dsa.x - t12;
	e = t11 - dsa.x;
	t21 = ((-t12 - e) + (dsa.x - (t11 - e))) + dsa.y - t22;
	
	s2 = (t11 + t21) / dsb.x;
	
	dsc.x = s1 + s2;
	dsc.y = s2 - (dsc.x - s1);
	
	return dsc;
}

// create double-single number from float
vec2 set(float a)
{
	vec2 z;
	z.x = a;
	z.y = 0.0;
	return z;
}


// double complex multiplication
vec4 dcMul(vec4 a, vec4 b) {
	return vec4( sub(mul(a.xy,b.xy),mul(a.zw,b.zw))
		,add(mul(a.xy,b.zw),mul(a.zw,b.xy)));
}

// double complex square

vec4 dcSqr(vec4 a) {
	// we need a scalar*double function to be optimal here!
	return vec4( sub(mul(a.xy,a.xy),mul(a.zw,a.zw))
		,mul(mul(a.xy,a.zw),vec2(2.0,0.0)));
}

vec4 dcAdd(vec4 a, vec4 b) {
	return vec4(add(a.xy,b.xy),add(a.zw,b.zw));
}

// Square Length of double complex
vec2 dcSqrLength(vec4 a) {
	return add(mul(a.xy,a.xy),mul(a.zw,a.zw));
}

vec4 dcSet(vec2 a) {
	return vec4(a.x,0.,a.y,0.);
}

// Multiply double-complex with double
vec4 dcMul(vec4 a, vec2 b) {
	return vec4(mul(a.xy,b),mul(a.wz,b));
}

vec2 pow2(float e) {
	int eInt = int(e);
	float eFloat = fract(e);
	
	int index = 0;
	vec2 two = set(2.0);
	vec2 result = set(1.0);
	for (int i = 0; i < 32; ++i) {
		result = mul(result,two);
		index+= 1;
		if (index >= eInt) {
			break;
		}
	}
	
	//result = mul(result,set(eFloat));
	
	return result;
}

#define ITERATIONS 128

void main( void ) {
	

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * vec2(3.0,2.0) - vec2(2.0,1.0);
	
	vec3 color = vec3(0.0);
	
	vec2 four = set(4.0);
	
	float it = 0.0;
	
	vec4 z = dcSet(position);
	
	float t = abs(asin(sin(time)));
	
	vec2 scale = div(set(1.0),pow2(18.0));
	
	z = dcMul(z,scale);
	z.xy = sub(z.xy,set(1.5));
	
	vec4 c = z;
	for (int i = 0; i < ITERATIONS; ++i) {
		z = dcSqr(z);
		z = dcAdd(z,c);
		if (cmp(dcSqrLength(z),four) == 1.0) {
			break;
		}
		it += 1.0;
	}
	
	if (it < float(ITERATIONS)) {
		color.x = sin(it / 3.0);
		color.y = cos(it / 6.0);
		color.z = sin(it / 2.0 + 3.14 / 6.0);
	}
	
	
	gl_FragColor = vec4( color, 1.0 );

}