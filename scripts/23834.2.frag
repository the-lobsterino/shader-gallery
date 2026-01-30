//--------------------------------------------------------------------------------------------
// Simple Ray Tracer
// By: Brandon Fogerty
// bfogerty at gmail dot com
//--------------------------------------------------------------------------------------------

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//--------------------------------------------------------------------------------------------
// Begin Region: Defines
//--------------------------------------------------------------------------------------------
#define PrimitiveType_None          0.0
#define PrimitiveType_Sphere        1.0
#define PrimitiveType_Plane         2.0

#define MAX_SPHERES                 3
#define MAX_PLANES                  1

#define TimeValue                   time
#define ResolutionValue             resolution
#define Epsilon                     0.000001

#define MaterialIndex0              0
#define MaterialIndex1              1
#define MaterialIndex2              2
#define MaterialIndex3              3
//--------------------------------------------------------------------------------------------
// End Region
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
// Begin Region: Data Structures
//--------------------------------------------------------------------------------------------
struct Ray
{
    vec3 origin;
    vec3 direction;
};

struct Material
{
    vec3 diffuseColor;
    vec3 specularColor;
    float specularIntensity;

    float receiveShadow;
    float shadowCasterIntensity;
   
    float reflectionIntensity;

    float refractionIndex;
    float refractionIntensity;
};

struct SphereParms
{
    vec3 position;
    float radius;
    int materialIndex;
    int lightVisualizer;
    int id;
};

struct PlaneParams
{
    vec3 pointOnPlane;
    vec3 normal;
    int materialIndex;
    int id;
};

struct HitInfo
{
    vec3 position;
    vec3 normal;
    vec3 rayDir;
    float t;
    float dist;
  
    int materialIndex;

    int lightVisualizer;
 
    float primitiveType;
    float hit;
    int id;
};

//--------------------------------------------------------------------------------------------
// End Region
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
// Begin Region: Global Variables
//--------------------------------------------------------------------------------------------
SphereParms spheres[MAX_SPHERES];
HitInfo sphereHitInfos[MAX_SPHERES];
PlaneParams planes[MAX_PLANES];
HitInfo planeHitInfos[MAX_PLANES];
Material materials[4];
vec3 lightPos;
//--------------------------------------------------------------------------------------------
// End Region
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
Material getMaterial( int materialIndex )
{
    // GLSL does not allow variables to be used as indicies into an array.
    // This is a work around but not as efficient as it could be...
    if( materialIndex == MaterialIndex0 ) return materials[0];
    if( materialIndex == MaterialIndex1 ) return materials[1];
    if( materialIndex == MaterialIndex2 ) return materials[2];
  
    return materials[3];
}

//--------------------------------------------------------------------------------------------
void sphere( Ray ray, SphereParms sphereParams, inout HitInfo hitInfo )
{
    hitInfo.primitiveType = PrimitiveType_None;
    hitInfo.t = -1.0;
    hitInfo.hit = 0.0;

    vec3 newO = ray.origin - sphereParams.position;
    float b = 2.0 * dot( newO, ray.direction );
    float c = dot( newO, newO ) - (sphereParams.radius*sphereParams.radius);

    float h = b*b - (4.0*c);
    if( h < 0.0 ) return;
    float t = (-b - sqrt( h ) ) / 2.0;

    if ( t < Epsilon ) return;
  
    hitInfo.position = ray.origin + ray.direction * t;
    hitInfo.normal = normalize( ( hitInfo.position - sphereParams.position ) / sphereParams.radius );
    hitInfo.t = t;
    hitInfo.dist = length( hitInfo.position - ray.origin );
    hitInfo.rayDir = ray.direction;
    hitInfo.materialIndex = sphereParams.materialIndex;
    hitInfo.lightVisualizer = sphereParams.lightVisualizer;
    hitInfo.primitiveType = PrimitiveType_Sphere;
    hitInfo.id = sphereParams.id;
    hitInfo.hit = 1.0;
}

//--------------------------------------------------------------------------------------------
void plane( Ray ray, PlaneParams planeParams, inout HitInfo hitInfo )
{
    hitInfo.primitiveType = PrimitiveType_None;
    hitInfo.t = -1.0;
    hitInfo.hit = 0.0;

    float d = dot( planeParams.pointOnPlane, planeParams.normal );
    float t = ( d - dot( ray.origin, planeParams.normal ) ) / dot( ray.direction, planeParams.normal );

    if( t < 0.00 )
    {
        return;
    }

    hitInfo.position = ray.origin + ray.direction * t;
    hitInfo.normal = normalize( planeParams.normal );
    hitInfo.t = t;
    hitInfo.dist = length( hitInfo.position - ray.origin );
    hitInfo.rayDir = ray.direction;
    hitInfo.materialIndex = planeParams.materialIndex;
    hitInfo.lightVisualizer = 0;
    hitInfo.primitiveType = PrimitiveType_Plane;
    hitInfo.id = planeParams.id;
    hitInfo.hit = 1.0;
}

