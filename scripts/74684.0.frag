/*
 * Original shader from: https://www.shadertoy.com/view/fd3GzX
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
#define NUM_PARTICLES 350.

vec2 Hash12(float t)
{
    float x = fract(sin(t * 674.3) * 453.2);
    float y = fract(sin(t * 2674.3) * 453.2);
    
    return vec2(x,y);
}
vec2 rotate(vec2 pos, float angle)
{
	float c = cos(angle);
    float s = sin(angle);
    
    return mat2(c,s,-s,c) * pos;

}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord-.5 * iResolution.xy)/iResolution.y;

    // Time varying pixel color
    vec3 col = vec3(0.0);
    
    for(float i = 0.; i < NUM_PARTICLES; i++)
    {
        vec2 dir= Hash12(i) - .5;
        float t = sin(iTime);
        float d = length(uv-dir * (t));
        
        float brightness = 0.0008;
        
        uv = rotate(uv, iTime * 0.005);
        

       // uv = abs(uv);
        // Particle layer 2
        vec2 dir2 = Hash12(i * i) - .5;
        float t2 = cos(iTime * 1.5);
        float d2 = length(uv-dir2 * (t2));
        
        
        vec2 dir3 = Hash12(i * i * i) - .5;
        float t3 = 4. * cos(iTime * 1.5) * sin(dir3.x);
        float d3 = length(uv-dir3 * (t3));
        
        vec2 dir4 = Hash12(i * i * sin(i)) - .5;
        float t4 = 2. * cos(iTime * 1.5) * cos(dir4.x);
        float d4 = length(uv-dir4 * (t4));
        
        
        
        
        
        col += vec3(brightness / d);
        col += vec3(brightness / d2) * vec3(1.0, 0.0, 0.0);
        col += vec3(brightness / d3) * vec3(0.0, 1.0, 0.0);
        col += vec3(brightness / d4) * vec3(0.0, 0.0, 1.0);
        
        
        
        
    
    }
  //  col = vec3(Hash12(12.).x);
    // Output to screen
    fragColor = vec4((col * .15) - .15,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}