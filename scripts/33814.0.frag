#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define NBPers 3

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Person{
	float circle;
	vec2 pos;
	int neighbors[5];
};

float line( vec2 a, vec2 b, vec2 p )
{
	vec2 aTob = b - a;
	vec2 aTop = p - a;
	
	float t = dot( aTop, aTob ) / dot( aTob, aTob);
	
	t = clamp( t, 0.0, 1.0);
	
	float d = length( p - (a + aTob * t) );
	d = 1.0 / d;
	
	return clamp( d, 0.0, 1.0 );
}

	
float circle(vec2 pos){
	return 1.-(smoothstep(0.28,0.3,length(pos))+1.-(smoothstep(0.28,0.3,length(pos)*1.2)*2.-1.));
}	

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) *2.-1.;
	
	Person array[NBPers];
	
	float plan =0.;
	for(int i=0;i<NBPers;i++){
		Person p;
		p.pos=position-vec2(0.6*float(i),0.1*float(i));
		p.pos.x+=0.5;
		p.circle=circle(p.pos);
		plan+=p.circle;
		//array[0]=p;
	}

	gl_FragColor = vec4(plan);

}