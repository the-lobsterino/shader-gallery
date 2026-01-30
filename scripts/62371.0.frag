/*
 * Original shader from: https://www.shadertoy.com/view/3slyR2
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
#define GammaValue 0.5
#define VignetteStrength 1.1
#define FocalLength 2.0

float smax(float a, float b)
{
    return log(exp(a) + exp(b));
}

mat3 rot_y(float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    
    return mat3(c, 0.0 , -s,
              0.0, 1.0, 0.0,
               s, 0.0, c);
}

float prism( vec3 pos )
{
    vec3 side1 = vec3(0.0, -1.0, 0.0);
    vec3 side2 = normalize(vec3(0.0, 1.0, 2.0));
    vec3 side3 = normalize(vec3(0.0, 1.0, -2.0));
    float r = 2.0;
    return smax(dot(pos, side1) - r, 
               smax(dot(pos, side2) - r, 
                   dot(pos, side3) - r));
}

float distModel( vec3 pos, float time )
{
    float r = length(pos.xz);
	return prism(rot_y(time + r * 0.3)*pos + (r - 5.0) * vec3(0.0, 0.4, 0.0));
}

float rayTrace( vec2 fragCoord, float time, float offset )
{
    vec2 position = fragCoord * -2.0 + 1.0;

    vec3 rayDir = normalize(vec3( position, FocalLength + offset));

    vec3 cameraPos = vec3( 0, 1.0, -20.0 );

    float angle = time * 0.1;
    vec3 normal = rot_y(-time) * vec3(cos(angle), sin(angle), 0.0);
    float scale = abs(dot(rayDir, normal));

    if(scale < 0.001)
    {
        return 0.0;
    }
    else
    {
        rayDir *=  1.0/scale;
        vec3 curPos = cameraPos;
        float fMinDist = 1000.0;
        float stepLen = length(rayDir);
        float totalIntensity = 0.0;
        for(int i = 1; i < 30; ++i)
        {
            curPos += rayDir;
            float fDistance = distModel( curPos, time );
            fMinDist = min( fMinDist, abs(fDistance));
            float intensity = smoothstep(.5, 0.05, abs(fDistance));
            intensity *= exp(-(float(i) * stepLen)/10.0);
            totalIntensity += intensity;
        }
        return totalIntensity;
    }
}

vec3 rtMain(in vec2 uv, in float time)
{
    return vec3(
        rayTrace(uv, time, 0.0),
        rayTrace(uv, time, 0.05),
        rayTrace(uv, time, 0.1));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float aspect = iResolution.y/iResolution.x;
    vec2 uv = (fragCoord/iResolution.xy - vec2(0.5)) * vec2(1.0, aspect) + vec2(0.5);
    // Time varying pixel color
    vec3 color = rtMain(uv, iTime * 0.3);

    //Gamma
    color.rgb = pow(color.rgb, vec3(GammaValue));

    //Saturate channels
    color.rgb = min(color.rgb, vec3(1.0));


    //Vignette
    color.rgb *= pow(1.0 - length(uv - vec2(0.5, 0.5)) * VignetteStrength, 0.5); 
    
    // Output to screen
    fragColor = vec4(color,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}