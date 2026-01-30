#ifdef GL_ES
precision highp float;
#endif

#define PI 3.1415
#define maxIter 1208

uniform float mouse;
uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	float r=0.,g=0.,b=0.;//plz
	
	vec2 c = surfacePosition;
	c = c*1.0;
	float zoomv = .451 + .45 * sin(time * .5);
	c *= zoomv;
	
	c -= vec2(.51, -.522);
	
	vec2 z = vec2(0);
	
	float I = 0.;
	
	for(int i=1; i<maxIter; i++)
	{
		z = vec2(pow(z.x, 2.)-pow(z.y, 2.),z.x*z.y*2.)+c;
		if(length(z)>32.)
		{
			//float zn = z.x*z.x+z.y*z.y;
			float zn=length(z);
			I=float(i);
			I=mod(sqrt(I+1.0-log2(log2(zn)))*.15,1.0);
			break;
		}
	}
	
	if(I>0.)
	{
		//float roff=0.95; float goff=0.9; float boff=2.1;
		//float rexp=1.8; float gexp=0.9; float bexp=0.7;
		//float rexp=2.7; float gexp=1.5; float bexp=2.;
		
		//r = -4.*pow(pow(mod(I+roff,1.),rexp)-0.5,2.)+1.;
		//g = -4.*pow(pow(mod(I+goff,1.),gexp)-0.5,2.)+1.;
		//b = -4.*pow(pow(mod(I+boff,1.),bexp)-0.5,2.)+1.;
		
		//r = pow(r,1.2)*1.;
		//g = pow(g,2.8)*1.;
		//b = pow(b,1.3)*1.;
		
		I = I + 0.3;
		
		r = .5 + .5 * cos(PI*2.*I);
		g = .5 + .5 * cos(PI*2.*(I+.1));
		b = .5 + .5 * cos(PI*2.*(I+.2));
	}
	
	gl_FragColor = vec4( r, g, b, 1 );

}