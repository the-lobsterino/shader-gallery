//--------------------------------------------------------------------------------------------
// Simple Ray Tracer
// By: Brandon Fogerty
// bfogerty at gmail dot com
// replaced checkboard against hexagonal tile pattern by I.G.P.
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

#define TimeValue                   time
#define ResolutionValue             resolution
#define Epsilon                     0.000001
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

struct SphereParms
{
    vec3 position;
    float radius;
    vec3 diffuseColor;
};
   
struct PlaneParams
{
    vec3 pointOnPlane;
    vec3 normal;
    vec3 diffuseColor;
};

struct HitInfo
{
    vec3 position;
    vec3 normal;
    float t;
    float dist;
    vec3 diffuseColor;
   
    float primitiveType;
};
   
//--------------------------------------------------------------------------------------------
// End Region
//--------------------------------------------------------------------------------------------
   
//--------------------------------------------------------------------------------------------
// Begin Region: Global Variables
//--------------------------------------------------------------------------------------------
SphereParms sphere0;
SphereParms sphere1;
SphereParms sphere2;
PlaneParams plane0;
vec3 lightDir;
//--------------------------------------------------------------------------------------------
// End Region
//--------------------------------------------------------------------------------------------

vec2 hexify ( vec2 p           // position
            , float hexCount)  // cells per width 
{
    const float c1 = 1.0 / 0.86602540378;    // 1.0 / sin(60°)
    const float c2 = 0.57735026919;          // sqrt(1/3)
	p *= hexCount;
	vec3 p2 = floor(vec3(p.x * c1, p.y + p.x*c2, p.y - p.x*c2));
	float y = floor((p2.y + p2.z) / 3.0);
	float x = floor((p2.x + (1.0 -mod(y, 2.0))) * 0.5);
	return vec2(x,y) / hexCount;
}

// return gray shaded hexagonal cell color
vec3 hexagonal4Color ( vec2 p            // position
                     , float hexCount)   // cells per width
{
	p = hexify(p, hexCount);
	float gray =  0.5*floor(mod((p.x+p.y) * hexCount, 2.0)) 
		   +  0.75*floor(mod((   -p.x) * hexCount, 2.0));
	return vec3(gray);
}

//--------------------------------------------------------------------------------------------
vec3 checkerBoardTexture( vec3 hitPos )
{
	vec2 p = floor( hitPos.xz * 1.0 );
	float s = mod( p.x + p.y, 2.0 );
	return vec3(s);
	//return c;
}
//--------------------------------------------------------------------------------------------
vec3 planeTexture( vec3 hitPos )
{
  vec3 color = hexagonal4Color ( hitPos.xz, 2.0 );
  //vec3 color = checkerBoardTexture (hitPos);
  return mix( color*0.7, vec3( 1.5 ), hitPos.z / 20.0 );  // darken far away
}
//--------------------------------------------------------------------------------------------
void sphere( Ray ray, SphereParms sphereParams, inout HitInfo hitInfo )
{  
    hitInfo.primitiveType = PrimitiveType_None;
    hitInfo.t = -1.0;
   
    vec3 newO = ray.origin - sphereParams.position;
    float b = 2.0 * dot( newO, ray.direction );
    float c = dot( newO, newO ) - (sphereParams.radius*sphereParams.radius);
   
    float h = b*b - (4.0*c);
    if( h < 0.0 ) return;
    float t = (-b - sqrt( h ) ) / 2.0;
   
    hitInfo.position = ray.origin + ray.direction * t;
    hitInfo.normal = normalize( ( hitInfo.position - sphereParams.position ) / sphereParams.radius );
    hitInfo.t = t;
    hitInfo.dist = length( hitInfo.position - ray.origin );
    hitInfo.diffuseColor = sphereParams.diffuseColor;
    hitInfo.primitiveType = PrimitiveType_Sphere;
}

//--------------------------------------------------------------------------------------------
void plane( Ray ray, PlaneParams planeParams, inout HitInfo hitInfo )
{  
    hitInfo.primitiveType = PrimitiveType_None;
    hitInfo.t = -1.0;
   
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
    hitInfo.diffuseColor = planeParams.diffuseColor;
    hitInfo.primitiveType = PrimitiveType_Plane;
}

