#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


//MODS BY 27 
//RESOLUTION WORKS PROPERLY NOW

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{

    vec2 aspect = resolution.xy / resolution.y;
    vec2 uv = ( gl_FragCoord.xy / resolution.y ) - aspect / 2.0;
     uv.y += 0.5;
	
    float pixelSeparation = 27.0;
    
    vec2 diagxy = mod(270.* (uv.x + vec2(uv.y, -uv.y)), pixelSeparation);
    
    float grad = uv.y * (pixelSeparation);
    
    float diag = clamp(grad - max(diagxy.x, diagxy.y), 0.0, 1.0); 
    
    gl_FragColor = vec4(diag);
}

