/*
 * Original shader from: https://www.shadertoy.com/view/lsjBRD
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
// simple noise from: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand(float n){return fract(sin(n) * 43758.5453123);}
float noise(float p){
	float fl = floor(p);
  	float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = (2. * fragCoord - iResolution.xy) / iResolution.y;
    uv.x += 0.2 * sin(iTime + uv.y * 4.);
    float numLines = 15. + fragCoord.y * 0.4;
    float colNoise = noise(0.6 * uv.x * numLines);
    float colStripes = 0.5 + 0.5 * sin(uv.x * numLines * 0.75);
    float col = mix(colNoise, colStripes, 0.5 + 0.5 * sin(iTime));
    float aA = 1./(iResolution.x * 0.005) ;
    col = smoothstep(0.5 - aA, 0.5 + aA, col);
	fragColor = vec4(vec3(col),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}