#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{  
	vec2 uv = fragCoord.xy / iResolution.xy; // 0 <> 1.
    
    //vec4 col = texture(iChannel0, uv);
    
    float d = length(uv);
    float c = d;
    
    fragColor = vec4(vec3(c), 1.0);
}