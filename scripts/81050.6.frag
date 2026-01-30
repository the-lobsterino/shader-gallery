          //\
         // \\
        //   \\
       //     \\
      //   A   \\
     //         \\
    // ändrom3da \\
   //_____________\\

 // well there is a litle fractal hidden in there...
// inklusive kleiner schönheitsfehler.

#extension GL_OES_standard_derivatives : enable
precision highp float;

#define SIZE 0.5

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define TAU                  6.283185307179586
#define PHI                  1.618033988749

vec3 cosPalette( float t, vec3 a, vec3 b, vec3 c, vec3 d )
{
    // stolen from https://www.shadertoy.com/view/ll2GD3 palette shadertoy from iq:
    #define PAL1 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67)
    #define PAL2 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20)
    #define PAL3 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20)
    #define PAL4 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30)
    #define PAL5 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20)
    #define PAL6 vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
    #define PAL7 vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25)
    return a + b*cos( TAU*( c*t + d ) );
}

float rectangle( vec2 p1, vec2 size )
{
	float r = step( 0., p1.x )      * step( 0., p1.y ) *
		  step( p1.x, size.x )  * step( p1.y, size.y );
	return r;
}

vec3 colorBar( vec2 p1, vec3 c )
#define TILES 20.
{
	vec3 o = vec3(1.0);
	const float  border  =  0.002;
	vec2 rectPos         =  vec2(0.0, 0.0);
	vec2 rectSize        =  vec2(1.0, 0.03);
	o *= rectangle(p1 - rectPos, rectSize);
	o *= cosPalette( (floor(TILES*p1.x + 0.5*TILES*time))/TILES, PAL1 );
        p1 += rectPos;
	return (o - c) * step( p1.y - border, rectSize.y + rectPos.y );  // minus c because the scene should not be over
}

void main( void )
{
	// mouse control	
	vec2 m = (mouse.x - vec2(1.+(1./16.), 0.0));
	vec2 p = (1./(m.x*2.))*(2.0*gl_FragCoord.xy - resolution) / min( resolution.x, resolution.y );
        vec2 p1 = (PHI*gl_FragCoord.xy) /min( resolution.x, resolution.y ); p1.y = 1.0 - p1.y;      
	vec2 p2 = (m.x*16.*gl_FragCoord.xy) / min( resolution.x, resolution.y ); p1.y = 1.0 - p1.y;      

	vec3 c = vec3(0.0);
	c += colorBar(p1, c);
	
	// checkerboard
	float b = mod ( 
		         step( mod( p2.x, SIZE ) , SIZE/2. ) + 
		         step( mod( p2.y, SIZE ) , SIZE/2. ),
	          2.0 );
	
	if (p1.y > 0.03) c += b;

	gl_FragColor = vec4( vec3(c), 1.0 );
}
