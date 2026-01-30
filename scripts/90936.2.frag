/*
 * Original shader from: https://www.shadertoy.com/view/Ntcyzr

UI - 2D SDF Radial Hue Picker 

*/
#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
#define iMouse mouse
// --------[ Original ShaderToy begins here ]---------- //
// Official HSV to RGB conversion 
vec3 hsv2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	return c.z * mix( vec3(1.0), rgb, c.y);
}

float opUnion( float d1, float d2 ) { return min(d1,d2); }
float opSubtraction( float d1, float d2 ) { return max(-d1,d2); }
float opIntersection( float d1, float d2 ) { return max(d1,d2); }

float sdCircle( in vec2 p, in float r )
{
    return length(p) - r;
}

float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

vec2 toPolar(vec2 cartesian)
{
    return vec2(length(cartesian), atan(cartesian.x, cartesian.y));
}

vec3 radialHueFromPoint(vec2 point)
{
    float theta = toPolar(point).y;
    float hue = theta / (2.0 * 3.14);
    vec3 col = vec3(hue, 1.0, 1.0);
    col = hsv2rgb(col);
    return col;
}


vec2 dir(vec2 from, vec2 to)
{
    return normalize(from - to);
}



vec3 hueColorFromOrginToMouse(vec2 origin, vec2 mouse)
{
    float radius = 0.4;
    float theta = toPolar(dir(mouse, origin) * radius).y;
    float hue = theta / (2.0 * 3.14);
    vec3 col = vec3(hue, 0.0, 0.0);
    //col = hsv2rgb(col);
    //col = vec3(1.0, 0.0, 0.0);
    return col;
}



vec3 colorSDFWithRadialHue(float sdf, vec2 radialOrigin, vec3 inputCol)
{
    vec3 col = inputCol;
    // sdf outline
    if (sdf < 0.0)
    {
        col = radialHueFromPoint(radialOrigin);
    }
    if (sdf > 0.0 && sdf < 0.01)
    {
        col = mix(inputCol, radialHueFromPoint(radialOrigin), 1.0-smoothstep(0.0, 0.01,abs(sdf)));
    }
    
    return col;
}

vec3 colorSDFHueFromMouse(float sdf, vec2 origin, vec2 mouse, vec3 inputCol)
{
    vec3 col = inputCol;
    
    if (sdf < 0.0)
    {
        col = hueColorFromOrginToMouse(origin, mouse);
    }
    if (sdf > 0.0 && sdf < 0.01)
    {
        col = mix(inputCol, hueColorFromOrginToMouse(origin, mouse), 1.0-smoothstep(0.0, 0.01,abs(sdf)));
    }
    
    return col;
}

float hueRingSDF(vec2 p, vec2 m, float roundness)
{
    float sdf = sdCircle(p, 0.4);
    sdf = opSubtraction(sdCircle(p, 0.35), sdf);
    return sdf;
}

float pickerLineSDF(vec2 origin, vec2 mouse, float roundness)
{
    float sdf = sdCircle(origin, 0.05);
    if (iMouse.x > 0.01) sdf = opUnion(sdSegment(origin, vec2(0), mouse), sdf);
    return sdf  - roundness;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{    
    vec2 uv = fragCoord/iResolution.xy;
    
    vec2 center = (2.0 * fragCoord-iResolution.xy)/iResolution.y;
    vec2 m = (2.0 * iMouse.xy-iResolution.xy)/iResolution.y;
    
    vec2 pickerPosition = center - vec2(0.0, 0.0);
    
    float hueRing = hueRingSDF(pickerPosition, m, 0.1);
    float picker = pickerLineSDF(pickerPosition, m, 0.1);
    
    vec3 background = vec3(0.3, 0.3, 0.3);
    vec3 col = colorSDFWithRadialHue(hueRing, pickerPosition, background);
    col = colorSDFHueFromMouse(picker, pickerPosition, m, col);
    
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}