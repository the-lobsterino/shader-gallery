#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define N 1000.

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;

	float color = 0.0;
	float mk=floor(30.*mouse.x);
	float ft=(3.141/180.)*mk;
	for(float t=0.;t<N;t++)
	{
		float an=t*ft+5.*time;
		float rg=(t/N+abs(cos(t*2.)))/2.;
		float kx=t/N;
		float x=(kx*rg)*cos(an);
		float y=-0.5+t/N+(rg*.3)*sin(an);
		vec2 r=vec2(x,y);
		float d=abs(0.02+0.01*sin(an+3.141));
		if(distance(p,r)<d)
				color=d*30.;
	}
	

	gl_FragColor = vec4( vec3( color ), 1.0 );

}