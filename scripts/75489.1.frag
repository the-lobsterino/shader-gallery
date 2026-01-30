#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float i,e,f,s,g,k=.01;
	for( o++; i++ < 1e2; g += min(f, max(.03, e))*.3 ) {
		s = 2.;
		vec3 p = vec3((FC.xy-r/s)/r.y*g,g-s);
		p.yz *= rotate2D(-.8);
		p.z += t;
		for(e=f=p.y;s<2e2;s/=.6) {
			p.xz *= rotate2D(s);
			e += abs(dot(sin(p*s)/s,p-p+.4));
			f += abs(dot(sin(p.xz*s*.6)/s,r/r));
		}
		o += (f>k*k?e:-exp(-f*f)) * o * k;
	}

}