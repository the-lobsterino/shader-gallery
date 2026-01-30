#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float specPower = 111.0;
const float sunSize = 0.01;

#define PHONG

void main( void ) {

	vec2 position = (gl_FragCoord.xy / resolution.xy * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
	vec3 worldVector = normalize(vec3(position, 1.0));
	vec3 normal = vec3(0.0, 1.0, 0.0);
	vec3 lightVector = normalize(vec3(0.0, 1.0, 3.0));
	
	vec3 color = vec3(0.0);
	
	if (position.y < 0.0) {
		#ifdef PHONG
		vec3 reflectedVector = reflect(worldVector, normal);
		float LoR = min(dot(lightVector, reflectedVector) + sunSize * (specPower / (specPower + 1.0 / sunSize)), 1.0);
		color += pow(LoR, specPower);
		#else
		vec3 halfVector = normalize(lightVector - worldVector);
		float NoH = dot(normal, halfVector);
		color += pow(NoH, specPower);
		#endif
		
		//color += max(0.0, dot(lightVector, normal)) / acos(-1.0);
	} else {
		color += step(1.0 - dot(lightVector, worldVector), sunSize);		
	}

	gl_FragColor = vec4(color, 1.0 );

}