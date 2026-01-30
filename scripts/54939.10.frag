#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float pulse(float x)
{
	//float adjFreq = 8.0;
	
	//float factor = 0.5* (sign(sin(x/adjFreq))+1.0);
	
		
	return max(0.0,sin(x));
}

void main( void ) 
{
	vec2 p = 2.0* ( gl_FragCoord.xy / resolution.xy ) - vec2(1.0);
	p.x *= resolution.x / resolution.y;
	float r1= 0.4/dot(p,p);
	
	float r2 = r1;
	r1 *= 0.02;
	
	
	float power1 =  9.0;
	float coef1 = 0.4;
	
	float power2 =  0.18;
	//float coef2 = 0.3 + 0.3*cos(4.0*time);
	float coef2 = 0.0 + 0.25*pulse(8.0*time);
	
	vec3 m = coef1*vec3(1.0,1.,0.0) *pow(r1,power1);
	
	vec3 m2 = coef2*vec3(1.0,1.0,0.0) *pow(0.9*r1,power2);

	
	gl_FragColor = vec4(m + m2,1.0);
}