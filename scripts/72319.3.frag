/*
 * Original shader from: https://www.shadertoy.com/view/7d23zG
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif


// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
float smin( float a, float b, float k )
{
	float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

// --------[ Original ShaderToy begins here ]---------- //
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord-0.5*iResolution.xy)/iResolution.y;

    uv *= 40.;


    vec2 id = floor(uv);
    vec2 center = id + .5;
    vec2 st = fract(uv);

    float d = 1.;
    const float NNEI = 4.;
    for (float x = -NNEI; x <= NNEI; x++) {
        for (float y = -NNEI; y < NNEI; y++) {
            vec2 ndiff = vec2(x, y);
            vec2 c = center + ndiff;
            float r = length(c);
            float a = atan(c.y, c.x);
            r += sin(iTime * 5. - r*.15) * min(r/5., 1.);
            vec2 lc = vec2(r*cos(a), r*sin(a));
            d = smin(d, length(uv - lc),0.75);
        }
    }
    float w = fwidth(uv.y);
    float v = smoothstep(0.1+w, 0.1-w, d-0.25);

    // Output to screen
	vec3 col = vec3(0.3,0.65,0.8);
	vec3 col1 = vec3(1.,0.7,0.4);
    fragColor = vec4(mix(col,col1,v),1.0);

}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}