#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-1.0);
const float TAU = PI * 2.0;

const float sunAngularSize = 0.5;
const float sunIluminance = 1.0;
const float roughness = 0.02;

#define clamp01(x) clamp(x, 0.0, 1.0)
#define max0(x) max(x, 0.0)

const float sunRadius = radians(sunAngularSize);
const float cosSunRadius = cos(sunRadius);
const float tanSunRadius = tan(sunRadius);
const float sunLuminance = 1.0 / ((1.0 - cosSunRadius) * TAU) * sunIluminance;

float calculateSunSpot(float VdotL) {
	return step(cosSunRadius, VdotL) * sunLuminance;
}

float lumBRDF(float cosTheta, float roughness){
	roughness = clamp(roughness, 0.000001, 1.0);
	
	float alpha2 = roughness * roughness * roughness * roughness;
	
	float x = cosTheta - 1.0;
	float z = x / (alpha2);
	      z = abs(z);
	
	float a = 1.0 / sqrt(alpha2 * alpha2 * pow(PI, 20.0) + z * pow(PI, 10.0) + 1.0);
	
	return a * sunLuminance;
}

float calculateNoH(float radiusTan, float NoL, float NoV, float VoL){
	float RoL = 2.0 * NoL * NoV - VoL;
	if (RoL >= cosSunRadius)
		return 1.0;

	float rOverLengthT = cosSunRadius * radiusTan * inversesqrt(1.0 - RoL * RoL);
	float NoTr = rOverLengthT * (NoV - RoL * NoL);
	float VoTr = rOverLengthT * (2.0 * NoV * NoV - 1.0 - RoL * VoL);

	float triple = sqrt(clamp01(1.0 - NoL * NoL - NoV * NoV - VoL * VoL + 2. * NoL * NoV * VoL));

	float NoBr = rOverLengthT * triple, VoBr = rOverLengthT * (2.0 * triple * NoV);
	float NoLVTr = NoL * cosSunRadius + NoV + NoTr, VoLVTr = VoL * cosSunRadius + 1.0 + VoTr;
	float p = NoBr * VoLVTr, q = NoLVTr * VoLVTr, s = VoBr * NoLVTr;
	float xNum = q * (-0.5 * p + 0.25 * VoBr * NoLVTr);
	float xDenom = p * p + s * (s - 2.0 * p) + NoLVTr * ((NoL * cosSunRadius + NoV) * VoLVTr * VoLVTr +
				   q * (-0.5 * (VoLVTr + VoL * cosSunRadius) - 0.5));
	float twoX1 = 2.0 * xNum / (xDenom * xDenom + xNum * xNum);
	float sinTheta = twoX1 * xDenom;
	float cosTheta = 1.0 - twoX1 * xNum;

	NoTr = cosTheta * NoTr + sinTheta * NoBr;
	VoTr = cosTheta * VoTr + sinTheta * VoBr;

	float newNol = NoL * cosSunRadius + NoTr;
	float newVol = VoL * cosSunRadius + VoTr;
	float NoH = NoV + newNol;
	float HoH = 2.0 * newVol + 2.0;
	
	return max0(NoH * NoH / HoH);
}

float calcFresnel(float VoH, float f0){
	return pow(VoH, 5.0) * (1.0 - f0) + f0;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	vec2 wUV = (position * 2.0 - 1.0) * vec2(1.0, resolution.y / resolution.x);
	vec3 worldVector = -normalize(vec3(wUV, 1.0));
	vec3 normal = vec3(0.0, 1.0, 0.0);
	vec3 lightDir = normalize(vec3(0.0, 0.1, 1.0));
	vec3 halfVector = normalize(lightDir - worldVector);
	
	float VoN = clamp01(dot(worldVector, normal));
	float VoL = dot(worldVector, lightDir);
	float NoL = clamp01(dot(normal, lightDir));
	float HoN = calculateNoH(tanSunRadius, NoL, VoN, VoL);
	float VoH = clamp01(dot(halfVector, lightDir));
	
	float fresnel = calcFresnel(VoH, 0.0);
	float brdf = (lumBRDF(HoN, roughness) * fresnel) * (HoN);

	vec3 color = vec3(0.0);
	color += VoN != 0.0 ? brdf : calculateSunSpot(-VoL);
	
	color = pow(color, vec3(2.2));
	color /= color + 1.0;
	color = pow(color, vec3(1.0 / 4.4));

	gl_FragColor = vec4(color, 1.0 );

}