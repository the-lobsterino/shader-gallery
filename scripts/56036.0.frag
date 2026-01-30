/*
 * Original shader from: https://www.shadertoy.com/view/3lfXD8
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

// --------[ Original ShaderToy begins here ]---------- //
///////////////////////////////////////////////////////////////////////////////////
// When you're coding its ALWAYS the weekend :) ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

#define NO_INTERSECTION 100000.0
#define AMBIENT 0.0
#define EPSILON 0.0001
#define TEXTURESCALE 0.125
#define SPECULAR_POWER 25.0
#define SPECULAR_AMOUNT 1.0
#define MSAA 1.0
#define ITERATIONS 4
#define HURRY_UP 1.5

#define VOLUME_STEP 0.2	//// SET THIS TO 0.3 OR HIGHER FOR BETTER PERFORMANCE /////

///////////////////////////////////////////////////////////////////////////////////

#define DISCO_LIGHTS
#define LIGHT_COLOUR_CHANGE
#define MODULATE_PLANE_REFLECTANCE
#define VOLUMETRIC_LIGHTING

///////////////////////////////////////////////////////////////////////////////////

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct Sphere {
    vec3 origin;
    float radius;
    vec3 colour;
    float reflectiveness;
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
    float t;
    vec3 colour;
    float reflectiveness;
    vec3 ray;
};

///////////////////////////////////////////////////////////////////////////////////

const int g_numlights=3;
Light g_lights[g_numlights];

const int g_numplanes=2;
Plane g_planes[g_numplanes];

const int g_numspheres=7;
Sphere g_spheres[g_numspheres];

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

Result hit_sphere(Ray ray, Sphere sphere)
{
    Result result = Result(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), NO_INTERSECTION, sphere.colour, sphere.reflectiveness, ray.direction);
    vec3 oc = ray.origin - sphere.origin;
    float a = dot(ray.direction, ray.direction);
    float b = 2.0 * dot(oc, ray.direction);
    float c = dot(oc,oc) - sphere.radius*sphere.radius;
    float discriminant = b*b - 4.0*a*c;
    if(discriminant < 0.0){
        return result;
    }
    else{
        float t;
		float t1 = (-b - sqrt(discriminant)) / (2.0 * a);
		float t2 = (-b + sqrt(discriminant)) / (2.0 * a);
        if (t1>0.0 && t1<t2)
            t=t1;
        else if (t2>0.0 && t2<=t1)
            t=t2;
        else
            return result;
        
        result.t = t;
        result.pos = ray.origin + (ray.direction*result.t);
        result.normal = result.pos - sphere.origin;
        result.normal = normalize(result.normal);
        return result;      
	}
}

///////////////////////////////////////////////////////////////////////////////////

Result hit_plane(Ray ray, Plane plane) 
{
    Result result = Result(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), NO_INTERSECTION, vec3(1.0, 1.0, 1.0), plane.reflectiveness, ray.direction);
    if (dot(plane.normal, ray.direction) == 0.0) 
    {
        return result;
    }

    float t = (dot(plane.normal, plane.origin) - dot(plane.normal, ray.origin)) / dot(plane.normal, ray.direction);
    if (t<0.0)
    {
    	return result;    
    }
    
    vec3 inter = ray.origin + ray.direction*t;    
    result.t = t;
    result.pos = inter;
    result.normal = plane.normal;
    
    // sample the texture in the returned colour
    vec2 tex;
    tex.x = dot((result.pos - plane.origin), plane.binormal)*TEXTURESCALE;
    tex.y = dot((result.pos - plane.origin), plane.binormal2)*TEXTURESCALE;
    result.colour = texture(iChannel0, tex).xyz * texture(iChannel0, tex).xyz;	// make it mor 'gaudy' ;-)
    
    return result;
}

///////////////////////////////////////////////////////////////////////////////////
// ray-world query, returning intersection point, normal, surface colour

Result raycast(Ray ray)
{
    Result bestresult = Result(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), NO_INTERSECTION, vec3(1.0, 1.0, 1.0), 0.0, ray.direction);    
    
    for (int i=0; i<g_numspheres; i++)
    {
        Result res = hit_sphere(ray, g_spheres[i]);    
        if (res.t < bestresult.t)
            bestresult=res;    
    }
    for (int i=0; i<g_numplanes; i++)
    {
    	Result res = hit_plane(ray, g_planes[i]);    
        if (res.t < bestresult.t)
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
            if ((shadowresult.t == NO_INTERSECTION) || (shadowresult.t > 1.0) || (shadowresult.t < 0.0))
            {
//                vec3 reflectedlight = reflect(lightdir, castresult.normal);
//                float specular = dot(castresult.ray, -reflectedlight);
                
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

        if (result.t == NO_INTERSECTION)
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
    g_lights[0].colour *= 0.4 + perlin(iTime*8.0, 1.0)*0.5;
    g_lights[1].colour *= 0.4 + perlin(iTime*7.0, 1.27)*0.5;
    g_lights[2].colour *= 0.4 + perlin(iTime*5.0, 1.72)*0.5;
#endif //DISCO_LIGHTS    
    
	for (int i=0; i<g_numlights; i++)
    {
		float h = float(i)*4.0;
		float x = perlin(iTime*0.212, h+1.0)*5.0 - 2.5;
		float y = perlin(iTime*0.341, h+2.0)*2.0;
		float z = 4.0+perlin(iTime*0.193, h+3.0)*4.0;
		g_lights[i].pos = vec3(x, y, z+2.0);
	}   
    
    // scene definition
    g_planes[0] = Plane(vec3(0.0, -3, 0.0), vec3(0.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), 0.25);    
    g_planes[1] = Plane(vec3(0.0, +3, 0.0), vec3(0.0, -1.0, 0.0), vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), 0.25);    

#ifdef MODULATE_PLANE_REFLECTANCE    
    // animate the plane reflectiveness - this has a surprising side-effect :)
    g_planes[0].reflectiveness = 0.5 + 0.5*sin(iTime);
    g_planes[1].reflectiveness = 0.5 + 0.5*sin(iTime);
#endif //MODULATE_PLANE_REFLECTANCE    
    
    g_spheres[0] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(1.0, 0.2, 0.2), 0.75);
    g_spheres[1] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(0.2, 1.0, 0.2), 0.75);
    g_spheres[2] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(0.2, 0.2, 1.0), 0.75);
    g_spheres[3] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(1.0, 1.0, 0.2), 0.75);
    g_spheres[4] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(0.2, 1.0, 1.0), 0.75);
    g_spheres[5] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(1.0, 0.2, 1.0), 0.75);
    g_spheres[6] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(1.0, 1.0, 1.0), 0.75);
//    g_spheres[7] = Sphere(vec3(0.0, 0.0, 0.0), 1.0, vec3(0.5, 0.5, 0.5), 0.75);
                
	for (int i=0; i<g_numspheres; i++)
    {
		float h = float(i)*4.0;
		float size = 		perlin(HURRY_UP*iTime*0.251, h+4.0)*1.0 + 0.75;
		float x    = 		perlin(HURRY_UP*iTime*0.212, h+1.0)*20.0-10.0;
		float y    = 		perlin(HURRY_UP*iTime*0.341, h+2.0)*20.0-10.0;
		float z    = 35.0 + perlin(HURRY_UP*iTime*0.193, h+3.0)*20.0-10.0;
		g_spheres[i].origin = vec3(x*0.4, y*0.25, z*0.25-1.0);
        g_spheres[i].radius=size;
	}            
}

///////////////////////////////////////////////////////////////////////////////////
// 'volumetric' light rendering

vec3 volumelights( Ray ray )
{   
    const float castdistance=10.0;
    const float caststep=VOLUME_STEP;
    const float castscale=castdistance/caststep;
    
    float lightocclusion[g_numlights];
    for (int i=0; i<g_numlights; i++)
    {
        Ray occlusionray;
        occlusionray.origin = ray.origin;
        occlusionray.direction = g_lights[i].pos - ray.origin;
		Result occlusionresult = raycast(occlusionray); 
        if (occlusionresult.t>=0.0 && occlusionresult.t<=1.0)
            lightocclusion[i] = 0.0;
        else
            lightocclusion[i] = 1.0;
    }
                
    vec3 colour = vec3(0.0, 0.0, 0.0);            
    for (float t=1.0; t<castdistance; t+=caststep)
    {
        vec3 pos = ray.origin + ray.direction*t;
        
        for (int i=0; i<g_numlights; i++)
        {
            vec3 deltapos = g_lights[i].pos-pos;
            float d2=length(deltapos);
            d2=pow(d2, 1.0);

            vec3 deltaposN = normalize(deltapos);
            //if (abs(deltaposN.z) > 0.3)
            {
                Ray shadowray;
                shadowray.origin = pos;
                shadowray.direction = deltapos;
                Result shadowresult = raycast(shadowray);
                if (d2<8.0)
                {
                    if (shadowresult.t<0.0 || shadowresult.t>1.0)            
                        colour.xyz += lightocclusion[i]*g_lights[i].colour/(d2*castscale);
                }                                
            }
            
        }
    }
    
    return colour;
}

///////////////////////////////////////////////////////////////////////////////////
// main loop, iterate over the pixels, doing MSAA

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{   
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
    gl_FragColor.a = 1.0;
}