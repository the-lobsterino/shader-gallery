/*
 * Original shader from: https://www.shadertoy.com/view/WljGzW
 */

#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution


// --------[ Original ShaderToy begins here ]---------- //
#define M_PI 3.1415926535897932384626433832795

float ci(vec2 _st, float _radius, float _start, float _end, float _div)
{
    vec2 dist = _st-vec2(0.5);
    float lAngle = _start + atan(dist.y, dist.x);
    float lDivision = M_PI / _div;
    float lMod = mod(lAngle, lDivision);
    float lCuts = (_div > -1.0) ? ( smoothstep(lDivision, lDivision - 0.02, lMod) * 
                          smoothstep(_end - 0.02, _end, lMod)) : 1.0;
    
	return 1.-smoothstep(- 0.001 + _radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0)*lCuts; //smoothstep(0.48, 0.5, lMod)
}

float mandala(vec2 uv, float time)
{
    return ( ci(uv, 2.85 + sin(iTime * 1.0) * 2.05, -2.42 - time, 2.6, 2.0) - 
            ci(uv, 0.65 + sin(iTime * 2.0) * 0.05, -1.42 - time, 0.6, 3.0)) +

        ( ci(uv, 0.7 + 0.05 + cos(time * 2.0) * 0.05, 0.2 - time, 0.7, 3.0) - 
         ci(uv, 0.55 + 0.05 + cos(time * 2.0) * 0.05, 0.2 - time, 0.7, 3.0)) +
        ( ci(uv, 0.5, 0.0 + time, 0.3, 3.0) - 
         ci(uv, 0.3, 0.0 + time, 0.3, 3.0)) -
        ( ci(uv, 0.46, 0.0 + time, 0.3, 3.0) - 
         ci(uv, 0.34, 0.0 + time, 0.3, 3.0)) +

        ( ci(uv, 0.44, 0.0 - time * 0.5, 0.05, 26.0) - 
         ci(uv, 0.36, 0.0 - time * 0.5, 0.05, 26.0)) +

        ( ci(uv, 0.25, 0.0 - time * 2.5, 0.5, 3.0) - 
         ci(uv, 0.15, 0.0 - time * 2.5, 0.5, 3.0)) +
        ( ci(uv, 0.12, 0.3 + time * 1.5, 0.2, 8.0) - 
         ci(uv, 0.07, 0.3 + time * 1.5, 0.2, 8.0)) +
        ( ci(uv, 0.05, 0.3 - time * 1.1, 0.4, 3.0) - 
         ci(uv, 0.025, 0.3 - time * 1.1, 0.4, 3.0)) +
        ( ci(uv, 0.015, 0.5 + time * 3.1, 1.8, 1.0) - 
         ci(uv, 0.0075, 0.5 + time * 3.1, 1.8, 1.0));
}

/*
float por(in vec2 _st, in float _radius, in float _start, in float _end)
{
    vec2 dist = _st-vec2(0.5);
 
	return 1.-smoothstep(- 0.001 + _radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}
*/
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.yy - vec2(0.4, 0.0);
    
    // Time varying pixel color
    float lCircles = mandala(uv, iTime);
        ;
    vec3 col = vec3(lCircles);

    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}