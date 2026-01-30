#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SCALE 5.0
#define DISTANCE(X,Y,F) abs((Y) - (F(X))) 
#define SOFTEQUAL(X,Y,F) 0.01 / atan( DISTANCE(X,Y,F) )
#define DRAW(D,X,Y,F,R,G,B) float D = SOFTEQUAL(X,Y,F); gl_FragColor += vec4( R*D, G*D, B*D, 1.0 );

#define EQUAL(X,Y) abs((Y) - (X)) < 0.01

float fun1( float x)
{
	return (x-1.0)*(x-0.0)*(x-2.0*cos(time));
}

float fun2( float x)
{
	return (x-1.0)*(x-0.0)*(x+2.0*sin(1.0));
}

float fun3( float x)
{
	return cos(x +time);
}


void main( void ) {

	vec2 position = ( SCALE*gl_FragCoord.xy / resolution.xy ) - (SCALE / 2.0);
	float y = position.y;
	float x = position.x;
	
	//DRAW( drawing1, x, y, fun1, 1.0, 0.3, 0.0);
	DRAW( drawing2, x-0.5, y, fun2, 0.3, 1.0, 0.0);
	//DRAW( drawing3, x, y, fun3, 0.4, 0.0, 0.5);
	
	//draw axis
	if( EQUAL(y, 0.0))
	{
		gl_FragColor = vec4( 1,0,0, 1.0 );
	}
	
	if( EQUAL(x, 0.0))
	{
		gl_FragColor = vec4( 1,0,0, 1.0 );
	}

}