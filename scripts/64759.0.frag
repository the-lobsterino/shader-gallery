/*
 * Original shader from: https://www.shadertoy.com/view/wdcSzn
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
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
	vec3 col = vec3(0.);
    vec2 p = vec2(0.);
    //uv = floor(uv*120.)/120.;
    //float steps = abs(sin(iTime*0.1)*16.)+4.;
    float steps = 32. + sin(iTime*0.1)*31.;
    //float steps = 64.;
    float s = iTime*01.25;
    for (float i=0.;i<64.;i++) {
        if (i>=steps) break;
        float ii = i*02.102/steps;
        p = vec2(sin(s+ii),cos(s+ii))*(0.3+sin((s+ii)*8.)*0.1);
        ii = ii*ii*15.;
        //ii += 40.;
        //ii = ii*20.;
        //ii = (steps*3.)-ii;
        vec2 pv = floor(uv*ii)/ii;
    	if (length(pv+p) < 0.1*(i/steps)) {
            col = vec3(i/(steps-1.));
            col = col*col*col;
        	//col = vec3((i/steps)+(.025));
        }
    }
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}