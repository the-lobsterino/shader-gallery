// ändrom3da

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float        time;
uniform vec2         mouse;
uniform vec2         resolution;
uniform sampler2D    bb;
varying vec2         surfacePosition;

// program options
#define CELL_SIZE	4.
#define ZOOM_ANIMATION  1
#define ROTATION        1

// stuff
#define tau             6.283185307179586
#define rot( a )	mat2( cos(a), -sin(a), sin(a), cos(a) )
#define nsin( a )       sin( a )*0.5+0.5

// transfer
float cellSize = CELL_SIZE;

float c = 0.0;

void main( void )
{
    // domain
    vec2 p = 8.*surfacePosition;
    vec2 p0 = gl_FragCoord.xy / resolution.xy;
	
    // rotation
    #if ( ROTATION == 1 )
	p *= rot( time*tau/8. );
    #endif

  
    // animation
    #if ( ZOOM_ANIMATION == 1 )
        float minimum = 1./64.;
	cellSize *= nsin( time/2. ) + minimum;
    #endif

    // checkerboard structure	
    c = step( mod(p.x, cellSize*2.), cellSize ) + 
	step( mod(p.y, cellSize*2.), cellSize );
    c = mod( c, 2.0 );
    
    c = ( nsin( 2.*time ) + 1./64. )*( 8./32. )*texture2D( bb, p0 ).x + nsin( time/16. ) * ( 64./32. )*c;   // backbuffer smoothness whateva... 
	
    gl_FragColor = vec4(c, c, c, 1.0);
}