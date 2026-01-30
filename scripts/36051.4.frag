#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
varying vec2 surfacePosition;

float pro(float v)
{
	float p= 0.1;

	for(int i = 1; i<9; i++)
	{
		p += cos(((mod(time,1000.)+v*3.+cos(p*1.58))/float(i))*3.14);
		
	}
	return  (1./(atan(p)+2.))-0.5;
}

float fit(float dist) {
	dist /= length(vec2(dFdx(dist), dFdy(dist)));
    return smoothstep(0.3, .7, sqrt(abs(dist)*0.3));
}

void main( void ) {

	vec2 pos = surfacePosition*vec2(1.,3.);
	vec3 v = vec3(1.15*fit(pos.y-pro(pos.x))*normalize(abs(vec3(pro(pos.x*0.99),pro(pos.x*1.011+5.75),pro(pos.x*1.0111+2.3317)))));
	vec3 col = (v);
	gl_FragColor = vec4( col, 1.0 );

}