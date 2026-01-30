/*
 * Original shader from: https://www.shadertoy.com/view/3lffD8
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
#define CAMERA_DISTANCE 5.0
#define CAMERA_HEIGHT 3.0
#define PI 3.14159265359

float hash1( float n )
{
    return fract( n*17.0*fract( n*0.3183099 ) );
}

float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 w = fract(x);
    
    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    
    float n = p.x + 317.0*p.y + 157.0*p.z;
    
    float a = hash1(n+0.0);
    float b = hash1(n+1.0);
    float c = hash1(n+317.0);
    float d = hash1(n+318.0);
    float e = hash1(n+157.0);
	float f = hash1(n+158.0);
    float g = hash1(n+474.0);
    float h = hash1(n+475.0);

    float k0 =   a;
    float k1 =   b - a;
    float k2 =   c - a;
    float k3 =   e - a;
    float k4 =   a - b - c + d;
    float k5 =   a - c - e + g;
    float k6 =   a - b - e + f;
    float k7 = - a + b + c - d + e - f - g + h;

    return -1.0+2.0*(k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z);
}

float fbm(vec3 p, int octaves)
{
    float noiseSum = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++)
    {
        noiseSum += abs(noise(p*frequency)*amplitude);
        frequency*=2.0;
        amplitude*=0.5;
    }
    
    return 1.0 - noiseSum;
}


struct Ray
{
    vec3 Origin;
    vec3 Direction;
    vec3 Energy;
};

struct RayHit
{
  vec3 Position;
  float Distance;
  float FarDistance;
  vec3 Normal;
  vec2 uv;
  int MaterialId;
};
    
mat2 Rot(float a) 
{
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}  
    
vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z)
{
    vec3 f = normalize(l-p),
    r = normalize(cross(vec3(0,1,0), f)),
    u = cross(f,r),
    c = p+f*z,
    i = c + uv.x*r + uv.y*u,
    d = normalize(i-p);
    return d;
}

Ray CreateRay(vec3 ro, vec3 rd)
{
    Ray ray;
    ray.Origin = ro;
    ray.Direction = rd;
    ray.Energy = vec3(1.0);
    return ray;
}

RayHit CreateRayHit()
{
    RayHit hit;
    hit.Position = vec3(0.0);
    hit.Distance = -1.;
    hit.FarDistance = -1.;
    hit.Normal = vec3(0.0);
    hit.uv = vec2(0.0);
    return hit;
}
    
void IntersectSphere(Ray ray, inout RayHit hit, vec4 sphere)
{
    //get the vector from the center of this circle to where the ray begins.
	vec3 m = ray.Origin - sphere.xyz;

    //get the dot product of the above vector and the ray's vector
	float b = dot(m, ray.Direction);

	float c = dot(m, m) - sphere.w * sphere.w;

	//exit if r's origin outside s (c > 0) and r pointing away from s (b > 0)
	if(c > 0.0 && b > 0.0)
		return;

	//calculate discriminant
	float discr = b * b - c;

	//a negative discriminant corresponds to ray missing sphere
	if(discr < 0.0)
		return;

	//ray now found to intersect sphere, compute smallest t value of intersection
	float normalMultiplier = 1.0;
	float collisionTime = -b - sqrt(discr);
    
    hit.FarDistance = -b + sqrt(discr);
    if (collisionTime < 0.0)
    {
        collisionTime = -b + sqrt(discr);
        normalMultiplier = -1.0;
    }    

    //Check if the hitted point is closer to the camera
    if (collisionTime < hit.Distance || hit.Distance == -1.0)
    {
        // return the time t that the collision happened, as well as the surface normal
    	vec3 p = ray.Origin + ray.Direction * collisionTime;
        // calculate the normal, flipping it if we hit the inside of the sphere
    	vec3 normal = normalize((ray.Origin+ray.Direction*collisionTime) - sphere.xyz) * normalMultiplier;
        
        hit.Distance = collisionTime;
        hit.Position = p;
        hit.Normal = normal;
        
        //Calculate uv coordinates at hit point
        vec3 d = normalize(p - sphere.xyz);
        float u = 0.5 + atan(d.z, d.x)/ 2.0*PI;
        float v = 0.5 - asin(d.y)/PI;
        hit.uv = vec2(u,v);
        
        hit.MaterialId = 1;
    }    
}

#define LIGHT_DIR vec3(0.8, 0.2, 1.0)
#define DENSITY_THRESHOLD 0.6
#define DENSITY_MULTIPLIER 2.0
#define STEPS_NUM 100.0

Ray CreateCameraRay(vec2 uv)
{
	vec2 m = iMouse.xy/iResolution.xy;
    
    vec3 ro = vec3(0, CAMERA_HEIGHT, -CAMERA_DISTANCE);
    ro.yz *= Rot(-m.y*3.14+1.);
    ro.xz *= Rot(-m.x*6.2831);
    
    vec3 rd = GetRayDir(uv, ro, vec3(0), 1.);
    
    return CreateRay(ro, rd);
}

RayHit Trace(Ray ray)
{
    RayHit hit = CreateRayHit();
    IntersectSphere(ray, hit, vec4(vec3(0.0, 0.0, 0.0), 5.0));
    return hit;
}

float SampleDensity(vec3 pos)
{
   float n = fbm((pos * 0.5 + iTime * 0.5) + vec3(1.0, 3.0, 3.0), 4);
   float density = max(0.0, n - DENSITY_THRESHOLD) * DENSITY_MULTIPLIER;
   return density;
}

vec3 Shade(RayHit hit)
{
    vec3 LightDir = normalize(LIGHT_DIR);
    
    float dif = clamp(dot(hit.Normal, LightDir), 0.0, 1.0);
    
    return 0.1 + vec3(0.7) * dif;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Coordinates from -1 to 1
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;

    vec3 col = vec3(0.0);
    
    Ray ray = CreateCameraRay(uv);
    
    RayHit hit = Trace(ray);
    
    float CloseDst = hit.Distance;
    float FarDst = hit.FarDistance;
    
    float TravelledDst = 0.0;
    float StepSize = FarDst / STEPS_NUM;
    float dstLimit = FarDst;
    
    float TotalDensity = 0.0;

    if (hit.Distance > 0.0)
    {
        col = vec3(0.7);
    }
    
    for (int i = 0; i < 100; ++i)
    {
        if (TravelledDst >= dstLimit) break;
        vec3 rayPos = ray.Origin + normalize(ray.Direction) * (CloseDst + TravelledDst);
        TotalDensity += SampleDensity(rayPos) * StepSize;
        TravelledDst += StepSize;
    }
    
    float transmitance = exp(-TotalDensity);
    
    //col = vec3(1.0 - cellular(vec3(uv.x, uv.y, 0.0)*3.0).x * 2.0);

    // Output to screen
    fragColor = vec4(col * (1.0 - transmitance) ,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}