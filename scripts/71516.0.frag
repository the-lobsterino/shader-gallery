/*
 * Original shader from: https://www.shadertoy.com/view/wlVBRR
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //


float sin_n(float v)
{
    return sin(v)*0.5+0.5;
}

float rand( vec2 n )
{
	return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    uv.x *= iResolution.x/iResolution.y;
    uv *= 40.0;
    
    uv += vec2(300.0, 6.0*iTime*rand(floor(uv.xx)));
    vec2 id = floor(uv);
    vec2 gv = fract(uv);
    gv -= 0.5+vec2(sin((id.y+2.0)*(id.x+2.0)+iTime*10.0)*0.2, 0.0);

    vec3 col = vec3(1.0-smoothstep(0.1, sin_n(iTime+id.x*id.y)*0.2+0.1, length(gv)));
    col *= vec3(rand(id));
    
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}