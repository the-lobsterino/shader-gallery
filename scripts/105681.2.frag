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
const vec2 vp = vec2(100.0, 20.0);

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float t = iTime * 2.6;// + iMouse.x;
	vec2 uv = fragCoord.xy / iResolution.xy;

	uv *= 1.8;
    vec2 p0 = (uv - 1.0) * vp;
    vec2 hvp = vp * 0.8;
	vec2 p1d = vec2(cos( t / 8.0),  sin( t / 8.0)) * hvp - p0;
	vec2 p2d = vec2(sin(-t / 14.0), cos(-t / 4.0)) * hvp - p0;
	vec2 p3d = vec2(cos(-t / 15.0), cos( t / 5.0))  * hvp - p0;
    float sum = 0.5 + 0.5 * (
		cos(length(p1d) / 19.0) +
		cos(length(p2d) / 9.0) +
		sin(length(p3d) / 22.6) * sin(p3d.x / 15.0) * sin(p3d.y / 4.0));
	float ff = sin(iTime*0.1+fract(sum*0.98)*6.28);
	ff=abs(ff-0.41);
	ff=pow(ff,3.3);
    fragColor = vec4(ff*5.,ff*0.37,ff*0.1,1.0);
	
}


// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}