#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float segment( vec2 a, vec2 b, vec2 p )
{
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return ( length( pa - ba*h ) );
}


float det(mat2 mat)
{
	return (mat[0][0]*mat[1][1])-(mat[0][1]*mat[1][0]);
}


vec2 lineXline(vec2 p11,vec2 p12,vec2 p21,vec2 p22)
{	
	vec2 n0 = (p12-p11).yx*vec2(-1,1);
	vec2 n1 = (p22-p21).yx*vec2(-1,1);
	
	float d0 = dot(n0*p11,vec2(1.));
	float d1 = dot(n1*p21,vec2(1.));

	mat2 d = mat2(n0.x,n0.y,
		      n1.x,n1.y);
	
	mat2 x = mat2(d0,n0.y,
	              d1,n1.y);
	
	mat2 y = mat2(n0.x,d0,
		      n1.x,d1);
	
	return vec2(det(x)/det(d),det(y)/det(d));	
	
}

void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution.xy * 2. - 1.;
	p.x *= resolution.x/resolution.y;
	vec2 m = mouse * 2. - 1.;
	m.x *= resolution.x/resolution.y;

	vec2 a1 = vec2( -.7, -.5 );
	vec2 a2 = vec2( .3, .7 );
	vec2 b1 = vec2( -.9, .1 );
	vec2 b2 = m;
	vec2 intersect = lineXline( a1, a2, b1, b2 );
	float background = smoothstep( 1.,0.,distance(p,lineXline( a1, a2, b1, p ) ) );
	
	float l1 = smoothstep( .01, .0, segment( a1, a2, p ) );
	float l2 = smoothstep( .01, .0, segment( b1, b2, p ) );
	float c1 = smoothstep( .005, .00, abs( distance( p, intersect ) - .03 ) );
	vec3 color =  l1 * vec3( .99,.3,.0) + l2 * vec3( .99, .99, .0 ) + c1 * vec3(0.,1.,1.);
	//color = max( color, background * vec3(0.,.5,0.) );
	
	gl_FragColor = vec4( color, 1. );

}