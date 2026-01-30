#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define POT 256.

float fn(vec2 p)
{
	float t = time * 1.;
		
	float s = pow(2., fract(t / 4.));
	p /= s;
	
	float c = 0.;
	float j = 1.;
	
	const float logPot = log2(POT) - 1.;
	
	for (float i = 0.; i<= logPot; i++)
	{
		j *= 2.;
		if (mod(mod(floor(p.x / j), 2.) + mod(floor(p.y / j), 2.), 2.) >= 1.)
			if (i < logPot) c += (j / POT) * s;
			else c+= 1.0 - s;
	}
	
	return c;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy - resolution / 2. ) / resolution.y * POT*1.0;
	gl_FragColor = vec4(vec3(fn(p)),1.0);
}