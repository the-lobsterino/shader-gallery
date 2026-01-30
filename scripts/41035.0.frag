#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec3 mouse;
uniform vec2 resolution;

float VGARainbowChannel( float i, float a, float b, float c, float d, float e )
{    
    if ( i >= 8.0 ) i = 16.0 - i;
    if ( i <= 0.0 ) return a;
    if ( i == 1.0 ) return b;
    if ( i == 2.0 ) return c;
    if ( i == 3.0 ) return d;
    if ( i >= 4.0 ) return e;
    return a;
}

vec3 VGARainbow( float i, float a, float e )
{
    vec3 vi = mod( vec3( i ) + vec3(0,16,8), vec3(24) );

    float b = floor(a * 3./4. + e * 1.0 / 4.0 + 0.25);
    float c = floor(a * 2./4. + e * 2.0 / 4.0 + 0.25);
    float d = floor(a * 1./4. + e * 3.0 / 4.0 + 0.25);
    
    vec3 col;
    col.r = VGARainbowChannel( vi.r, a, b, c, d, e );
    col.g = VGARainbowChannel( vi.g, a, b, c, d, e );
    col.b = VGARainbowChannel( vi.b, a, b, c, d, e );

    return col;
}

vec3 VGAPaletteEntry( float i )
{
    i = floor( i );
    
    // EGA
    if ( i < 16.0 )
    {
        vec3 col;
        col.b  = floor( mod( i / 1.0, 2.0  )) * 2.0;
        col.g  = floor( mod( i / 2.0, 2.0  )) * 2.0;
        col.r  = floor( mod( i / 4.0, 2.0  )) * 2.0;        
        
        col += floor( mod( i / 8.0, 2.0  ) );
        
        if ( i == 6.0 ) col = vec3(2,1,0); // Special brown!

        return col * 21.;
    }

    // Greys
    if ( i == 16.0 ) return vec3(0.0);
    
    if ( i < 32.0 )
    {        
        float x = (i - 17.0);        
        return vec3( floor( .00084 * x * x * x * x - .01662 * x * x * x + .1859 * x * x + 2.453 * x + 5.6038 ) );
    }
    
    // Rainbows
    float rainbowIndex = mod( i - 32.0, 24.0 );
    float rainbowType = floor( (i - 32.0) / 24.0 );
    
    float rainbowTypeMod = floor( mod( rainbowType, 3.0 ) );
    float rainbowTypeDiv = floor( rainbowType / 3.0 );
    
    float rainbowLow = 0.;
    if ( rainbowTypeMod == 1.0 ) rainbowLow = 31.0;
    if ( rainbowTypeMod == 2.0 ) rainbowLow = 45.0;
    
    float rainbowHigh = 63.;
    if ( rainbowTypeDiv == 1.0 )
    {
        rainbowHigh = 28.0;
        rainbowLow = floor( rainbowLow / 2.2 );
    }
    if ( rainbowTypeDiv == 2.0 )
    {
        rainbowHigh = 16.0;
        rainbowLow = floor( rainbowLow / 3.8 );
    }
    
    if ( rainbowType < 9.0 )
    {
	    return VGARainbow( rainbowIndex, rainbowLow, rainbowHigh );
    }
    
    return vec3( 0.0 );
}

void main( void ) {

	vec2 vUV = ( gl_FragCoord.xy / resolution.xy );

    vec2 vFakeResolution = vec2(640,480);
    vUV = floor(vUV * vFakeResolution) / vFakeResolution;
    
    vec2 vFocus = vec2(-0.5, 0.0);
    vec2 vScale = vec2(2.0);
    
    vScale.y /= resolution.x / resolution.y;
    
    vec2 z = vec2(0);
    vec2 c = vFocus + (vUV * 2.0 - 1.0) * vScale;
    
    bool bInside = true;
    
    float fIter = 0.0;
    for(int iter = 0; iter < 512; iter++)
    {        
         z = mat2(z,-z.y,z.x) * z + c;
     
        if ( dot(z,z) > 4.0 )            
        {
            bInside = false;
            break;
        }       
        
        fIter++;
    }
    
    float fIndex = 0.0;
    if ( bInside ) 
    {
        //fIndex = 0.0; // black set
        fIndex = 1.0; // blue set
    }
    else
    { 
        
    	fIndex = 1.0 + mod( fIter, 255.0 );
    }
    
    gl_FragColor.rgb = VGAPaletteEntry( fIndex ) / 63.0;
    gl_FragColor.a = 1.0;

}