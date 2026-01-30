/*
 * Original shader from: https://www.shadertoy.com/view/3t3fDn
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
#define NUM_PART 25.
#define NUM_EXP 5.
vec2 hash12(float seed){
    float x = fract(sin(seed*674.2)*463.2);
     float y = fract(sin((x+seed)*614.2)*263.2);
    return vec2(x,y);
}
vec2 hash12_polar(float seed){
    float a = fract(sin(seed*674.2)*463.2)*6.28;
     float d = 0.1 + fract(sin((a+seed)*714.2)*263.2);
    return vec2(sin(a),cos(a))*d;
}

float explosion(vec2 uv,float t){
float sparks = 0.;
 for(float i = 0. ;i<NUM_PART;i++){
        vec2 dir = hash12_polar(i+1.)*.5;
        float d = length(uv-dir*t);
        float brightness = mix(.0005,.002,smoothstep(.05,0.,t));
        brightness *= sin(t*20.+i)*.5+.5;
        brightness *= smoothstep(1.,.5 + (0.5-i/NUM_PART),t);
sparks += brightness/ d; 
    }
    return sparks;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (center is origin)
     vec2 uv = (fragCoord - .5 *iResolution.xy)/iResolution.y;

        // Time varying pixel color
    vec3 col =vec3(0);
    
    for(float i=0.;i<NUM_EXP;i++){
    float t = iTime + i/NUM_EXP;
        float ft = floor(iTime);
       vec3 color = sin(vec3(.34,.54,.43)*(ft)*i)*.25 + .75;
       vec2 offset = hash12(i+1.+ft)-.5;
       offset *= vec2(1.77,1.);
        col+=explosion(uv -offset,fract(t))*color;
    }


    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}