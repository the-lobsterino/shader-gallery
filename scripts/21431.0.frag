#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 getColor(float phase);

float PI = 4.*atan(1.);

void main(void) {
	float phase = time*0.1*PI;
	
	vec2 p = surfacePosition;
	float theta = atan(p.y, p.x);
	float r = dot(p, p);
	float c = 0.0;
	if (cos(6.0*theta+phase) < 0.0)
	{
		c = 0.5 + 0.5*cos(2.0*PI*10.0*(theta-phase));
		c *= exp(-0.5*pow(abs(r-0.02)/0.01,10.0));
	}
	else
	{
		c = 0.5 + 0.5*cos(2.0*PI*200.0*r);
		c *= exp(-0.5*pow(abs(r-0.03)/0.01,10.0));
	}
	
	gl_FragColor = vec4(c,c,c,1.0);
}
