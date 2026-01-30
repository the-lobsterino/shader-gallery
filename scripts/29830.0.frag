#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float box( vec2 position, vec2 scale)
{
	vec2 vertex 	= abs(position) - scale;
	vec2 edge 	= max(vertex, 0.);
	float interior	= max(vertex.x, vertex.y);

	return min(interior, 0.) + length(edge);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;
		
	vec2 c = position * 2. - 1.; 
	
	c.x *= resolution.x / resolution.y;
	
	#define NUM 16
	
	const float NUM_INV = 1./float( NUM );
	
	float s = 0.;
	
	mat2 rt;
	
	//how can i make a single domain that i can fract or hash somehow and draw the box in
	// was thinking of taking a planar vec3 crossing it with the view normal so that at any point in the circle i have a line going to the center and a perpendicular one
	// then somehow converting that but huh :D
	
	for ( int i = 0 ; i < NUM ; i ++ ){
		
		float hash = float(i);
		float a = hash * NUM_INV * 6.28318530718;

		vec2 sc = vec2( sin(a) , cos(a) );
		
		rt[0][0] = sc.y ;  rt[0][1] = sc.x ;
		rt[1][0] = -sc.x ; rt[1][1] = sc.y ;
		
		vec2 vr = rt * c;
		
		vr += vec2(.0,0.5);
		
		
		
		s += smoothstep( .02 , 0.0 , box( vr , vec2(.01,.05) ) );
		
	}
	
	//float color = 0.0;
	//color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( s ), 1.0 );

}