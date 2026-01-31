#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

vec3 GetCol(vec2 uv)
{
const vec2 vp = vec2(40.0, 40.0);
	float t = iTime * 1.0;// + iMouse.x;
		//uv *= 0.4;
    vec2 p0 = (uv - 0.5) * vp;
    vec2 hvp = vp * 0.5;
	vec2 p1d = vec2(cos( t / 9.0),  sin( t / 3.0)) * hvp - p0;
	vec2 p2d = vec2(sin(-t / 14.0), cos(-t / 4.0)) * hvp - p0;
	vec2 p3d = vec2(cos(-t / 15.0), cos( t / 5.0))  * hvp - p0;
    float sum = 0.5 + 0.5 * (
		cos(length(p1d) / 3.0) +
		cos(length(p2d) / 12.0) +
		sin(length(p3d) / 6.6) * sin(p3d.x / 2.0) * sin(p3d.y / 3.0));
	float ff = sin(iTime*0.3+fract(sum*0.88)*6.28);
	//ff=ff+0.2;
	ff=pow(ff+0.2,1.5);
    vec3 col = vec3(ff*0.7,ff*1.3,ff*2.12);
	return col;

	
}

// --------[ Original ShaderToy begins here ]---------- //

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
	vec3 col = GetCol(uv);

    fragColor = vec4(col,1.0);
	
}


// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}//