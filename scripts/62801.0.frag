/*
 * Original shader from: https://www.shadertoy.com/view/XtjGRh
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
// UK Eclipse - @P_Malin

// There was a solar eclipse today. This is what it looked like to me from the northwest of England (cloudy).

const vec3 sunCol = vec3(1.0, 0.9, 0.66);
vec3 cloudColA = vec3(0.32, 0.4, 0.6);
vec3 cloudColB = vec3(0.6, 0.4, 0.5);
vec3 cloudColC = vec3(0.54, 0.53, 0.46);

float kExposure = 1.7;

vec3 sunLight = sunCol.rgb * 10000.0;

float Hash(float p)
{
	vec2 p2 = fract(vec2(p * 5.3983, p * 5.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
	return fract(p2.x * p2.y * 95.4337);
}

float Hash2D(vec2 p)
{
	return Hash( dot( p, vec2(1.0, 41.0) ) );	
}

float Noise2D( vec2 p )
{
	vec2 fl = floor(p);

	float h00 = Hash2D( fl + vec2(0.0, 0.0) );
	float h10 = Hash2D( fl + vec2(1.0, 0.0) );
	float h01 = Hash2D( fl + vec2(0.0, 1.0) );
	float h11 = Hash2D( fl + vec2(1.0, 1.0) );
	
	vec2 fr = p - fl;
	
	vec2 fr2 = fr * fr;
	vec2 fr3 = fr2 * fr;
	
	vec2 t1 = 3.0 * fr2 - 2.0 * fr3;	
	vec2 t0 = 1.0 - t1;
	
	return h00 * t0.x * t0.y
		 + h10 * t1.x * t0.y
		 + h01 * t0.x * t1.y
		 + h11 * t1.x * t1.y;
}

float Crescent( const in vec2 uv )
{    
    float r= 0.15;
    float offset = 0.02;
    float d1 = distance( uv, vec2(0.5, 0.5)) / r - 0.5;
    float d2 = distance( uv, vec2(0.5 + offset, 0.51)) / r - 0.5;
    
    float d = min( -d1, d2 ) * 0.03;
    
    return clamp(d, 0.0, 1.0);
}

float Glow( const in vec2 uv )
{
    float glow_dist = distance( uv, vec2(0.46, 0.45)) - 0.2;
    float glow = exp2(glow_dist * -3.5) * 0.001;
    glow += exp2(glow_dist * -7.0) * 0.0002;
    return glow;    
}

float Cloud( const in vec2 uv )
{
	float s = 0.0;
    float a = 1.0, t = 0.0;
    vec2 p = uv;
    p = p * 2.5;
    for(int i=0;i<5;i++)
    {
        s += Noise2D(p) * a;
        t += a;
        p *= 2.0;
        a *= 0.5;
        
        p.x += iTime * 0.05;
    }
    s = s / t;    
    return s;
}

////////////////

vec3 ApplyVignetting( const in vec2 vUV, const in vec3 vInput )
{
	vec2 vOffset = (vUV - 0.5) * sqrt(2.0);
	
	float fDist = dot(vOffset, vOffset);
	
	const float kStrength = 1.0;
	const float kPower = 0.2;

	return vInput * ((1.0 - kStrength) +  kStrength * pow(1.0 - fDist, kPower));
}

vec3 ApplyTonemap( const in vec3 vLinear )
{    
    if(iTime < 2.0)
    {
        kExposure *= iTime / 2.0;
    }
    
    kExposure *= 0.5;
    	
	return 1.0 - exp2(vLinear * -kExposure);	
}

vec3 ApplyGamma( const in vec3 vLinear )
{
	const float kGamma = 2.2;

	return pow(vLinear, vec3(1.0/kGamma));	
}

vec3 ApplyBlackLevel( const in vec3 vColour )
{
    float fBlackLevel = 0.1;
    return vColour / (1.0 - fBlackLevel) - fBlackLevel;
}

vec3 ApplyPostFX( const in vec2 vUV, const in vec3 vInput )
{
	vec3 vTemp = ApplyVignetting( vUV, vInput );	
	
	vTemp = ApplyTonemap(vTemp);
	
	vTemp = ApplyGamma(vTemp);		
    
    vTemp = ApplyBlackLevel(vTemp);
    
    return vTemp;
}

////////////////

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{    
    vec2 uv = fragCoord.xy / iResolution.xy;
    float ratio = iResolution.x / iResolution.y;     
    vec2 bodyUV = (uv - 0.5) * vec2(ratio, 1.0) + 0.5;

    bodyUV -= 0.1; // offset the sun
	
    float cloudAmount = Cloud(uv * vec2(1.0, 1.75));
            
    float glow = Glow(bodyUV);
    vec3 glowCol = glow * sunLight;

    vec3 col = Crescent(bodyUV) * sunLight;

    vec3 cloudCol = mix(cloudColA.rgb, mix(cloudColB.rgb, cloudColC.rgb, uv.y), cloudAmount);
    cloudCol = cloudCol * cloudCol;
    cloudCol += glowCol * (1.0 - cloudAmount * 0.5) * 0.25;
	col = mix(col, cloudCol, cloudAmount);
    
    col = ApplyPostFX( uv, col );
    fragColor = vec4(col, 1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}