#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hex( vec2 p, vec2 h )
{
	vec2 q = abs(p);
	return max(q.x-h.y,max(q.x+q.y*0.57735,q.y*1.1547)-h.x);
}

float box( vec2 p , vec2 b )
{
	vec2 d = abs(p) - b;
	return min( max(d.x,d.y),0.0) + length(max(d,0.0));
}

float thre( float c , float aThre , float aTrue , float aFalse )
{
	return c<aThre?aTrue:aFalse;
}

void main( void ) 
{
	vec2 position = ( gl_FragCoord.xy / resolution.xy );// + mouse / 1.0;
//	float aspect = resolution.x / resolution.y;
	position.x *= resolution.x / resolution.y;

//	vec2 pos = mouse - position;
	vec2 pos = vec2(time,-time)*0.25 + mouse - position;
	
	pos = mod( pos,vec2(0.3)) - 0.15;
	float c = 0.0;
	c += thre(length( pos + vec2( 0.00 , 0.0 ))*3.00 , 0.2 , 1.0 , 0.0 );
	c -= thre(length( pos + vec2( 0.00 ,-0.02))*4.10 , 0.2 , 1.0 , 0.0 );
//	c += thre(length( pos + vec2( 0.0 , -0.0 ))*4.10 , 0.2 , 1.0 , 0.0 );

	c += thre(length( pos + vec2( -0.02 , 0.0 ))*10.00 , 0.2 , 1.0 , 0.0 );
	c += thre(length( pos + vec2( -0.01 , -0.005 ))*25.00 , 0.2 , 1.0 , 0.0 );
	c -= thre(length( pos + vec2( -0.02 , 0.0 ))*11.0  , 0.2 , 1.0 , 0.0 );
	c += thre(length( pos + vec2( +0.02 , 0.0 ))*10.00 , 0.2 , 1.0 , 0.0 );
	c += thre(length( pos + vec2( +0.01 , -0.005 ))*25.00 , 0.2 , 1.0 , 0.0 );
	c -= thre(length( pos + vec2( +0.02 , 0.0 ))*11.0 , 0.2 , 1.0 , 0.0 );
	c += thre(length( pos + vec2( +0.00 , -0.02 ))*25.00 , 0.2 , 1.0 , 0.0 );
	c += thre(length( pos + vec2( +0.00 , -0.04 ))*25.00 , 0.2 , 1.0 , 0.0 );
//	c -= thre(length( pos + vec2( 0.0 , -0.01 ))*3.10 , 0.2 , 1.0 , 0.0 );

	
//	float c = hex( pos , vec2(0.1,1) );
//	float c = box( pos , vec2(0.1,0.1) );
	
	gl_FragColor = vec4( c , c , c ,1.0 );
}