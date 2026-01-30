// by Mr Gravis from shadertoy; Gigatron for glslsandbox
#ifdef GL_ES
precision highp float;
#endif
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float iGlobalTime=time;
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float amp = 8.0;
    float freq = 2.0; //* abs(sin(iGlobalTime));
    float slide = 1.0 - iGlobalTime * 0.2;
    float xx = 1.0 - abs((fragCoord.y / resolution.x - .3) * amp - sin((fragCoord.x / resolution.x - slide) * freq));
    float xz = 1.0 - abs((fragCoord.y / resolution.x - .3) * amp - sin((fragCoord.x / resolution.x - 1.0 - slide * -.5) * freq));
    float xr = 1.0 - abs((fragCoord.y / resolution.x - .3) * amp - sin((fragCoord.x / resolution.x - 2.4 - slide * 1.9) * freq));
	fragColor.b = xz;
    fragColor.r = xx;
    fragColor.g = xr;
}
void main( void ){vec4 color = vec4(0.0,0.0,0.0,1.0);mainImage( color, gl_FragCoord.xy );color.w = 1.0;gl_FragColor = color;}