//--------------------------------------------------------------------------------------------
HitInfo intersect( Ray ray )
{
    HitInfo hitInfo;
    hitInfo.primitiveType = PrimitiveType_None;
   
    HitInfo sphere0HitInfo;
    HitInfo sphere1HitInfo;
    HitInfo sphere2HitInfo;
    HitInfo plane0HitInfo;
   
    sphere( ray, sphere0, sphere0HitInfo );
    sphere( ray, sphere1, sphere1HitInfo );
    sphere( ray, sphere2, sphere2HitInfo );
    plane( ray, plane0, plane0HitInfo );
   
    
    if( sphere0HitInfo.primitiveType > PrimitiveType_None )
    {
        hitInfo = sphere0HitInfo;
    }
    
    if( sphere1HitInfo.primitiveType > PrimitiveType_None )
    {
        if(  sphere1HitInfo.dist <  hitInfo.dist || hitInfo.primitiveType <= PrimitiveType_None )
        {
            hitInfo = sphere1HitInfo;
        }
    }
    
    if( sphere2HitInfo.primitiveType > PrimitiveType_None )
    {
        if(  sphere2HitInfo.dist <  hitInfo.dist || hitInfo.primitiveType <= PrimitiveType_None )
        {
            hitInfo = sphere2HitInfo;
        }
    }
    if( plane0HitInfo.primitiveType > PrimitiveType_None )
    {
        if(  plane0HitInfo.dist <  hitInfo.dist || hitInfo.primitiveType <= PrimitiveType_None )
        {
		plane0HitInfo.diffuseColor = planeTexture( plane0HitInfo.position );
		hitInfo = plane0HitInfo;
        }
    }
   
    return hitInfo;
}

//--------------------------------------------------------------------------------------------
void onSetupScene()
{
    lightDir = normalize( vec3( 0.1, 0.2, 0.1 ) );
   
    sphere0.position = vec3( -5.0, 0.0, 0.0 );
    sphere0.radius = 1.0;
    sphere0.diffuseColor = vec3( 1.0, 1.4, 1.0 );
   
    sphere1.position = vec3( 0.0, 0.0, 1.0 );
    sphere1.radius = 1.0;
    sphere1.diffuseColor = vec3( 1.0, 0.4, 1.0 );
    
    sphere2.position = vec3( 5.0, 0.0, 1.0 );
    sphere2.radius = 1.0;
    sphere2.diffuseColor = vec3( 0.0, 1.0, 1.4 );
    
    plane0.pointOnPlane = vec3( 0.0, 0.0, 0.0 );
    plane0.normal = vec3( 0.0, 1.0, 0.0 );
    plane0.diffuseColor = vec3( 0.8 );
}

//--------------------------------------------------------------------------------------------
void onAnimateScene()
{
	//these spheres are in a vacuum and have different charges and masses
	//because uniform acceleration due to gravitation was deemed "too hard"
    //sphere0.position.x = -7.0 + cos( TimeValue * 8.0  );
    sphere0.position.y = mix( 1.1, 10.0, abs(sin( TimeValue * 2.3 )) * 0.4 );
    
    //sphere1.position.x = cos( TimeValue * 5.0 );
    sphere1.position.y = mix( 1.1, 10.0, abs(sin( TimeValue * 1.7 )) * 0.6 );
    
    //sphere2.position.x = 7.0 + cos( TimeValue * 8.0 );
    sphere2.position.y = mix( 1.1, 10.0, abs(sin( TimeValue )) * 0.9 );
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
    ray.origin = vec3( 0.0, 5.0, 10.0 );
    ray.direction = normalize( vec3( uvp, -1.0 ) );
   
    onSetupScene();
    onAnimateScene();
   
    HitInfo hitInfo = intersect( ray );
   
    vec3 c = vec3( 0.9 );
    if( hitInfo.primitiveType <= PrimitiveType_None )
    {
        gl_FragColor = vec4( c, 1.0 );
        return;
    }

    // Calculate Lightingdd
    float dif = clamp( dot( hitInfo.normal, lightDir ), 0.00, 1.00 );
    vec3 reflectionVector = normalize( reflect( hitInfo.normal, lightDir ) );
    vec3 toCamera = normalize( hitInfo.position - ray.origin );
    float amb = clamp( dot( reflectionVector, toCamera ), 0.00, 1.0 );
    c = hitInfo.diffuseColor * dif + vec3( 0.4 ) * amb;
   
    // Calculate Shadows
    Ray shadowRay;
    shadowRay.direction = -normalize( lightDir );
    shadowRay.origin = hitInfo.position + (shadowRay.direction * Epsilon);
    HitInfo shadowHitInfo = intersect( shadowRay );
    if( shadowHitInfo.primitiveType != PrimitiveType_None )
    {
        c *= 0.5;
    }

	//c = checkerBoardTexture( uv, resolution );
    gl_FragColor = vec4( c, 1.0 );
}
