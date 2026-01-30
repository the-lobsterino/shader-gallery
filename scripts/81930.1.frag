#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform highp float time;

const vec3 bRd = vec3(0.3, 0.5, 1.0) * 3e-5;
const vec3 bRn = vec3(1.0, 1.0, 1.0) * 2e-5;
const vec3 bRn2 = vec3(0.2, 0.6, 0.8) * 2e-5;

const float bMs = 1e-6;

const float pi = radians(180.0);

#define d0(x) (abs(x) + 1E-8)

vec3 dayCoeff = bRd + bMs;
vec3 nightCoeff = pow(vec3(1.0, 1.0, 1.0), vec3(1.0)) * 1e-6 + 7e-6;
vec3 nightCoeff2 = bRn2 + bMs;

vec3 scatter(vec3 coeff, float depth){
	return coeff * depth;
}

vec3 absorb(vec3 coeff, float depth){
	return exp2(scatter(coeff, -depth));
}

// Atmospheric Scattering Depth Interga
float sDi(float depth)
{
	depth = depth * 2.0 - 0.1;
    depth = max(depth + 0.01, 0.01);
	depth = depth * depth * (5.0 - 1.0 * depth);
    depth = 1.0 / depth;

	return 50000.0 * depth;
}

float phasePoint(float ldotW)
{
	const float lightAngularDiameterCos = 0.9995;
	return 1e5 * smoothstep(lightAngularDiameterCos, lightAngularDiameterCos + 1e-4, ldotW);
}

float phaseRayleigh(float ldotW)
{
	/*
	Rayleigh phase scattering function
			   3
	p() =	________   [1 + cos()^2]

			   16
	*/
    return 0.75 * (1.0 + ldotW * ldotW);
}

float phaseMie(float ldotW, float g)
{
	/*
	Henyey-Greenstein Mie phase scattering function
			   1		 		1  g^2
	p() =	________   ____________________________
			   4		[1 + g^2  2g cos()]^(3/2)
	*/
	float gg = g * g;
	return (3.0 * (1.0 - gg) * (1.0 + ldotW * ldotW)) / (8.0 * pi * (2.0 + gg) * pow(1.0 + gg - 2.0 * g * ldotW, 1.5));
}

vec3 physicAtmSky(vec3 worldVector, vec3 sunVector, vec3 moonVector)
{
  const float ln2 = log(2.0);

	float sDotW = dot(worldVector, sunVector);
	float mDotW = dot(worldVector, moonVector);

	float oD_Rlh = sDi(worldVector.y);
  float oD_Su = sDi(sunVector.y);
  float oD_Mo = sDi(moonVector.y);

    // ------------------------------------------

    vec3 sc_Rlhd = scatter(dayCoeff, oD_Rlh);
    vec3 ab_Rlhd = absorb(dayCoeff, oD_Rlh);

    vec3 sc_Rlhn = scatter(nightCoeff, oD_Rlh);
    vec3 ab_Rlhn = absorb(nightCoeff, oD_Rlh);

    vec3 sc_Sun = scatter(dayCoeff, oD_Su);
    vec3 ab_Sun = absorb(dayCoeff, oD_Su);

    vec3 sc_Moon = scatter(nightCoeff, oD_Mo);
    vec3 ab_Moon = absorb(nightCoeff, oD_Mo);

	// -------

    vec3 sunStep = abs(ab_Sun - ab_Rlhd) /
    	d0((sc_Sun - sc_Rlhd) * ln2);
    vec3 moonStep = abs(ab_Moon - ab_Rlhn) /
    	d0((sc_Moon - sc_Rlhn) * ln2);

    vec3 dayLi = sc_Rlhd *
    phaseRayleigh(sDotW) * sunStep;
    vec3 nigLi = sc_Rlhn *
    phaseRayleigh(mDotW) * moonStep;

	// ------------------------------------------

  vec3 sunP = phasePoint(sDotW) * ab_Rlhd * pi;
  vec3 moonP = phasePoint(mDotW) * ab_Rlhd * pi;

	vec3 sunB = (phaseMie(sDotW, mix(0.99, 0.4, 0.0)) * 0.3 +
	phaseMie(sDotW, mix(0.6,0.2,0.0)) * 0.8) *
	ab_Rlhd * 0.3;
	vec3 moonB = (phaseMie(mDotW, mix(0.99, 0.4, 0.0)) * 0.3 +
	phaseMie(mDotW, mix(0.6,0.2,0.0)) * 0.8) *
	ab_Rlhn * 0.3;

	dayLi += sunP + sunB;
	nigLi += moonP + sunB;

  vec3 col = dayLi + nigLi;
  return col * pi;
}

vec3 spacePos(vec2 p)
{
	p = p * 2.0 - 1.0;
  return vec3(p.x, p.y, 1.0);
}


vec3 jRT(vec3 c){
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    vec3 tc = c / (c + 1.0);

    return mix(c / (l + 1.0), tc, tc);
}

void main(void) {
vec2 uv = gl_FragCoord.xy / max(resolution.x, resolution.y);
//uv.x += -0.15;uv.y += 0.2;
uv.x += 0.07;uv.y += -0.1;

uv *= 1.6;

float t = time * 0.1;

vec3 sp = normalize(spacePos(vec2(0.5, .8)));
vec3 mp = normalize(-sp);
vec3 wp = normalize(spacePos(uv));

vec3 sk = physicAtmSky(wp, sp, mp);
sk = jRT(sk);

	gl_FragColor = vec4(sk, 1.0);
}
