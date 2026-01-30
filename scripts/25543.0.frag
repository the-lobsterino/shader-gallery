#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Camera
const float fov = 90.0;

//const mat4 invProjMatrix = inverse(projMatrix);

const mat4 cameraTransform = mat4(  vec4(1.0,     0,      0,   0),   //x
                                  vec4(0,     1.0,      0,   0),   //y
                                  vec4(0,       0,    -1.0,   0),   //z
                                  vec4(0,     0,      8.0, 1.0)   //t
                                  );

//Rays
#define MAX_RAY_STEPS 120
const float rayDeltaTime = 0.1;
const float rayMinTime = 0.001;
const float rayMaxTime = 100.0;

//Distance Functions
float sphereDistance(in vec3 i_position, in float i_sphereRadius)
{
    return length(i_position) - i_sphereRadius;
}


//Hit functions

bool sphereHitTest(vec3 p)
{
    float radius = 3.0;
    float d = sphereDistance( p, radius);
    return d <= radius;
}


/*
 bool castRay(in vec3 i_rayPosition, in vec3 i_rayDirection, out float o_t, out int o_steps)
 {
 float t = rayMinTime;
 o_steps = 0;
 for( int i = 0; i < MAX_RAY_STEPS; i++ )
 {
 vec3 p = i_rayPosition + t*i_rayDirection;
 
 float radius = 3.0;
 float d = sphereDistance( p, radius);
 
 if( d <= radius)
 {
 o_t = t;
 return true;
 }
 
 // allow the error to be proportinal to the distance
 t += rayDeltaTime + 0.01*t;
 o_steps++;
 }
 
 return false;
 }
 */

//#define RAY_CAST(RAY_ORIGIN, RAY_DIR, OUT_TIME, TEST_FUNCTION ) OUT_TIME = rayMinTime; for( int i = 0; i < MAX_RAY_STEPS; i++ ){ vec3 p = i_rayPosition + OUT_TIME*i_rayDirection; if( TEST_FUNCTION(p) ){break;} OUT_TIME += rayDeltaTime + 0.01*t; } OUT_TIME = -1.0;


#define RAY_CAST(RAY_ORIGIN, RAY_DIR, OUT_TIME, TEST_FUNCTION )			\
OUT_TIME = rayMinTime;								\
for( int i = 0; i < MAX_RAY_STEPS; i++ )					\
{										\
vec3 p = i_rayPosition + OUT_TIME*i_rayDirection;				\
										\
if( TEST_FUNCTION(p) )								\
{										\
break;										\
}										\
										\
OUT_TIME += rayDeltaTime + 0.01*t;						\
}										\
OUT_TIME = -1.0;								\


void render(out vec4 o_color, in vec3 i_rayOrigin, in vec3 i_rayDirection)
{
    float tSphere = 0.0;
    RAY_CAST(i_rayOrigin, i_rayDirection, tSphere, sphereHitTest);
    
    if( tSphere >= 0 )
    {
        //Shade Sphere
        o_color = vec4( 1.0 );
        //color = vec4( 1.0 - float(steps) / float(MAX_RAY_STEPS) );
    }
    
}


void getRay(in vec2 i_fragCoord, out vec3 o_rayOrigin, out vec3 o_rayDirection )
{
    o_rayOrigin = cameraTransform[3].xyz;
    
    /* Inguo stuff
     vec2 p = (-iResolution.xy+2.0*i_fragCoord.xy)/iResolution.y;
     float fl = iResolution.y/tan(fov/2.0);
     o_rayDirection = normalize(   p.x*cameraTransform[0].xyz
     + p.y*cameraTransform[1].xyz
     + fl*cameraTransform[2].xyz );
     */
    
    /*
     float screenDistance = iResolution.y/tan(fov/2.0);
     vec3 p = screenDistance*cameraTransform[2].xyz
     + (2.0*i_fragCoord.y-iResolution.y)*cameraTransform[1].xyz
     + (2.0*i_fragCoord.x-iResolution.x)*cameraTransform[0].xyz;
     o_rayDirection = normalize(p);
     */
    
    float screenDistance = resolution.y/tan(fov/2.0);
    vec2 p = (2.0*i_fragCoord.xy -resolution.xy);
    o_rayDirection = normalize(   screenDistance*cameraTransform[2].xyz
                               + p.y*cameraTransform[1].xyz
                               + p.x*cameraTransform[0].xyz);
}

void main( )
{
    //Ray
    vec3 rayOrigin;
    vec3 rayDirection;
    float t = 0.0;
    getRay(gl_FragCoord.xy, rayOrigin, rayDirection);
    
    //Render
    vec4 color = vec4(0.0);
    render(color, rayOrigin, rayDirection);
    
    //Post-Processing
    gl_FragColor = color;
}
