// ändrom3da

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// program options
#define CELL_SIZE	2.0
#define ZOOM            24.0

// stuff
#define nsin( a ) 	sin(a)*.5+.5
#define rot( a )	mat2( cos(a), -sin(a), sin(a), cos(a) )

// transfer
float cellSize = CELL_SIZE;
float zoom = ZOOM;

float c = 0.0;

float circle( vec2 p, float r )
{
    return step( length( p ), r );
}

void main( void )
{
    // the domain	
    vec2 p = zoom*surfacePosition;
	
    // rotation
    p *= rot( time/4. );
	
    // wobble motion
    p -= 2.*sin( 2.*time );

    // checkerboard structure	
    c = step( mod( p.x, cellSize*2. ), cellSize ) + 
	step( mod( p.y, cellSize*2. ), cellSize );
    
    // some circle stuff
    c += circle( mod( p, 2.0 ) - 1.0, 0.85 + nsin(2.*time)/8. );
    c += circle( mod( p, 16.0 ) - 8.0, 24.0*nsin(time) );
    
    // white plus white just gives black
    c = mod( c, 2.0 );
 
    // that's it
    gl_FragColor = vec4(c, c, c, 1.0);
}