/*
 * Original shader from: https://www.shadertoy.com/view/wtsBz7
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
// reference:
// https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection

#define MOVING

const float MAXFLOAT = 3.402823e+38;
const float EPSILON = 0.001;
const int MAX_BOUNCE = 6;

vec3 camera = vec3(0.0, 0.0, 0.0);

vec3 center = vec3(0.0, 0.0, 2.0);

vec3 light = vec3(-10.0, 10.0, -10.0);

float radius = 1.0;
float radius2 = 1.0; // squared

vec3 color_white = vec3(1.0, 1.0, 1.0);
vec3 color_black = vec3(0.0, 0.0, 0.0);
const vec3 sphere_color = vec3(1.0, 0.0, 0.0);

vec4 scene[5];

void scene_init() {
    scene[0] = vec4(0.0, 0.0, 4.0, 0.9);
    scene[1] = vec4(-2.0, 0.6, 4.0, 0.9);
    scene[2] = vec4(2.0, 0.6, 4.0, 0.9);
    scene[3] = vec4(-0.5, -0.5, 2.0, 0.3);
    scene[4] = vec4(0.5, -0.5, 2.0, 0.3);
}

vec3 sky(vec3 a)
{
    #if 0
    return mix(
        color_white,
        vec3(0.0, 0.423, 0.784),
        dot(normalize(a), vec3(0.0, 1.0, 0.0))*0.5+0.5);
    #else
    // happy accident
    return mix(
        color_white,
        color_black,
        dot(normalize(a), vec3(0.0, 1.0, 0.0)));
    #endif
}

bool sphere_intersect(in vec4 sphere, in vec3 origin, in vec3 dir, out float x0, out float x1)
{
    vec3 center = sphere.xyz;
    float radius2 = sphere.w*sphere.w;
    
	vec3 L = origin - center;
    float a = dot(dir, dir);
    float b = 2.0 * dot(dir, L);
    float c = dot(L, L) - radius2;
    
    float discr = b * b - 4.0 * a * c;
    
    if (discr < 0.0)
        return false;
    
    if (discr == 0.0)
    {
        x0 = x1 = -0.5 * b / a;
        
        return true;
    }
    
    float q = (b > 0.0) ?
        -0.5 * (b + sqrt(discr)) :
    	-0.5 * (b - sqrt(discr));
    x0 = q / a;
    x1 = c / q;
    
    if (x0 > x1)
    {
        float t = x0;
        x0 = x1;
        x1 = t;
    }
    
    if (x0 < 0.0)
    {
        x0 = x1;
        if (x0 < EPSILON) // avoid self colisions roughly
            return false;
    }
    
    return true;
}

// Blinn-Phong (light, view, normal)
vec3 phong(in vec3 l, in vec3 v, in vec3 n)
{
	vec3 h = normalize(l + v);

    vec3 diffuse = sphere_color * max(dot(n, l), 0.0);

    vec3 specular = color_white * max(pow(dot(n, h), 200.0), 0.0);
    
    return (specular * 0.3) + (diffuse * 0.5) + color_white * 0.2;
}

bool nearest_intersection(in vec3 origin, in vec3 dir, out vec3 center, out float t)
{
    t = MAXFLOAT;
    float t0, t1;
    bool hit = false;
    
    #ifdef MOVING
    vec4 sphere;
    
    for (int i = 0; i < 3; i++)
    {
        if(sphere_intersect(scene[i], origin, dir, t0, t1))
    	{
            if(t0 < t)
            {
                t = t0;
                center = scene[i].xyz;
            }
            
            hit = true;
        }
    }
    
    // let's add some stuff not on the scene
    for (int i = 0; i < 8; i++)
    {
    	//sphere = scene[0];
        float ts = iTime + float(i) * 3.14/4.0;
        
        sphere = vec4(cos(ts)*1.5, -0.6, sin(ts)*1.5+4.0, 0.5);
        
        if(sphere_intersect(sphere, origin, dir, t0, t1))
        {
            if(t0 < t)
            {
                t = t0;
                center = sphere.xyz;
            }

            hit = true;
        }
    }
    
    #else
    for (int i = 0; i < 5; i++)
    {
        if(sphere_intersect(scene[i], origin, dir, t0, t1))
    	{
            if(t0 < t)
            {
                t = t0;
                center = scene[i].xyz;
            }
            
            hit = true;
        }
    }
    #endif
    
    return hit;
}

void reflect_n(in vec3 origin, in vec3 dir, out vec3 color)
{
    vec3 center;
    float t = MAXFLOAT;
    bool hit = true;
    // color = color_white;
    color = sky(dir);
    
    for (int n = 0; n < MAX_BOUNCE; n++)
    {
        if(!nearest_intersection(origin, dir, center, t))
        	break;
        
        vec3 intersection = origin + dir * t;
        vec3 normal = normalize(intersection - center);

        vec3 pcolor = phong(
            normalize(light - intersection), // light
            normalize(origin - intersection), // view
            normal); // normal

        color = mix(color, pcolor, 0.6);

        origin = intersection;
        dir = reflect(dir, normal);
    }
    color = mix(color, sky(dir), 0.1);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    scene_init();
    float aspect = iResolution.x / iResolution.y;
    vec2 uv = vec2(fragCoord.x / iResolution.x  * aspect, fragCoord.y / iResolution.y);
    
    // primary rays
    vec3 dir = normalize(vec3(uv.x - aspect / 2.0, uv.y-0.5, 1.0));

   	vec3 rcolor;
    reflect_n(camera, dir, rcolor);
    fragColor = vec4(rcolor, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}