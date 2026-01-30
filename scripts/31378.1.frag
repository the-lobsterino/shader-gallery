#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float sphere( vec3 p, float s ) {
	return distance( p, vec3(0.) ) - s;
}

float scene( vec3 p ) {
	float d = sphere( p * vec3(1.,5.,1.), .5 ) / 5.;
	float a = atan(p.z,p.x);
	float l = length(vec2(p.y,p.x));
	//a = mod( a, 3.1415926 );
	//p.xz = vec2(cos(a)*l, sin(a)*l);
	d = min(d, sphere( p + vec3(0.25,.25,.0), .25));
	return d;
}

vec3 grad( vec3 p ) {
	vec2 eps = vec2 ( .01, .0 );
	vec3 n = vec3( scene( p + eps.xyy ), scene( p + eps.yxy ), scene( p + eps.yyx ) );
	return normalize( n );
}

vec3 trace( vec3 o, vec3 r ) {
	vec3 c = vec3(.5);
	float t = 0.;
	
	for( int i = 0; i < 100; i++ ) {
		vec3 dt = o + r * t;
		//dt.y += .2 * sin(dt.x - mod(dt.x + .5, 1.) - .5 + time*3.);
		dt.xz = mod( dt.xz + .5, 1.) - .5;
		float d =  scene( dt );
		t += d;
		if( d < .0001) 
			return grad( dt ) * .5 + .5;
	}
	
	return c;
}

void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2. - 1.;
	p.x *= resolution.x/resolution.y;
	
	vec3 o = vec3( 0., 0., -1.);
	vec3 r = normalize(vec3( p.x, p.y, 1.));
	
	float t = time * .1;
	mat2 r1 = mat2(sin(t), cos(t), cos(t), -sin(t));
	mat2 r2 = mat2(sin(mouse.y*2.), cos(mouse.y*2.), cos(mouse.y*2.), -sin(mouse.y*2.));
	o.yz = o.yz*r2;
	o.xz = o.xz*r1;
	r.yz = r.yz*r2;
	r.xz = r.xz*r1;
	
	vec3 color = trace( o, r );

	gl_FragColor = vec4( color, 1.0 );

}