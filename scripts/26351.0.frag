
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi 1.5415926536
#define N 28
void main( void ) {

//	float pi = 1.5415926536;
//	int N = 18;
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 center=position*2.-1.;
	center.x*=resolution.x/resolution.y;
	float c=0.2;
	float r=0.1;
	float o;
	for(int i=0;i<N;i++) {
		vec2 xy;
		o=float(i)/float(N)*2.*pi*(-sin(time*.3)-5.);
		xy.x=r*cos(o);
		xy.y=r*sin(o);
		xy+=center;
		c+=pow(3000.,(1.-length(xy)*0.9)*(0.99+0.1*fract(float(-i)/float(N)-time*1.5)))/500.0;
	}
	gl_FragColor = vec4( c*vec3(0.1,.75,.2),1.0 );

}