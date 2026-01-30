/*
 * Original shader from: https://www.shadertoy.com/view/llfGWH
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

const vec2 center = vec2(0.5,0.5);

const vec4 lineColor = vec4(0.2,0.4,0.9,1.0);
const vec4 backgroundColor = vec4(0.2);

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    
	vec2 uv = fragCoord.xy / iResolution.xy;
    
	vec2 dist = center-uv;
    if (mod(atan(dist.y,dist.x)+(sin(uv.x*100.0)*0.01)+iTime,0.3925) > 0.24) {
        fragColor = lineColor;
    } else {
        fragColor = backgroundColor;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}