//--------------------------------------------------------------------------------------------
HitInfo intersect( Ray ray )
{
    HitInfo hitInfo;
    hitInfo.primitiveType = PrimitiveType_None;
  
    for( int i = 0; i < MAX_SPHERES; ++i )
    {
        sphere( ray, spheres[i], sphereHitInfos[i] );
     
        if( sphereHitInfos[i].primitiveType > PrimitiveType_None )
        {
            if(  sphereHitInfos[i].dist <  hitInfo.dist || hitInfo.primitiveType <= PrimitiveType_None )
            {
                hitInfo = sphereHitInfos[i];
            }
        }
    }
 
    for( int i = 0; i < MAX_PLANES; ++i )
    {
        plane( ray, planes[i], planeHitInfos[i] );
     
        if( planeHitInfos[i].primitiveType > PrimitiveType_None )
        {
            if(  planeHitInfos[i].dist <  hitInfo.dist || hitInfo.primitiveType <= PrimitiveType_None )
            {          
                hitInfo = planeHitInfos[i];
            }
        }
    }
  
    return hitInfo;
}

//--------------------------------------------------------------------------------------------
void initializeMaterials()
{

    materials[0].diffuseColor = vec3( 1.0, 1.0, 0.0 );
    materials[0].specularColor = vec3( 1.0 );
    materials[0].specularIntensity = 10.0;
    materials[0].shadowCasterIntensity = 1.0;
    materials[0].reflectionIntensity = 0.00;
    materials[0].refractionIndex = 1.0;
    materials[0].refractionIntensity = 0.00;

    materials[1].diffuseColor = vec3( 0.0, 1.0, 1.4 );
    materials[1].specularColor = vec3( 1.0 );
    materials[1].specularIntensity = 10.0;
    materials[1].shadowCasterIntensity = 0.5;
    materials[1].reflectionIntensity = 0.00;
    materials[1].refractionIndex = 1.0;
    materials[1].refractionIntensity = 0.00;

    materials[2].diffuseColor = vec3( 0.8 );
    materials[2].specularColor = vec3( 1.0 );
    materials[2].specularIntensity = 10.0;
    materials[2].shadowCasterIntensity = 1.0;
    materials[2].reflectionIntensity = 0.00;
    materials[2].refractionIndex = 1.0;
    materials[2].refractionIntensity = 0.00;

    materials[3].diffuseColor = vec3( 1.0, 0.0, 0.0 );
    materials[3].specularColor = vec3( 1.0 );
    materials[3].specularIntensity = 10.0;
    materials[3].shadowCasterIntensity = 1.0;
    materials[3].reflectionIntensity = 0.00;
    materials[3].refractionIndex = 1.0;
    materials[3].refractionIntensity = 0.00;
  
}

//--------------------------------------------------------------------------------------------
void initializeScene()
{
    int id = -1;
    lightPos = vec3( 0.0, 3.0, 9.0 );
 
    // Light Visualizer
    spheres[0].position = lightPos;
    spheres[0].radius = 0.5;
    spheres[0].materialIndex = 0;
    spheres[0].lightVisualizer = 1;
    spheres[0].id = ++id;
 
    spheres[1].position = vec3( -2.0, 1.0, 0.0 );
    spheres[1].radius = 1.0;
    spheres[1].materialIndex = 1;
    spheres[1].id = ++id;

    spheres[2].position = vec3( 2.0, 1.0, 0.0 );
    spheres[2].radius = 1.0;
    spheres[2].materialIndex = 3;
    spheres[2].id = ++id;

    planes[0].pointOnPlane = vec3( 0.0, 0.0, 0.0 );
    planes[0].normal = vec3( 0.0, 1.0, 0.0 );
    planes[0].materialIndex = 2;
    planes[0].id = ++id;
 
}

//--------------------------------------------------------------------------------------------
void onAnimateScene()
{
    float animationTime = TimeValue * 0.5;

    lightPos = vec3( sin(TimeValue* 0.3)*5.0, 4.3, cos(TimeValue * 0.3)*10.0 );
    //lightPos = vec3( -2.0, 10.0, 0.0 );
    spheres[0].position = lightPos;

}

//--------------------------------------------------------------------------------------------
vec3 getObjectsBaseColor(HitInfo hitInfo)
{
    Material mat = getMaterial(hitInfo.materialIndex);

    return mat.diffuseColor;
}

//--------------------------------------------------------------------------------------------
vec3 calculateReflection( vec3 viewDir, HitInfo hitInfo )
{  
    Material objectMaterial = getMaterial(hitInfo.materialIndex);
    if( objectMaterial.reflectionIntensity <= 0.00 )
    {
        return vec3( 0.0 );
    }

    Ray reflectionRay;
    reflectionRay.direction = normalize( reflect( hitInfo.rayDir, hitInfo.normal ) );
    reflectionRay.origin = hitInfo.position + hitInfo.normal * Epsilon;
  
    HitInfo rHitInfo = intersect( reflectionRay );
    vec3 color = getObjectsBaseColor(rHitInfo) * objectMaterial.reflectionIntensity;
  
    return color;
}

