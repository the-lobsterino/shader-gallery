#ifdef GL_ES
precision mediump float;
#endif

// HLSL->GLSL syntax helpers
//
#define float2 vec2
#define float3 vec3
#define float4 vec4

// $ input
//
uniform float mouse;
uniform vec2 resolution;
uniform float time;

// $ constants
//
const vec3 COLOR_0 = vec3(255,240, 227) * vec3(.0039,.0039,.0039); // 5659 kelvin
const vec3 COLOR_1 = vec3(255,228, 205) * vec3(.0039,.0039,.0039); // 4977 kelvin
const float F_DENSITY = 0.85;
const float S_DENSITY = 0.17;

// macros
#define WORLD_UNIT 100.
#define toWorld(x) ((x)*WORLD_UNIT)


float scatterEval(float rl, float d)
{
    float ood = 1.0/d;
    return log(((exp(1.0 - rl)) * ood) + 1.0) * d;
}

vec3 filmicResponse(vec3 x)
{
    // filmic response curve on linear color x (Hejl/Dawson curve, presented by John Hable)
    x=max(vec3(0.0),vec3(x-0.004));
    x=(x*(6.2*x+0.5))/(x*(6.2*x+1.7)+0.06);
    return pow(x,vec3(2.2)); // sRGB out
}

// special cased rotations of 90 degrees (swizzle)
float3 RotateXAxis90(float3 p) { return (p.xzy); }
float3 RotateYAxis90(float3 p) { return (p.zyx); }
float3 RotateZAxis90(float3 p) { return (p.yxz); }


float lerp(float a, float b, float i)
{
    return ((a*(1.0-i)) + (b*i));
}

vec3 lerp(vec3 a, vec3 b, float i)
{
    return ((a*(1.0-i)) + (b*i));
}

float udSphere(float2 p, float s)
{
    return max(0.0,length(p.xy) - (s));
}

float capsule(float3 p, float r, float c)
{
   return lerp(max(0.0,length(p.x)-r), max(0.0,length(float3(p.x,abs(p.y)-c,p.z))-r), step(c,abs(p.y)));
}


float2 bankCapsule(float2 normCoord)
{
    float2 accum = float2(0.0);

    const int NUM_PRIM = 2;
    const float X_OFFSET = 7.0;
    const float Y_OFFSET = 21.0;

    // horizontal center the grid
    float2 posGridCtr = toWorld(normCoord) - float2((float((NUM_PRIM))*X_OFFSET*0.5),0.0);

    for (int i = 0; i < NUM_PRIM; i++)
    {
	float fIdx = float(i);		// lamp index
	float3 p0=float3(0.0);		// lamp position

	float even  = mod(fIdx,2.0);	// even / odd index

	// place lamp position on the grid
	//
	p0.x = posGridCtr.x + ((fIdx-even) * X_OFFSET);
        p0.y = posGridCtr.y + (even * Y_OFFSET);

	p0 = RotateZAxis90(p0);

	// distance from capsule
        float d = capsule(p0.xyz,4.6,20.0);
	d=max(1.0,d)*.55;

	// evaluate scatter term
        accum.x += scatterEval(d,F_DENSITY);
	accum.y += scatterEval(pow(d,.5),S_DENSITY);
    }
    return accum;
}

float2 bankSphere(float2 normCoord)
{
    float2 accum = float2(0.0);

    const int NUM_PRIM = 8;
    const float X_OFFSET = 7.0;
    const float Y_OFFSET = 15.0;

    // horizontal center the grid
    float2 posGridCtr = toWorld(normCoord) - float2((float((NUM_PRIM))*X_OFFSET*0.5),0.0);

    for (int i = 0; i < NUM_PRIM; i++)
    {
	float fIdx = float(i);		// lamp index
	float3 p0=float3(0.0);		// lamp position

	float even  = mod(fIdx,2.0);	// even / odd index

	// place lamp position on the grid
	//
	p0.x = posGridCtr.x + ((fIdx-even) * X_OFFSET);
        p0.y = posGridCtr.y + (even * Y_OFFSET);

	// distance from sphere
        float d = udSphere(p0.xy,3.2);

	// evaluate scatter term
        accum.x += scatterEval(d,F_DENSITY);
        accum.y += scatterEval(pow(d,.5),S_DENSITY);
    }
    return accum;
}


void main( void )
{
    float2 posGridCtr;

    float aspectRatio = resolution.y / resolution.x;

    float2 hC = gl_FragCoord.xy / resolution.xy;
    hC = (hC-vec2(0.5)) * aspectRatio * float2(2.0);
    float v = max(1.0-length(hC.xy),0.5);

    // homogeneous uv coords (GLSL provides pixel coords)
    float2 normCoord = ((gl_FragCoord.xy / resolution.xy)-float2(0.5)) * float2(2.0) * aspectRatio;

    float2 scatterEval;

    // capsule light bank
    scatterEval = bankCapsule(float2(normCoord.x,normCoord.y-.25));

    // sphere light bank
    scatterEval += bankSphere(float2(normCoord.x,normCoord.y+.2));

    vec3 vSum0 = scatterEval.x * COLOR_0;
    vec3 vSum1 = scatterEval.y * COLOR_1;
    vec3 vOutC = (vSum0 + vSum1)
	    ;
    const float kFilmicStrength = 0.3;
    vOutC = lerp(vOutC.rgb,filmicResponse(vOutC.rgb*2.0),kFilmicStrength);

    gl_FragColor = float4(vOutC,1.);
}

