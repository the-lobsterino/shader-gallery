#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 palette(float t) {
	vec3 a = vec3(0.5,0.5,0.5);
	vec3 b = vec3(0.5,0.5,0.5);
	vec3 c = vec3(1.0,1.0,1.0);
	vec3 d = vec3(0.00, 0.33, 0.67);
	
	return a + b*sin( 7.28318*(c*t+d));
}

void main( void ) {
	vec3 final = vec3(0.0);
	vec2 nres = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
	nres.x *= resolution.x / resolution.y;
	vec2 nres0 = nres;
	for (float i = 0.0; i < 6.0; i++){
		nres = fract(nres * 1.6) - 0.5;
		float d = length(nres) * exp(-length(nres0));
		vec3 col = palette(length(nres0) + i * .6 + time * .9);
		d = cos(d * 25.0 + time)/3.0;
      	 	d = abs(d);
		d = pow(0.01 / d, 1.2);
		final += col*d;
	}
	gl_FragColor = vec4(final,1.0);
}