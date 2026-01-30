/*By Xor
Shader tutorial on converting GLSL Sandbox shaders to GameMaker: Studio: http://xorshaders.weebly.com/tutorials/converting-glslsandbox-shaders
*/
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_vTextureCoord;
//varying vec4 v_vColour;

uniform float in_Time;
uniform float in_PatternRand;
uniform float in_DistortType;

float TW = 256.0;
float TH = 256.0;
float M_PI = 3.1415926535897932384626433832795;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()
{
    // Background distortion: https://secure.fangamer.com/forum/General/Tech/Help-with-allegro-and-c
    
    // Parameters
    float A = 16.0; // amplitude
    float F = 0.1;  // frequency
    float S = 0.1;  // time scaling
    float C = 1.0;  // compression - only used with vertical distortion
    
    float t = in_Time*16.0;
    float y = v_vTextureCoord.y*TH;

    // Calculate offset
    float offset = A * sin(F * y + S * t);
    
    // Apply offset
    vec2 texCoord = vec2(v_vTextureCoord);
    
    if (in_DistortType == 0.0) {
        texCoord.x = mod(texCoord.x + offset/TH, 1.0);
    } else if (in_DistortType == 1.0) {
        if (mod(y, 2.0) >= 1.0) {
            texCoord.x = mod(texCoord.x - offset/TH, 1.0);
        } else {
            texCoord.x = mod(texCoord.x + offset/TH, 1.0);
        }
    } else {
        texCoord.y = mod(texCoord.y * C + offset/TH + 1.0, 1.0);
    }
    
    // Apply perspective
    texCoord.x = mod(texCoord.x + v_vTextureCoord.y, 1.0);
    
    // Calculate colour
    //vec4 colour = v_vcolor * texture2D(gm_BaseTexture, texCoord);
    
    // Darken colours
    //colour.r *= 0.5;
    //colour.g *= 0.5;
    //colour.b *= 0.5;
    
    // Random hue shift
    //vec3 hsv = rgb2hsv(colour.rgb);
    //hsv.x = mod(hsv.x + in_PatternRand +
    //            sin(in_PatternRand + texCoord.x*M_PI*2.0)/32.0 +
    //            sin(in_PatternRand + texCoord.y*M_PI*2.0)/32.0, 1.0);
    //colour.rgb = hsv2rgb(hsv);
    
    // Done
    //gl_FragColor = colour;
}