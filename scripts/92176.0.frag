// ändrom3da
// ...


// ▓program options▓
#define CELL_SIZE	4.00           
#define ZOOM_ANIMATION  1
#define ROTATION        1
#define OFFSET          0.02
#define MIN_ZOOM        ( 1./32. )

// ▓a bunch of stuff▓ 
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float        time;
#define time         time*(4./4.)    // adjust speed here
uniform vec2         mouse;
uniform vec2         resolution;
#define res	     resolution
uniform sampler2D    backBuffer;
#define	bb	     backBuffer
varying vec2         surfacePosition;
vec3 c = vec3(0.0);                           // c stands for color

// ▓stuff i need▓
#define tau             6.283185307179586
#define rot( a )	mat2( cos(a), -sin(a), sin(a), cos(a) )
#define nsin( a )       sin( a )*.5 + .5

// ▓transfer▓
//#define  cellSize CELL_SIZE
float cellSize = pow(2.0,CELL_SIZE)/16.;
float offset = OFFSET;
float minZoom = MIN_ZOOM;

// ▓main function...▓
void main( void )
{
    // ▓domain▓
    vec2 p = 8.*surfacePosition;
    vec2 p0 = gl_FragCoord.xy / res.xy;   // this is used later for the backbuffer effect at the end

    // ▓rotation▓
    #if ( ROTATION == 1 )
	p *= rot( time*tau/8. );
    #endif
  
    // ▓animation▓
    #if ( ZOOM_ANIMATION == 1 )
	cellSize *= nsin( time/2. ) + minZoom;
    #endif

    // ▓checkerboard structure▓	
    c.r = step( mod(p.x, cellSize*2.), cellSize ) + 
	step( mod(p.y, cellSize*2.), cellSize );
    c.r = mod( c.r, 2.0 );
    p *= rot ( offset );
    c.g = step( mod(p.x, cellSize*2.), cellSize ) + 
	step( mod(p.y, cellSize*2.), cellSize );
    c.g = mod( c.g, 2.0 );
     p *= rot ( offset );	
    c.b = step( mod(p.x, cellSize*2.), cellSize ) + 
	step( mod(p.y, cellSize*2.), cellSize );
    c.b = mod( c.b, 2.0 );

	
    // ▓little backbuffer effect▓
    c.r = ( nsin( 2.*time ) + 1./64. )*( 8./32. )*texture2D( bb, p0 ).x + nsin( time/16. ) * ( 64./32. )*c.r;   // backbuffer smoothness whateva... 
    c.g = ( nsin( 2.*time ) + 1./64. )*( 8./32. )*texture2D( bb, p0 ).x + nsin( time/16. ) * ( 64./32. )*c.g;
    c.b = ( nsin( 2.*time ) + 1./64. )*( 8./32. )*texture2D( bb, p0 ).x + nsin( time/16. ) * ( 64./32. )*c.b;
	
     // ▓final color▓	
    gl_FragColor = vec4(c.r, c.g, c.b, 1.0);
}