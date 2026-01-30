#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 complexe_mul(vec2 a, vec2 b)
{
	return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

float modulus(vec2 z)
{
	return sqrt(z.x*z.x + z.y*z.y);
}

vec2 mandelbrot(vec2 z, vec2 c) {
	const int max_it = 3;
	for(int i = 0; i < max_it; ++i)
		z = complexe_mul(z,z) + c;
	return z;

}

void main( void )
{

	vec2 pos = (gl_FragCoord.xy/resolution.xy)-vec2(0.75, 0.5);
	pos = pos*3.0;
	vec2 z = mandelbrot(vec2(0), pos);
	float m_z = modulus(z);
	
	vec3 color;
	//if(m_z <= 1.0) color = vec3(z.x, m_z, z.y);
	if(m_z <= 1.0) color = vec3(0);
	else color = vec3(1.0)*m_z;

	gl_FragColor = vec4(color, 1.0);

}