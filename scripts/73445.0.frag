#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;

uniform vec2 resolution;

const int max_it = 12;

vec2 complexe_mul(vec2 a, vec2 b)
{
	return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

float modulus(vec2 z)
{
	return sqrt(z.x*z.x + z.y*z.y);
}

int mandelbrot(inout vec2 z, in vec2 c) {
	int it = 0;
	for(int i = 0; i < max_it; ++i) {
		vec2 buf = complexe_mul(z,z) + c;
		z = buf;
		if(modulus(buf-z) >= 1.0) return i;
		it = i;
	}
	return it;
}

void main( void )
{

	vec2 pos = (gl_FragCoord.xy/resolution.xy)-vec2(0.75, 0.5);
	pos = pos*3.0;
	vec2 z = vec2(0);
	int it = mandelbrot(z, pos);
	float m_z = modulus(z);
	
	vec3 color = vec3(z, float(it)/float(max_it));
	if(it >= max_it) color = vec3(0);

	gl_FragColor = vec4(color, 1.0);

}