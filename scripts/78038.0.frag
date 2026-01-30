#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

//Lagrange points vizualizer

//1 = earth-moon system
//2 = sun-jupiter
//3 = sun-earth
//default = demo system
const int system = 0;
const bool rotate = true;

const float mSun = 1.989e30;
const float mJupiter = 1.898e27;
const float dSunJupiter = 77834e7;

const float mEarth = 5.972e24;
const float mMoon = 7.6e22;
const float dEarthMoon = 384399.0;
const float dSunEarth = 1495978707e2;

const float g = 6.674e-11;

const float linScale = 1e-6;
const float logScale = 9.0;

vec2 accBody(vec2 o, vec2 a, float ma, float r) {
	vec2 oa = (a - o) * r;
	float d = length(oa);
	return g * ma * oa / (d*d*d);
}

vec2 accTot(vec2 p, vec2 b1, float m1, vec2 b2, float m2, float r) {
	float mtot = m1 + m2;
	vec2 c = (b1*m1 + b2*m2) / (mtot);
	
	vec2 ab1 = accBody(p, b1, m1, r);
	vec2 ab2 = accBody(p, b2, m2, r);
	
	vec2 co = (p - c) * r;
	float d = length(co);
	vec2 ac = g*mtot * co / (r*r*r);

	return (ab1 + ab2 + ac);
}

void main( void ) {

	vec2 pixm11 = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
	pixm11.x *= resolution.x / resolution.y;
	pixm11 *= 2.0;
	
	vec2 b1 = vec2(-0.0, 0);
	vec2 b2 = b1 + (rotate ? vec2(cos(time), sin(time)) : vec2(1, 0));
	
	vec2 atot;
	float logScale = 5.0;
	float linScale;
	
	if (system == 1) {
		atot = accTot(pixm11, b1, mEarth, b2, mMoon, dEarthMoon);
		linScale = 1e-6;
	} else if (system == 2) {
		atot = accTot(pixm11, b1, mSun, b2, mJupiter, dSunJupiter);
		linScale = 1.0;
	} else if (system == 3) {
		atot = accTot(pixm11, b1, mSun, b2, mEarth+mMoon, dSunEarth);
		linScale = 1.0;
	} else {
		atot = accTot(pixm11, b1, 1e7, b2, 2e6, 1.0);
		linScale = 1.0;
	}
	
	vec3 col = vec3(pow(length(atot) * linScale, 1.0 / logScale));
	
	gl_FragColor = vec4(col, 1.0);

}