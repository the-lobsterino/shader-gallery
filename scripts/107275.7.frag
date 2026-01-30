#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float noiseMethod(vec2 uv)
{
    float _lacunarity = 2.0; // Noiseness
    float _gain = 0.5; // Crispyness
    float _amplitude = 1.5; // How much is does
    float _frequency = 2.0; // Another kind of scale?
    float _power = 1.0; // Color sharpness

    const int _octaves = 1;

    float _finalValue = 0.0;

    vec2 p = uv;

    //p = p * _scale + vec2(_offsetX,_offsetY);

    float fpA = 127.1; // 127.1
    float fpB = 311.7; // 311.7
    float fpC = 269.5; // 269.5
    float fpD = 183.3; // 183.3
    float fpE = 43758.5453123; // 43758.5453123

    for( int j = 0; j < _octaves; j++ )
    {
        vec2 i = floor( p * _frequency );
        vec2 f = fract( p * _frequency );      
        vec2 t = f * f * f * ( f * ( f * 6.0 - 15.0 ) + 10.0 );
        vec2 a = i + vec2( 0.0, 0.0 );
        vec2 b = i + vec2( 1.0, 0.0 );
        vec2 c = i + vec2( 0.0, 1.0 );
        vec2 d = i + vec2( 1.0, 1.0 );
        a = -1.0 + 2.0 * fract( sin( vec2( dot( a, vec2( fpA, fpB ) ),dot( a, vec2( fpC, fpD ) ) ) ) * fpE );
        b = -1.0 + 2.0 * fract( sin( vec2( dot( b, vec2( fpA, fpB ) ),dot( b, vec2( fpC, fpD ) ) ) ) * fpE );
        c = -1.0 + 2.0 * fract( sin( vec2( dot( c, vec2( fpA, fpB ) ),dot( c, vec2( fpC, fpD ) ) ) ) * fpE );
        d = -1.0 + 2.0 * fract( sin( vec2( dot( d, vec2( fpA, fpB ) ),dot( d, vec2( fpC, fpD ) ) ) ) * fpE );
        float A = dot( a, f - vec2( 0.0, 0.0 ) );
        float B = dot( b, f - vec2( 1.0, 0.0 ) );
        float C = dot( c, f - vec2( 0.0, 1.0 ) );
        float D = dot( d, f - vec2( 1.0, 1.0 ) );
        float noise = ( mix( mix( A, B, t.x ), mix( C, D, t.x ), t.y ) );              
        _finalValue += _amplitude * noise;
        _frequency *= _lacunarity;
        _amplitude *= _gain;
    }
    _finalValue = clamp(_finalValue, -1.0, 1.0 );
    return pow(_finalValue * 0.5 + 0.5, _power);
}



float getFalloff(vec2 uv)
{
    float land;

    land = smoothstep(0.2, .5, length(uv - 0.5));

    land = 1.-clamp(land, 0.0, 1.0);
    return land;
}



void main( void ) {
    vec2 uv = ( gl_FragCoord.xy / resolution.xy );
    float ScaleValue = 2.0;
    float OffsetValue = 100.0;
    
    vec4 col = vec4(1.0,1.0,1.0,1.0);
    
    // Output to screen
    float a = noiseMethod(uv*ScaleValue + vec2(1.,1.)*OffsetValue);
    
    float b = getFalloff(uv)*a;
    
    col.rgba = vec4(b<.5?0.:1.);
	
    gl_FragColor = col;
}