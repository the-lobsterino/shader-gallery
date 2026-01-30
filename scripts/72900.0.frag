/*
 * Original shader from: https://www.shadertoy.com/view/fs2SDm
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
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// Author: Knose1
// Title: Pixel Circle loading with trail

float clamp01(float v) {return clamp(v, 0.0, 1.0);}
vec2 clamp01(vec2 v) {return clamp(v, 0.0, 1.0);}
vec3 clamp01(vec3 v) {return clamp(v, 0.0, 1.0);}

float cross(vec2 a, vec2 b) 
{
    return (a.x*b.y) - (a.y*b.x);
} 

float Lenght(vec2 a) {
    return sqrt(dot(a, a));
}

float Lerp(float a, float b, float t) 
{
    return (1.0 - t) * a + b * t;
}

float InvLerp(float a, float b, float v) 
{
    return (v - a) / (b - a);
}

float AngleBetween(vec2 a, vec2 b) 
{
    float lenghtA = Lenght(a);
    float lenghtB = Lenght(b);
    float toTest = dot(a,b) / (lenghtA*lenghtB);
    return acos(toTest);
}

float SignedAngleBetween(vec2 a, vec2 b) 
{
    float angle = AngleBetween(a,b);
    float myCross = cross(a,b);
    return angle * sign(myCross);
}

//CONST
const float PI = 3.14159265359;

//PARAMETERS
const float p_pxCount = 50.0;
const float p_loopDuration = 0.1;
const float p_radius = 0.2;
const float p_threshold = 0.04;
const float p_angleThreshold = PI*1.0;
const float p_circleSize = 0.05;

//MAIN
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    
    float minResolution = min(iResolution.x, iResolution.y);                //To avoid stretch
    
    //=================================================== UV and pixelated looking ===================================================//
    vec2 st = fragCoord.xy/minResolution;								    //Get the UV
    st = floor(st * p_pxCount) / p_pxCount;									//Give a pixelated look (the look result will be called "bigPixels" in the next comments)

    vec2 mouse = iMouse.xy == vec2(0) ?  vec2(1.,.5) : iMouse.xy/minResolution;	//Get the mouse UV (Thanks byt3_m3chanic for initial position's part)
    
    mouse -= 0.5/p_pxCount;													//Offset the mouse so it's well snaped on the bigPixels
    
    float angle = mod(iTime / p_loopDuration, PI*2.0);						//Get a radiant angle by time (NOTE : All the comments use degres for comprehention)
    
    vec2 localCircle = vec2(cos(angle), sin(angle)) * p_radius;				//Get a local circle position using our angle (cos(angle), sin(angle)) * radius
    vec2 fromTo = st - mouse;												//Get the pixel position local to the mouse
    
    //============================================= Make a ring around the mouse cursor =============================================//
    float sqrtdistPos = Lenght(fromTo);										//Get the distance between the pixel and the mouse position
    float sqrtdistCircle = Lenght(localCircle);								//Get the distance between the circle position and the mouse position
    float dist = abs(sqrtdistCircle - sqrtdistPos);							//Get the distance between the two floats
    dist = dist / p_threshold;												//Get a ratio so that 1 means p_threshold's value
    dist = clamp01(dist);													//Clamp the value
    
    //=================================================== Make an angular gradient ===================================================//
    float angleDistance = SignedAngleBetween(fromTo, localCircle) + PI*2.0; //Get an angle [-180, 180]. Offset it by 180 deg [0, 360]
    angleDistance = mod(angleDistance, PI*2.0); 							//Remove the 180 offset (so that the 0 in [-180, 180] system is 0 in [0, 360] system)
    angleDistance = angleDistance / p_angleThreshold;						//Get a ratio so that 1 means p_angleThreshold's value
    angleDistance = clamp01(angleDistance);									//Clamp the result
    if (angleDistance == 0.0) angleDistance = 1.0;							//If it's 1 it means that the angle is negative
    
    //================================================== Create a point on a circle ==================================================//
    float point = distance(fromTo, localCircle)/p_circleSize;				//Create a point around the circle position and resize it
    point = clamp(point, 0.0, 1.0);											//Clamp the result
    
    float masked = (dist+angleDistance);									//The variable dist returns a ring. We mask this ring using our angular gradient (angleDistance).
    masked = clamp01(masked);												//Then clamp and then TADA ! We've got our trail.
    vec3 color = clamp01(vec3(min(masked, point)));							//We mix our trail and our point using the min value. And then we clamp.
	fragColor = vec4(color,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}