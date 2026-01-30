/*
 * Original shader from: https://www.shadertoy.com/view/4dVXWy
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time*3.0
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
const float pi = 3.1415;

 

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	float radius = 0.43;
	float lineWidth = 15.0; // in pixels
	float glowSize = 55.0; // in pixels
    
    float pixelSize = 1.0/min(iResolution.x, iResolution.y);
	lineWidth *= pixelSize;
	glowSize *= pixelSize;
    glowSize *= 2.0;
    
  	vec2 uv = (fragCoord.xy / iResolution.xy)-0.5;
    uv.x *= iResolution.x/iResolution.y;
    
    float len = length(uv);
	float angle = atan(uv.y, uv.x);
    
	float fallOff = fract(-0.5*(angle/pi)-iTime*0.5);
    
    lineWidth = (lineWidth-pixelSize)*0.5*fallOff;
	float color = smoothstep(pixelSize, 0.0, abs(radius - len) - lineWidth)*fallOff;
	color += smoothstep(glowSize*fallOff, 0.0, abs(radius - len) - lineWidth)*fallOff*0.5;    
    
	
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}