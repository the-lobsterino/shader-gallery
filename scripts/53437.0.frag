#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    float pixelSeparation = 10.*min(mouse.x,1.-mouse.y);
    
    gl_FragColor -= 0.5;
    
    vec2 diagxy = mod(gl_FragCoord.x + vec2(gl_FragCoord.y, -gl_FragCoord.y), pixelSeparation);
    
    float grad = uv.y * (pixelSeparation);
    
    float diag = clamp(grad - min(diagxy.x, diagxy.y), 0.0, 1.0); 
    
    gl_FragColor = vec4(diag);
}

