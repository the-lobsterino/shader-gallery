/*
 * Original shader from: https://www.shadertoy.com/view/4l2SRW
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

// shadertoy emulation
#define iTime (fract(((surfaceSize.x*surfaceSize.y)+cos(dot(surfacePosition,surfacePosition)))+time)*2.0-1.0)
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
//const int num_samples = 2 * 3; // 6
const int num_samples = 2*2 * 3*3; // 36
//const int num_samples = 2*2*2 * 3*3*3; // 8*27 = 160+56 = 216


float FoldedRadicalInverse(int n, int base)
{
	float inv_base = 1.0 / float(base);
	float inv_base_i = inv_base;
	float val = 0.0;
	int offset = 0;

	for (int i = 0; i < 8; ++i)
	{
		int div = (n + offset) / base;
		int digit = (n + offset) - div * base;
		val += float(digit) * inv_base_i;
		inv_base_i *= inv_base;
		n /= base;
		offset++;
	}

	return val;
}

// simplified impl due to fabrice neyret <3
float imageFunc(vec2 p, float t)
{
	float pi = 3.141592653589793238,
      offset = sin(t) * 4.,
          r2 = dot(p, p) * 16.,
	    freq = exp2( 1. + floor(r2 * 10.)),
           a = mod(atan(p.y, p.x) / pi * freq + offset, 2.);
    
	return (r2 < 1.) ? step(1., a) : 0.;
}


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    const float pixel_r = 1.165;//002412;
    const float pixel_norm = 1.0 / (3.1415926535897932384626433832795 * pixel_r * pixel_r);
	float s = 0.0;
    float w_sum = 0.0;
	for (int i = 0; i < num_samples; ++i)
	{
        float time_aa = (float(i) + 0.5)/float(num_samples) * 0.03333 * 1.0;

        float a = FoldedRadicalInverse(i, 2) * 6.283185307179586476925286766559;
        float r = sqrt(FoldedRadicalInverse(i, 3)) * pixel_r;
		vec2 pixel_aa = vec2(cos(a), sin(a)) * r;
        float pixel_w = max(0.0, pixel_r - r);

		vec2 uv = (fragCoord + pixel_aa - iResolution.xy * 0.5) / (iResolution.x * 1.0);

		float t = iTime + time_aa;

		s += imageFunc(uv, t) * pixel_w;
        w_sum += pixel_w;
	}
	s *= (1.0 / w_sum); //pixel_norm;// / float(num_samples);
	s = pow(s, 1.0 / 2.2);

	fragColor = vec4(s, s, s, 1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}