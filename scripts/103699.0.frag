/*
 * Original shader from: https://www.shadertoy.com/view/dly3Dz
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
const vec2 vp = vec2(100.0, 100.0);

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float t = iTime * 1.0;// + iMouse.x;
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 p0 = (uv - 0.5) * vp;
    vec2 hvp = vp * 0.5;
	vec2 p1d = vec2(cos( t / 98.0),  sin( t / 178.0)) * hvp - p0;
	vec2 p2d = vec2(sin(-t / 124.0), cos(-t / 104.0)) * hvp - p0;
	vec2 p3d = vec2(cos(-t / 165.0), cos( t / 45.0))  * hvp - p0;
    float sum = 0.5 + 0.5 * (
		cos(length(p1d) / 653.0) +
		cos(length(p2d) / 15.0) +
		sin(length(p3d) / 5.0) * sin(p3d.x / 2.0) * sin(p3d.y / 5.0));
	float ff = fract(sum);
    fragColor = vec4(ff,ff,ff,1.0);
}


// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}