/*
 * Original shader from: https://www.shadertoy.com/view/llBXW1
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
vec2 func(float t)
{
    float w = t * 3.14159265 *2.0; 
    
    vec2 main = vec2(sin(w + iTime*0.8),cos(w*3.0));
    vec2 sec = vec2(sin(w *4.0),cos(w *4.0 + iTime*9.2)) * 0.2;
        
    return main+sec;
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    vec2 pos = uv * 3.0 - 1.5;

    const int count = 150;
    
    float g = 0.0;
    
    float rnd = rand(uv);

    for(int i = 0 ; i < count; ++i)
    {
        float f = float(i) / float(count) + rnd + iTime * 0.01;
        
        vec2 p = func(f);

        float dist = length((pos-p)*vec2(1.6,0.9)) * 20.0;

        float w = max(0.0, exp(-dist*dist)-0.01);
        
        g+=w;
    }
    
    
    
  	fragColor = vec4(0,g,0,1);
        
//	fragColor = vec4(uv,0.5+0.5*sin(iTime),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}