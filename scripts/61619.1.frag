/*
 * Original shader from: https://www.shadertoy.com/view/MdsSDM
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
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
	float rurka = sin(uv.x*32.0-tan(uv.y*4.0+sin(iTime+uv.x*6.0-sin(iTime)*4.0)-2.0)*12.0+iTime*10.0);
	float shadey = -abs(tan(uv.y*4.0+sin(iTime+uv.x*6.0-sin(iTime)*4.0)-0.5));
	
	float komplet = rurka-cos(uv.x*125.0+iTime*32.0);
	float ouch = clamp((shadey+3.0)/3.0,0.0,1.0)*2.0;

	fragColor = vec4(komplet-ouch,abs(komplet*0.5)-ouch,0.1-komplet*1.0-ouch,komplet);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;
}