// Mandelbrot
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 complexAdd(vec2 c0, vec2 c1)
{
    vec2 result = vec2(c0.x + c1.x, c0.y + c1.y);

    return result;
}

vec2 complexMult( vec2 c0, vec2 c1 )
{
    vec2 result;

    result.x = (c0.x * c1.x) - (c0.y * c1.y);
    result.y = (c0.x * c1.y) + (c1.x * c0.y);

    return result;
}

void main( void )
{

    vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
    uv.x *= (resolution.x / resolution.y);
    uv.x -= 0.5;

    vec3 finalColor = vec3( 1.0 );

    vec2 z = vec2(uv.x, uv.y );
    vec2 c = vec2(uv.x, uv.y);

    float up = 100000.0;

    vec3 colorWeights = vec3( 0.0 );
    for(int currentStep = 0; currentStep < 30; ++currentStep)
    {
        z = complexAdd( complexMult(z, z), c);

        if( abs(z.x) >= up || abs(z.y) >= up )
        {
            colorWeights = vec3( 0.0 );
            break;
        }

        colorWeights = vec3( 1.0, 0.0, 1.0);
    }

    finalColor = colorWeights;

    gl_FragColor = vec4( finalColor, 1.0 );

}