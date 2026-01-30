/*
 * Original shader from: https://www.shadertoy.com/view/3tsXWH
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

// Emulate a black texture
#define texture(s, uv) vec4(0.0)
#define textureLod(s, uv, lod) vec4(0.0)
#define texelFetch(s, uv, lod) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
// IF YOU GET A BLACK SCREEN YOU WILL NEED TO DISABLE MUSIC TO SEE ANYTHING ///////
// THE AUDIO DOESNT SEEM TO LOAD PROPERLY ON SOME MACHINES, DONT KNOW WHY /////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//#define MUSIC 

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
// IF YOU GET A BLACK SCREEN YOU WILL NEED TO DISABLE MUSIC TO SEE ANYTHING ///////
// THE AUDIO DOESNT SEEM TO LOAD PROPERLY ON SOME MACHINES, DONT KNOW WHY /////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

#define NO_INTERSECTION 100000.0
//#define AMBIENT 0.05
#define EPSILON 0.0001
#define TEXTURESCALE 0.125/4.0
#define SPECULAR_POWER 25.0
#define SPECULAR_AMOUNT 1.0
#define MSAA 1.0
#define ITERATIONS 3
#define HURRY_UP 1.5
#define LIGHT_ZBIAS 0.0

#define VOLUME_STEP 0.1	//// SET THIS TO 0.3 OR HIGHER FOR BETTER PERFORMANCE /////

///////////////////////////////////////////////////////////////////////////////////

#define DISCO_LIGHTS
#define LIGHT_COLOUR_CHANGE
//#define MODULATE_PLANE_REFLECTANCE
#define VOLUMETRIC_LIGHTING
#define ROTATION
//#define CHECKER_PULSE
#define ALTERNATIVE_MASK

///////////////////////////////////////////////////////////////////////////////////

float AMBIENT=0.0;

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct Sphere {
    vec3 origin;
    float radius;
    vec3 colour;
    float reflectiveness;
    float stripe;
    mat3 mat;
};

struct Plane {
    vec3 origin;
    vec3 normal;
    vec3 binormal;
    vec3 binormal2;
    float reflectiveness;
};
    
struct Light {
    vec3 pos;
    vec3 colour;
};
    
struct Result {
    vec3 pos;
    vec3 normal;
    float t0,t1;
    vec3 colour;
    float reflectiveness;
};

///////////////////////////////////////////////////////////////////////////////////

const int g_numlights=3;
Light g_lights[g_numlights];

const int g_numplanes=1;
Plane g_planes[g_numplanes];

const int g_maxspheres=8;

const int g_numspheres=4;

Sphere g_spheres[g_maxspheres];
vec3 g_sphererotspeeds[g_maxspheres];

bool music=false;

///////////////////////////////////////////////////////////////////////////////////
    
float blerp(float x, float y0, float y1, float y2, float y3) {
	float a = y3 - y2 - y0 + y1;
	float b = y0 - y1 - a;
	float c = y2 - y0;
	float d = y1;
	return a * x * x * x + b * x * x + c * x + d;
}

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float perlin(float x, float h) {
	float a = floor(x);
	return blerp(mod(x, 1.0),
		rand(vec2(a-1.0, h)), rand(vec2(a-0.0, h)),
		rand(vec2(a+1.0, h)), rand(vec2(a+2.0, h)));
}

///////////////////////////////////////////////////////////////////////////////////

mat3 rotationmatrix(vec3 a)
{
    float cp=cos(a.x);
    float sp=sin(a.x);
    float cy=cos(a.y);
    float sy=sin(a.y);
    float cr=cos(a.z);
    float sr=sin(a.z);
    mat3 pitch = mat3(1, 0, 0, 0, cp, sp, 0, -sp, cp);
    mat3 yaw = mat3(cy, 0, -sy, 0, 1, 0, sy, 0, cy);
	mat3 roll = mat3(cr, sr, 0, -sr, cr, 0, 0, 0, 1);
    mat3 rotation = pitch*yaw*roll;    
    return roll;
}

///////////////////////////////////////////////////////////////////////////////////
// returns intersection points in order of increasing t

Result hit_sphere(Ray ray, Sphere sphere)
{
    Result result = Result(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), NO_INTERSECTION, NO_INTERSECTION, sphere.colour, sphere.reflectiveness);
    vec3 oc = ray.origin - sphere.origin;
    float a = dot(ray.direction, ray.direction);
    float b = 2.0 * dot(oc, ray.direction);
    float c = dot(oc,oc) - sphere.radius*sphere.radius;
    float discriminant = b*b - 4.0*a*c;
    if(discriminant < 0.0){
        return result;
    }
    else{
        float sqrtdsc = sqrt(discriminant);
		float t1 = (-b - sqrtdsc) / (2.0 * a);
		float t2 = (-b + sqrtdsc) / (2.0 * a);   
        // t2 must be greater than t1
        if (t2 <= 0.0) 
        {	//neither can be > 0
            return result;	
        }
        else if (t1>0.0)
        {	// both must be > 0
            result.t0=t1;
            result.t1=t2;
        }
        else
        {	// only t2 is > 0
            result.t0=t2;
        }
                    
        result.pos = ray.origin + (ray.direction*result.t0);
        result.normal = result.pos - sphere.origin;
        result.normal = normalize(result.normal);
        return result;      
	}
}

///////////////////////////////////////////////////////////////////////////////////

#ifdef ALTERNATIVE_MASK
    bool classifynormal(vec3 normal, float stripeyness, mat3 rot)
    {
    #ifdef ROTATION    
        normal = rot*normal;
    #endif //ROTATION    
        float val = normal.y * (normal.x + normal.z);
        val = val * stripeyness * 0.5;
        val -= floor(val);

        if (val>0.5)
            return true;
        else
            return false;
    }
#else
    bool classifynormal(vec3 normal, float stripeyness, mat3 rot)
    {
    #ifdef ROTATION    
        normal = rot*normal;
    #endif //ROTATION    

        float maxcomponent = max(abs(normal.x), abs(normal.y));
        maxcomponent = max(maxcomponent, abs(normal.z));

        maxcomponent = maxcomponent * stripeyness;
        maxcomponent -= floor(maxcomponent);

        if (maxcomponent>0.5)
            return true;
        else
            return false;
    }
#endif //ALTERNATIVE_MASK

///////////////////////////////////////////////////////////////////////////////////

Result hit_object(Ray ray, Sphere sphere)
{
    Result result = hit_sphere(ray, sphere);
        
    if (classifynormal(result.normal, sphere.stripe, sphere.mat))
    {
    	return result;
    }
    else
    {
    	result.t0 = result.t1;
        result.pos = ray.origin + ray.direction*result.t0;
        result.normal = -normalize(result.pos - sphere.origin);
	    if (classifynormal(result.normal, sphere.stripe, sphere.mat))
        {
        	return result;
        }
        else
        {
            result.t0 = NO_INTERSECTION;
        	return result;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////
// calcs the intersection with 2 opposite planes in a single test

Result hit_plane(Ray ray, Plane plane) 
{
    Result result = Result(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), NO_INTERSECTION, NO_INTERSECTION, vec3(1.0, 1.0, 1.0), plane.reflectiveness);
        
    if (dot(plane.normal, ray.direction) > 0.0) 
    {	// no intersection with the regular plane, check the 'flipped' plane instead
        plane.normal = -plane.normal;
        plane.origin = -plane.origin;
    }

    float t = (dot(plane.normal, plane.origin) - dot(plane.normal, ray.origin)) / dot(plane.normal, ray.direction);
    if (t<0.0)
    {
    	return result;    
    }
    
    vec3 inter = ray.origin + ray.direction*t;    
    result.t0 = t;
    result.t1 = t;
    result.pos = inter;
    result.normal = plane.normal;
    
    // sample the texture in the returned colour
    vec2 tex;
    tex.x = dot((result.pos - plane.origin), plane.binormal)*TEXTURESCALE;
    tex.y = dot((result.pos - plane.origin), plane.binormal2)*TEXTURESCALE;
    result.colour = texture(iChannel0, tex).xyz * texture(iChannel0, tex).xyz;	// make it mor 'gaudy' ;-)
    
#ifdef CHECKER_PULSE    
    tex.x = tex.x-floor(tex.x);
    tex.y = tex.y-floor(tex.y);
    tex.x-=0.2;
    tex.y-=0.2;
    if ((tex.x*tex.y) >= 0.0)
        result.reflectiveness*=0.5;
#endif //CHECKER_PULSE    
    
    return result;
}

///////////////////////////////////////////////////////////////////////////////////
// ray-world query, returning intersection point, normal, surface colour

Result raycast(Ray ray)
{
    Result bestresult = Result(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), NO_INTERSECTION, NO_INTERSECTION, vec3(1.0, 1.0, 1.0), 0.0);    
    
    for (int i=0; i<g_numspheres; i++)
    {
        Result res = hit_object(ray, g_spheres[i]);    
        if (res.t0 < bestresult.t0)
            bestresult=res;    
    }
    for (int i=0; i<g_numplanes; i++)
    {
    	Result res = hit_plane(ray, g_planes[i]);    
        if (res.t0 < bestresult.t0)
            bestresult=res;    
    }
    return bestresult;
}

///////////////////////////////////////////////////////////////////////////////////
// returns the RGB lighting at a given point

vec3 lighting(Result castresult)
{
    // light definition
    vec3 colour = vec3(0.0, 0.0, 0.0);
                
    for (int i=0; i<g_numlights; i++)
    {
        // evaluate the point light
        vec3 lightdir = castresult.pos - g_lights[i].pos;
        lightdir = normalize(lightdir);
        float brightness = dot(castresult.normal, -lightdir);

        if (brightness>0.0)
        {        
            // cast a ray to the lightsource
            Ray shadowray;
            shadowray.origin = castresult.pos + castresult.normal*EPSILON;
            shadowray.direction = g_lights[i].pos - castresult.pos;	// no need to normalize this
            Result shadowresult = raycast(shadowray);
            if ((shadowresult.t0 == NO_INTERSECTION) || (shadowresult.t0 > 1.0) || (shadowresult.t0 < 0.0))
            {
                float specular = pow(brightness, SPECULAR_POWER) * SPECULAR_AMOUNT;
                colour += (brightness*g_lights[i].colour*castresult.colour) + (specular*g_lights[i].colour);
            }        
        }
    }
    return colour;
}

///////////////////////////////////////////////////////////////////////////////////
// returns the colour at the intersection point, or AMBIENT

vec3 raytrace(Ray inputray)
{    
    Ray ray=inputray;
    vec3 outputcolour = vec3(AMBIENT, AMBIENT, AMBIENT);
    float rayweight = 1.0;
    
    for (int i=0; i<ITERATIONS; i++)
    {
        vec3 colour = vec3(0.0, 0.0, 0.0);
        Result result = raycast(ray);

        if (result.t0 == NO_INTERSECTION)
        {
            // no intersection at this stage, return the accumulated colour so far
            vec3 colour = vec3(AMBIENT, AMBIENT, AMBIENT);
            outputcolour = (outputcolour*(1.0-rayweight)) + (colour*rayweight);
            return outputcolour;
        }
        else
        {                        
            colour=lighting(result);
            colour.xyz = max(colour, AMBIENT);            
            outputcolour = (outputcolour*(1.0-rayweight)) + (colour*rayweight);

            if (result.reflectiveness>0.0)
            {
                Ray reflectray;
                reflectray.origin = result.pos + result.normal*EPSILON;
                reflectray.direction = reflect(ray.direction, result.normal);
                ray = reflectray;
                rayweight = rayweight * result.reflectiveness;
                if (rayweight < 0.1)
                {
                    return outputcolour;
                }
            }      
            else
            {
            	return outputcolour;    
            }
        }
    }
    
    outputcolour.xyz = max(outputcolour, AMBIENT);
    return outputcolour;
}

///////////////////////////////////////////////////////////////////////////////////
// initialise all the primitives

void setupscene()
{
    float pri=1.0;
    float sec=0.4;
    float ter=0.2;

#ifdef LIGHT_COLOUR_CHANGE    
    pri=1.0;
    sec=0.4 + sin(iTime*1.0)*0.4;
    ter=0.2 + sin(iTime*2.0)*0.2;
    
    pri*=2.0;
    sec*=2.0;
    ter*=2.0;
#endif //LIGHT_COLOUR_CHANGE    
    
    g_lights[0].colour = vec3(sec, ter, pri);
    g_lights[1].colour = vec3(ter, pri, sec);
    g_lights[2].colour = vec3(pri, ter, sec);    

#ifdef DISCO_LIGHTS       
    if (music)
    {
       	float fft  = texelFetch( iChannel1, ivec2(1, 0), 0 ).x; 
    	fft=fft*fft*fft;
    	AMBIENT=fft*0.5;
        g_lights[0].colour *= fft;
        g_lights[1].colour *= fft;
        g_lights[2].colour *= fft;        
    }
    else
    {
        g_lights[0].colour *= 0.5 + perlin(iTime*8.0, 1.0)*0.6;
        g_lights[1].colour *= 0.5 + perlin(iTime*7.0, 1.27)*0.6;
        g_lights[2].colour *= 0.5 + perlin(iTime*5.0, 1.72)*0.6;
    }
        
#endif //DISCO_LIGHTS    
            
	for (int i=0; i<g_numlights; i++)
    {
		float h = float(i)*4.0;
		float x = perlin(iTime*0.212, h+1.0)*4.0 - 2.0;
		float y = perlin(iTime*0.341, h+2.0)*4.0 - 2.0;
		float z = 4.0+perlin(iTime*0.193, h+3.0)*4.0;
		g_lights[i].pos = vec3(x, y, z+LIGHT_ZBIAS);
	}   
    
    // scene definition
    g_planes[0] = Plane(vec3(0.0, -5, 0.0), vec3(0.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), 1.0);    
//    g_planes[1] = Plane(vec3(0.0, +5, 0.0), vec3(0.0, -1.0, 0.0), vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), 1.0);    

#ifdef MODULATE_PLANE_REFLECTANCE    
    // animate the plane reflectiveness - this has a surprising side-effect :)
    g_planes[0].reflectiveness = 0.5 + 0.5*sin(iTime);
#endif //MODULATE_PLANE_REFLECTANCE    
   
    g_spheres[0] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(1.0, 0.2, 0.2), 0.75, 4.0, mat3(0.0));
    g_spheres[1] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(0.2, 1.0, 0.2), 0.75, -5.0, mat3(0.0));
    g_spheres[2] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(0.2, 0.2, 1.0), 0.75, 6.0, mat3(0.0));
    g_spheres[3] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(1.0, 1.0, 0.2), 0.75, -7.0, mat3(0.0));
    g_spheres[4] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(0.2, 1.0, 1.0), 0.75, 5.0, mat3(0.0));
    g_spheres[5] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(1.0, 0.2, 1.0), 0.75, -4.0, mat3(0.0));
    g_spheres[6] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(1.0, 1.0, 1.0), 0.75, 7.0, mat3(0.0));
    g_spheres[7] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(0.5, 0.5, 0.5), 0.75, -6.0, mat3(0.0));

    g_sphererotspeeds[0]=vec3(1.0, -0.37, 0.77);
    g_sphererotspeeds[1]=vec3(1.0, -0.37, -0.77);
    g_sphererotspeeds[2]=vec3(1.0, 0.37, 0.77);
    g_sphererotspeeds[3]=vec3(1.0, 0.37, -0.77);
    g_sphererotspeeds[4]=vec3(-1.0, -0.37, 0.77);
    g_sphererotspeeds[5]=vec3(-1.0, -0.37, -0.77);
    g_sphererotspeeds[6]=vec3(-1.0, 0.37, 0.77);
    g_sphererotspeeds[7]=vec3(-1.0, 0.37, -0.77);    
    
	for (int i=0; i<g_numspheres; i++)
    {
		float h = float(i)*4.0;
		float size = 		perlin(HURRY_UP*iTime*0.251, h+4.0)*1.0 + 1.5;
		float x    = 		perlin(HURRY_UP*iTime*0.212, h+1.0)*20.0-10.0;
		float y    = 		perlin(HURRY_UP*iTime*0.341, h+2.0)*20.0-10.0;
		float z    = 35.0 + perlin(HURRY_UP*iTime*0.193, h+3.0)*20.0-10.0;
		g_spheres[i].origin = vec3(x*0.4, y*0.25, z*0.25-1.0);
        g_spheres[i].radius=size;
        g_spheres[i].mat = rotationmatrix(iTime*g_sphererotspeeds[i]);
	}    
}

///////////////////////////////////////////////////////////////////////////////////
// 'volumetric' light rendering

vec3 volumelights( Ray ray )
{   
    float castdistance=10.0;
    const float caststep=VOLUME_STEP;
    float castscale=castdistance/caststep;

    Result occlusionresult = raycast(ray); 
    castdistance = min(occlusionresult.t0, castdistance);
                
    vec3 colour = vec3(0.0, 0.0, 0.0);            
    for (float t=0.0; t<100.; t+=caststep)
    {
        if (t>=castdistance) break;
        vec3 pos = ray.origin + ray.direction*t;
        
        for (int i=0; i<g_numlights; i++)
        {
            vec3 deltapos = g_lights[i].pos-pos;
            float d2=length(deltapos);

            Ray shadowray;
            shadowray.origin = pos;
            shadowray.direction = deltapos;
            Result shadowresult = raycast(shadowray);
            if (d2<8.0)
            {
                if (shadowresult.t0<0.0 || shadowresult.t0>1.0)            
                    colour.xyz += g_lights[i].colour/(d2*castscale);
            }                                
        }
    }
    
    return colour;
}

///////////////////////////////////////////////////////////////////////////////////
// main loop, iterate over the pixels, doing MSAA

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{   
    // is there a better way of determining if the preview screen is active ?
#ifdef MUSIC
    if (iResolution.x<640.0)
        music=false;
    else 
        music=true;
#endif //MUSIC
    
	setupscene();
    
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    float factor = 1.0/(MSAA*MSAA);
    
    for (float x=0.0; x<MSAA; x++)
    {
        for (float y=0.0; y<MSAA; y++)
        {
            vec2 uv = fragCoord.xy / iResolution.xy * 2.0 - 1.0;
            uv.y *= iResolution.y / iResolution.x;

            uv.x += (1.0/(iResolution.x*MSAA))*x;
            uv.y += (1.0/(iResolution.y*MSAA))*y;
            
            Ray ray;
            ray.origin = vec3(0.0, 0.0, 0.0);
            ray.direction = uv.xyx;
            ray.direction.z = 1.0;
            ray.direction = normalize(ray.direction);

            fragColor.xyz += raytrace(ray)*factor;
        }        
    }
    
    vec2 uv = fragCoord.xy / iResolution.xy * 2.0 - 1.0;
    uv.y *= iResolution.y / iResolution.x;
    Ray ray;
    ray.origin = vec3(0.0, 0.0, 0.0);
    ray.direction = uv.xyx;
    ray.direction.z = 1.0;
    ray.direction = normalize(ray.direction);
    
#ifdef VOLUMETRIC_LIGHTING    
    fragColor.xyz += volumelights(ray);
#endif //VOLUMETRIC_LIGHTING
}

///////////////////////////////////////////////////////////////////////////////////

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}