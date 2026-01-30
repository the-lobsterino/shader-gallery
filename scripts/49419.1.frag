#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//lets do this

#define PHI 		((sqrt(5.)+1.)*.5)
#define PHI2 		(PHI*PHI)
#define PHI3 		(PHI*PHI*PHI)
#define TAU 		(8.*atan(1.))

struct mat3x6 
{
	float x[6];
	float y[6];
	float z[6];	
};
	
vec3 mul3x6(in vec3 v, in mat3x6 m, out float[6] r)
{
	r[0] = v.x * m.x[0] + v.y * m.y[0] + v.z * m.z[0];
  	r[1] = v.x * m.x[1] + v.y * m.y[1] + v.z * m.z[1];
  	r[2] = v.x * m.x[2] + v.y * m.y[2] + v.z * m.z[2];
	r[3] = v.x * m.x[3] + v.y * m.y[3] + v.z * m.z[3];
  	r[4] = v.x * m.x[4] + v.y * m.y[4] + v.z * m.z[4];
  	r[5] = v.x * m.x[5] + v.y * m.y[5] + v.z * m.z[5];
	
	return v;
}


void main(void) 
{
	vec2 aspect	= resolution.xy/resolution.yy;
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	vec2 m		= (mouse-.5) * aspect;

	mat3x6 b;
	b.x[0] 		= 0.;
	b.x[1] 		= PHI;
	b.x[2] 		= 1.;
	b.x[3] 		= 0.;
	b.x[4] 		= -PHI;
	b.x[5] 		= 1.;
	
	b.y[0] 		= PHI;
	b.y[1] 		= 1.;
	b.y[2] 		= 0.;
	b.y[3] 		= -PHI;
	b.y[4] 		= 1.;
	b.y[5] 		= 0.;
	
	b.z[0] 		= 1.;
	b.z[1] 		= 0.;
	b.z[2] 		= PHI;
	b.z[3] 		= 1.;
	b.z[4] 		= 0.;
	b.z[5] 		= -PHI;
	
	vec3 v		= vec3(1., 1., 1.);
			
	gl_FragColor	= vec4(0., 0., 0.,1.);
}//sphinx
