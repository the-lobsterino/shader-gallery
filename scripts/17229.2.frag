#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float filmSize = 2.0;
const float epsilon = 0.01;

const float maxDist = 5.0;
const int maxSteps = 64;
const float stepSize = maxDist/float(maxSteps);

const float maxDistLight = 1.0;
const int maxLightSteps = 6;
const float stepSizeLight = maxDistLight / float(maxLightSteps);

const vec3 lightIntensity = vec3(1.0, 0.7, 0.4);
vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));

float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*57.0 + 113.0*p.z;

    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
    return res;
}

float sdSphere(vec3 pos, vec3 center, float radius) {
	return length(pos - center) - radius;
}

float func(vec3 pos)
{	
	float f1 = sdSphere(pos, vec3(cos(time),sin(time), -1.0), 2.80);
	return f1 + 1.3 * noise(pos);
}

void main( void ) {
	vec3 rayOrigin;
	vec3 rayDirection;

	// camera ray origin
	rayOrigin = vec3(0.0, 0.0, 2.0);

	// camera ray direction
	vec2 pixelLocation = (gl_FragCoord.xy / resolution.xy);
	vec2 uv = pixelLocation * 2.0 - vec2(1.0);
	rayDirection = normalize(vec3(filmSize * uv * vec2(resolution.x/resolution.y, 1.0), -1.0));

	vec3 Lo = vec3(0.0);

	vec3 pos = rayOrigin;
	float T = 1.0;
	float absorption = 1.0;

	for(int i = 0; i < maxSteps; i++){
		float dist = func(pos);
		if (dist <= 0.0){

			T *= 1.0 - (dist / float(maxSteps)) * absorption;
			if (T <= epsilon)
			    break;

			float Tl = 1.0;
			vec3 posl = pos + lightDirection * stepSizeLight;
			vec3 Li = vec3(0.0);
			for(int j=0; j < maxLightSteps; j++){
	        	float ligthDist = func(posl);

				if (ligthDist <= 0.0)
					Tl *= 1.0 - (ligthDist/ float(maxLightSteps)) * absorption;
					Li += Tl * vec3(0.3,0.35,0.35) * (1.0/float(maxLightSteps)) * 0.40;
		    	if (Tl <= epsilon)
			            break;

		      	posl += lightDirection * stepSizeLight;
			}
			// T_total = T_old * T_i
			// C_i = T_total * L(xi) * c(xi) * ρ(xi) * dx
			// C_total = C_old + C_i
			Lo += T * Li * (1.0/float(maxSteps)) * vec3(1.0) * 2.0;
       	}
		pos += rayDirection * stepSize;
	}

    gl_FragColor = vec4(Lo, 1.0);
}