#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float INVSQRT3 = 1.0/sqrt(3.0);

float tri(vec2 p)
{	
	vec2 q = vec2(p.x+p.y*INVSQRT3, p.y*2.0*INVSQRT3);
	vec2 qi = floor(q);
	vec2 qf = fract(q);
	float m = step(qf.x, qf.y);
	vec2 e = min(min(qf, 1.0-qf.yx), qf.yx-qf.xy);
	return 3.0*dot(e,vec2(m, 1.0-m));
}


float hexa(vec2 p)
{
	vec2 q = vec2(p.x+p.y*INVSQRT3, p.y*2.0*INVSQRT3);
	vec2 qi = floor(q);
	vec2 qf = fract(q);
	float m = step(qf.x, qf.y);
	
	float k = mod(qi.x+qi.y, 3.0);
	float c1 = step(1.0, k);
	float c2 = step(2.0, k);
	vec2 e = 1.0-qf.yx + c1*(qf.x+qf.y-1.0)+c2*(qf.yx-2.0*qf.xy);
	return dot(e,vec2(m, 1.0-m));
}

void main( void ) {

	vec2 p = 10.0*( gl_FragCoord.xy / resolution.y ) + mouse ;
	vec4 color1 = vec4(0.5*cos(1.1*time)+0.5, 0.,1.0, 1.0 );
	vec4 color2 = vec4(0., 0.2*cos(1.3*time+29.)+0.4,1.0, 1.0 );
	float d1 = tri(p);
	float d2 = hexa(p);
	gl_FragColor = mix(color1, color2, smoothstep(0.1, 0.25, d2));
	gl_FragColor *= vec4(1., 1., 0.9*(1.+cos(0.4*time+d1)), 1.0);

}