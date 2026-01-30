// is PLASMA SHIT V5 YES 
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
	float t = iTime * 0.4;// + iMouse.x;
	vec2 uv = fragCoord.xy / iResolution.xy;
	uv-=0.5;
	
	
	uv *= 1.0+sin(iTime)*0.25;
    vec2 p0 = (uv - 0.5) * vp;
    vec2 hvp = vp * 0.5;
	vec2 p1d = vec2(cos( t / 4.9),  sin( t / 3.0)) * hvp - p0;
	vec2 p2d = vec2(sin(-t / 1.3), cos(-t / 14.0)) * hvp - p0;
	vec2 p3d = vec2(cos(-t / 5.0), cos( t / 22.2))  * hvp - p0;
    float sum = 0.5 + 0.5 * (
		cos(length(p1d) / 12.0) +
		cos(length(p2d) / 5.0) +
		sin(length(p3d) / 15.6) * sin(p3d.x / 2.0) * sin(p3d.y / 5.0));
	float ff = sin(t*.3+fract(sum)*6.28);
	//ff = abs(ff);
	vec3 ccol = vec3(0.6,0.7,1.2) * ff;
	
    fragColor = vec4(ccol,1.0);
}


// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}//