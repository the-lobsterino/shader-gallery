/*
 * Original shader from: https://www.shadertoy.com/view/3tlGRr
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
#define SIZE 15.0 
#define HPI 1.5707963 
#define COL1 vec3(32, 43, 51) / 255.0 
#define COL2 vec3(235, 241, 245) / 255.0 
 
void mainImage(out vec4 fragColor, in vec2 fragCoord)
 { 
    vec2 uv = (fragCoord.xy - iResolution.xy * 0.5) / iResolution.y;
    float hsm = 0.5 +1.5 / iResolution.y * SIZE * 0.5; // Half-Smooth factor
        
    uv *= SIZE; // Make grid
    vec2 id = floor(uv);
    uv = fract(uv) - 0.5;
    
    // Golfed Rotation https://www.shadertoy.com/view/XlsyWX
    mat2 rot = mat2(cos(iTime + vec4(0,33,11,0))); // Prepare rotation matrix    
    
    float phase = mod(floor(iTime / HPI), 2.0); // Determine what phase is right now
    
    float mask = 0.0;
    for(float y =- 1.0; y <= 1.0; y++ )   // Loop to draw neighbour cells
    {    for(float x =- 1.0; x <= 1.0; x++ ) 
	{
            vec2 ruv = uv + vec2(x, y) * rot;
            vec2 rid =  id + vec2(x, y);
            vec2 maskXY = smoothstep(hsm, 1.0 - hsm, abs(ruv));            
            vec2 idm = mod(rid, 2.0);
            float draw = abs(idm.x*idm.y + (1.-idm.x)*(1.-idm.y) - phase); // Flip depending on phase            
            mask += maskXY.x*maskXY.y * draw;
        }
    }
    vec3 col = vec3(1.0);
    col = mix(COL1, COL2, abs(mask - phase)); // Color flip depending on phase
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}