#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define max3(a) max(a.x, max(a.y, a.z))

const int steps = 3000;
const float rSteps = 1.0 / float(steps);

const float raylengthIn = rSteps * 20.0;
const float density = 50000.0 * raylengthIn;

const vec3 scatterCoeff = vec3(5.8000e-6, 1.3500e-5, 3.3100e-5) * density;

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float distfunction(vec3 p){
	p.xz = rotate2d(time * 0.3) * p.xz;
	float k = max3(abs(p)) - 1.5;	
	
	return max(k + raylengthIn, raylengthIn);
}

vec3 scatterInt(vec3 stepTrans){
	return stepTrans * -1.0 + 1.0;
}

void march(vec3 worldVector, inout vec3 worldPosition, out float rayCount, out float rayDist, inout vec3 scatter, inout vec3 transmittance){	
	for (int i = 0; i < steps; ++i){
		float dist = distfunction(worldPosition);
		bool mask = dist == raylengthIn;
		
		rayDist += dist;
		
		if (rayDist > 50.0) break;
		
		rayCount += float(mask);
		
		float od = float(mask) * exp2(-(length(worldPosition) - 1.0) * 5.0);
		
		vec3 stepTransmittance = exp2(-scatterCoeff * od);
		scatter += scatterInt(stepTransmittance) * transmittance;
		transmittance *= stepTransmittance;
		
		worldPosition += dist * worldVector;
	}
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	vec2 wpos2 = (position * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
	vec3 worldVector = normalize(vec3(wpos2, 1.0));
	vec3 worldPosition = vec3(0.0, 0.0, -4.0);
	float rayDist = 0.0;
	float rayCount = 0.0;
	
	vec3 scatter = vec3(0.0);
	vec3 transmittance = vec3(1.0);
	
	march(worldVector, worldPosition, rayCount, rayDist, scatter, transmittance);

	vec3 color = vec3(0.0);
	     color += scatter;
	
	color = pow(color, vec3(1.0 / 2.2));

	gl_FragColor = vec4(color, 1.0 );

}