//--------------------------------------------------------------------------------------------
vec3 calculateRefraction( vec3 viewDir, HitInfo hitInfo )
{  
    Material objectMaterial = getMaterial(hitInfo.materialIndex);
    if( objectMaterial.refractionIntensity <= 0.00 )
    {
        return vec3( 0.0 );
    }

    Ray refractionRay;
    refractionRay.direction = normalize( refract( hitInfo.rayDir, hitInfo.normal, objectMaterial.refractionIndex ) );
    refractionRay.origin = hitInfo.position - hitInfo.normal * Epsilon;
  
    HitInfo rHitInfo = intersect( refractionRay );
    for( int i = 0; i < 10; ++i )
    {
        if( rHitInfo.id == hitInfo.id )
        {
            refractionRay.origin = rHitInfo.position - rHitInfo.normal * Epsilon;
            rHitInfo = intersect( refractionRay );
        }
        else
        {
            break;
        }
    }
   
    vec3 color = getObjectsBaseColor(rHitInfo) * objectMaterial.refractionIntensity;
  
    return color;
}

//--------------------------------------------------------------------------------------------
float calculateShadow( vec3 lightPos, HitInfo hitInfo )
{
    if( hitInfo.primitiveType != PrimitiveType_Plane )
    {
        return 1.0;
    }
   

    Ray shadowRay;
    float unblocked = 0.00;

    vec3 lightDir = lightPos - hitInfo.position;

    float mag = length( lightDir );

    shadowRay.direction = normalize( lightDir );
    shadowRay.origin = hitInfo.position + (shadowRay.direction * 0.001);
    HitInfo shadowHitInfo = intersect( shadowRay );

    if( shadowHitInfo.dist > 0.01 ) return shadowHitInfo.dist / mag;

    return 0.00;
}

//--------------------------------------------------------------------------------------------
float random( vec2 uv )
{
    return fract( sin( fract( sin( uv.x ) ) + uv.y ) * 34792.48687 );
}

//--------------------------------------------------------------------------------------------
vec3 randomVec( vec3 v )
{
    float x = random( v.xy ) * 2.0 - 1.0;
    float y = random( v.yz ) * 2.0 - 1.0;
    float z = random( v.yx ) * 2.0 - 1.0;
    return vec3( x, y, z);
}


//--------------------------------------------------------------------------------------------
void main(void)
{
    float mx = (mouse.x * 2.0 - 1.0) * (ResolutionValue.x / ResolutionValue.y);
    float my = (mouse.y * 2.0 - 1.0);
    vec2 mouseOffset = vec2( mx, my );

    vec2 uv = gl_FragCoord.xy / ResolutionValue.x;
    vec2 uvp = (uv * 2.0 - 1.0) + mouseOffset;

    Ray ray;
    ray.origin = vec3( 0.0, 3.0, 10.0 );
    ray.direction = normalize( vec3( uvp, -1.0 ) );

    initializeMaterials();
    initializeScene();

    onAnimateScene();

    HitInfo hitInfo = intersect( ray );

    vec3 clearColor = vec3( 0.9 );
    vec3 c = clearColor;
    if( hitInfo.primitiveType <= PrimitiveType_None )
    {
        gl_FragColor = vec4( c, 1.0 );
        return;
    }

    vec3 lightDir = normalize( lightPos - hitInfo.position );

    float shadowFactor = calculateShadow( lightPos, hitInfo );
    // Calculate Lighting
    Material mat = getMaterial( hitInfo.materialIndex );
    float diffuseFactor = clamp( dot( hitInfo.normal, lightDir ), 0.00, 1.00 );
    vec3 reflectionVector = normalize( reflect( lightDir, hitInfo.normal ) );
    vec3 cameraToSurface = ray.direction;
    float specularFactor = pow( clamp( dot( reflectionVector, cameraToSurface ), 0.00, 1.0 ), mat.specularIntensity );

    vec3 baseColor = getObjectsBaseColor(hitInfo);
    vec3 reflection = calculateReflection( ray.direction, hitInfo );
    vec3 refraction = calculateRefraction( ray.direction, hitInfo );

    float ao = 0.1;
    vec3 ambient = vec3( 0.3 );
    vec3 diffuse = (baseColor + reflection + refraction) * diffuseFactor;
    vec3 specular = (mat.specularColor * specularFactor) * step( 1.0, shadowFactor );
    c = ambient + ((diffuse + specular) * shadowFactor);

    c = mix( c, clearColor, clamp( hitInfo.dist / 100.0, 0.00, 1.0 ) );
   
    gl_FragColor = vec4( c, 1.0 );
}
