#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iGlobalTime time
#define iResolution resolution

//https://www.shadertoy.com/view/XdByzm 

/*
coarse, approximative mapping from sine/cosine to trochoidal/gerstner wave 
red and green are the ground truth curves (normalized and unnormalized, respectively)
the white ones are the approximations

https://en.wikipedia.org/wiki/Trochoidal_wave
https://en.wikipedia.org/wiki/Trochoid
https://en.wikipedia.org/wiki/Cycloid
http://mathworld.wolfram.com/CurtateCycloid.html
*/

#define Time iGlobalTime

/*
#define float2 vec2
#define float3 vec3
#define float4 vec4

#define saturate(x) clamp(x, 0.0, 1.0)
#define frac fract
/**/

#define rsqrt inversesqrt
#define clamp(x) clamp(x, 0.0, 1.0)

const float Pi = 3.14159265359;

float InvLerp(float a, float b, float r) { return (a - r) / (a - b); }

float Pow4(float x)
{
    float x2 = x*x;
    
    return x2*x2;
}

float Root4(float x)
{
    return rsqrt(rsqrt(x));
}

float SinToGWave00(float x)
{
    return 1.0 - Root4(1.0 - x);
}

float SinToGWave0(float x, float s)
{
    float ss = 1.0 - Pow4(1.0 - s);
    
    return SinToGWave00(x * ss);
}

float SinToGWave0N(float x, float s)
{
    return SinToGWave0(x, s) / s;
}

float SinToGWave(float x, float s)
{
    return SinToGWave0(x * 0.5 + 0.5, s) * 2.0 - s;
}

float SinToGWaveN(float x, float s)
{
    return SinToGWave0(x * 0.5 + 0.5, s) / s * 2.0 - 1.0;
}

// inverse ground truth curve (can not be analytically inverted)
float InvGW(float y, float s)
{
    return acos(y/s) - sqrt(s*s - y*y);
}

float InvGW0(float y, float s)
{
    return InvGW((y * 2.0 - 1.0) * s, s) / Pi;
}
    

float Plot(float f, float y)
{
    float v = f - y;
    v /= length(vec2(dFdx(v), dFdy(v)));
    v = clamp(1.0 - abs(v));
    
    return v;
}

void mainImage( out vec4 fragColor, in vec2 uv )
{
    vec2 tex = uv / iResolution.xy;
    vec2 tex2 = tex * vec2(iResolution.x / iResolution.y, 1.0);
    
    float x = tex2.x;
    float xx1 = abs(mod(x - 1.0, 2.0) - 1.0);
    float xx2 = abs(mod(x + 1.5, 2.0) - 1.0);
    float y = tex2.y;
    
    vec3 col = vec3(0.0);
    float cos0 = cos((x - 1.5) * Pi);
    float cos1 = cos0/Pi*2.0 * 0.5 + 0.5;
    col = mix(col, vec3(0.05), Plot(0.5, y));
    col = mix(col, vec3(0.2), Plot(cos1, y));
    
    float s = 1.0;// amplitude scale of the curve; dictates the shape (s=1: cycloid | s=0: sine)
    s = mix(0.05, 0.95, sin(Time) * 0.5 + 0.5);

    float sp = 0.5 - 0.5 * s/Pi*2.0;// used for plotting the ground truth version

    // normalized to range [0..1]
    col = mix(col, vec3(1.0, 0.0, 0.0), Plot(InvGW0(y, s), xx1));// correct
    col = mix(col, vec3(1.0), Plot(SinToGWave0N(cos((x - 0.0) * Pi) * 0.5 + 0.5, s), y));// approx
    
    // unnormalized
    col = mix(col, vec3(0.0, 1.0, 0.0), Plot(InvGW0(InvLerp(sp, 1.0 - sp, y), s), xx2));// correct
    col = mix(col, vec3(1.0), Plot(SinToGWave(cos0, s)/Pi*2.0 * 0.5 + 0.5, y));// approx
   
    
    //col = vec3(v);
	//fragColor = vec4(tex2, 0.0,1.0);
    fragColor = vec4(pow(clamp(col), vec3(1.0/2.2)), 1.0);
}
void main( void ) {
	
	mainImage( gl_FragColor, gl_FragCoord.xy );

}