#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ITERATIONS 100

vec3 hsv2rgb(vec3 c) {
	  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 complexPow (vec2 base, float e){
	float r = pow(dot(base, base), e * 0.5);
	float theta = atan(base.y, base.x);
	
	return vec2(r * cos(theta * e), r * sin (theta * e));
}

void main( void ) {
	vec2 c = (gl_FragCoord.xy / resolution * 2. - 1.) * 1.5;
	vec2 z = vec2(0);
	
	for (int i = 0; i < ITERATIONS; i++){
		if (dot(z, z) > 4.){
			gl_FragColor = vec4(hsv2rgb(vec3(float(i) / 10., 1., min(float(i), 10.) / 10.)), 1.);
			
			break;
		}
		
		z = complexPow (z, (sin(time / 10.) * 0.5 + 0.5) * 7. + 1.) + c;
	}
	
	
}