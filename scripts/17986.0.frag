#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dist;
 
float4 PS_screen(float2 tex: TEXCOORD0): COLOR
{
    float4 color;
    color =  tex2D(screenSampler, tex);
    color += tex2D(screenSampler, tex + dist);
    color += tex2D(screenSampler, tex - dist);
    return color / 3;
}
 
technique ShowScreen
{
    pass P0
    {
        PixelShader  = compile ps_2_0 PS_screen();
    }
}