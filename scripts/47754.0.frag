#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution

#define AA 1

#define PI 3.14159265359
#define RECIPROCAL_PI 0.31830988618

#ifndef saturate
#define saturate(a) clamp( a, 0.0, 1.0 )
#endif

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Physical Material

#define MAXIMUM_SPECULAR_COEFFICIENT 0.16
#define DEFAULT_SPECULAR_COEFFICIENT 0.04

struct PhysicalMaterial {
    vec3    diffuseColor;
    float   specularRoughness;
    vec3    specularColor;
    float   clearCoat;
    float   clearCoatRoughness;
};

struct IncidentLight {
    vec3 direction;
    vec3 color;
};

struct ReflectedLight {
    vec3 directDiffuse;
    vec3 directSpecular;
    vec3 indirectDiffuse;
    vec3 indirectSpecular;
};

struct DirectionalLight {
    vec3 direction;
    vec3 color;
};

struct GeometricContext {
    vec3 normal;
    vec3 viewDir;
};

float pow2( const in float x ) {
    return x * x;
}

float pow3( const in float x ) {
    return x * x * x;
}

float clearCoatDHRApprox( const in float roughness, const in float dotNL ) {
    return DEFAULT_SPECULAR_COEFFICIENT +
        ( 1.0 - DEFAULT_SPECULAR_COEFFICIENT ) *
        ( pow( 1.0 - dotNL, 5.0 ) * pow( 1.0 - roughness, 2.0 ) );
}

vec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {
    float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );
    return ( 1.0 - specularColor ) * fresnel + specularColor;
}

float G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
    float a2 = pow2( alpha );
    float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
    float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
    return 0.5 / max( gv + gl, 1e-6 );
}

float D_GGX( const in float alpha, const in float dotNH ) {
    float a2 = pow2( alpha );
    float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
    return RECIPROCAL_PI * a2 / pow2( denom );
}

vec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {
    return RECIPROCAL_PI * diffuseColor;
}

void getDirectionalDirectLightIrradiance(
    const in DirectionalLight directionalLight,
    const in GeometricContext geometry,
    out IncidentLight directLight )
{
    directLight.color = directionalLight.color;
    directLight.direction = directionalLight.direction;
}

vec3 BRDF_Specular_GGX(
    const in IncidentLight incidentLight,
    const in GeometricContext geometry,
    const in vec3 specularColor,
    const in float roughness )
{
    float alpha = pow2( roughness );
    vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );
    float dotNL = saturate( dot( geometry.normal, incidentLight.direction ) );
    float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
    float dotNH = saturate( dot( geometry.normal, halfDir ) );
    float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
    vec3 F = F_Schlick( specularColor, dotLH );
    float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );
    float D = D_GGX( alpha, dotNH );
    return F * ( G * D );
}

void RE_Direct_Physical(
    const in IncidentLight directLight,
    const in GeometricContext geometry,
    const in PhysicalMaterial material,
    inout ReflectedLight reflectedLight )
{
    float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
    vec3 irradiance = dotNL * directLight.color;

    irradiance *= PI;

    float clearCoatDHR = material.clearCoat * clearCoatDHRApprox( material.clearCoatRoughness, dotNL );
    reflectedLight.directSpecular += ( 1.0 - clearCoatDHR ) * irradiance * BRDF_Specular_GGX( directLight, geometry, material.specularColor, material.specularRoughness );
    reflectedLight.directDiffuse += ( 1.0 - clearCoatDHR ) * irradiance * BRDF_Diffuse_Lambert( material.diffuseColor );
    reflectedLight.directSpecular += irradiance * material.clearCoat * BRDF_Specular_GGX( directLight, geometry, vec3( DEFAULT_SPECULAR_COEFFICIENT ), material.clearCoatRoughness );
}

float sdPlane( vec3 p )
{
    return p.y;
}

float sdSphere(vec3 p, float radius)
{
    return length(p) - radius;
}

float sdBox( vec3 p, vec3 b )
{
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float udBox( vec3 p, vec3 b )
{
  return length(max(abs(p)-b,0.0));
}

vec2 opU( vec2 d1, vec2 d2 )
{
    return (d1.x<d2.x) ? d1 : d2;
}

float opI( float d1, float d2 )
{
    return max(d1,d2);
}

vec3 opRep( vec3 p, vec3 c )
{
    return mod(p, c) - 0.5 * c;
}

// http://iquilezles.org/www/articles/checkerfiltering/checkerfiltering.htm
float checkersGradBox( in vec2 p )
{
    // filter kernel
    vec2 w = fwidth(p) + 0.001;
    // analytical integral (box filter)
    vec2 i = 2.0*(abs(fract((p-0.5*w)*0.5)-0.5)-abs(fract((p+0.5*w)*0.5)-0.5))/w;
    // xor pattern
    return 0.5 - 0.5*i.x*i.y;
}

vec2 map(vec3 pos)
{
    vec2 result = vec2(sdPlane(pos), 0.0);
    result = opU(
        result,
        vec2(
            sdSphere(
                opRep(pos - vec3(0.0, 0.25, 0.0), vec3(1.0, 0.0, 1.0)) ,
                0.25
            ), 
            1.0
        )
    );
    return result;
}

vec3 getNormal( in vec3 p) {
    const float e = 1e-4;
    return normalize(vec3(
        map(vec3(p.x + e, p.y, p.z)).x - map(vec3(p.x - e, p.y, p.z)).x,
        map(vec3(p.x, p.y + e, p.z)).x - map(vec3(p.x, p.y - e, p.z)).x,
        map(vec3(p.x, p.y, p.z + e)).x - map(vec3(p.x, p.y, p.z - e)).x
    ));
}

vec2 castRay(in vec3 eye, in vec3 ray) {
    const float near = 1e-1;
    const float far = 1e+3;
    const int max_steps = 64;
    const float eps = 1e-6;

    float depth = near;
    float material = -1.0;

    for(int i = 0; i < max_steps; i++) {
        vec2 result = map(eye + depth * ray);
        if(result.x < eps || result.x > far) {
            break;
        }

        depth += result.x;
        material = result.y;
    }

    if(depth > far) {
        material = -1.0;
    }

    return vec2(depth, material);
}

float calcSoftshadow( in vec3 ro, in vec3 rd, in float tmin, in float tmax )
{
    const float eps = 5e-3;
    float result = 1.0;
    float depth = tmin;

    for( int i=0; i<16; i++ )
    {
        float h = map( ro + rd * depth ).x;
        result = min( result, 8.0 * h / depth );
        depth += clamp( h, 0.02, 0.10 );
        if( result < eps || depth > tmax ) break;
    }

    return clamp(result, 0.0, 1.0 );
}

vec3 render( in vec3 eye, in vec3 ray )
{
    vec3 col = vec3(0.7, 0.9, 1.0) + ray.y * 0.8;

    vec2 result = castRay(eye, ray);
    float depth = result.x;
    float mID = result.y;

    if(mID > -1.0) {
        vec3 pos = eye + depth * ray;
        vec3 normal = getNormal(pos);

        vec3 diffuse = vec3(0.1250, 0.2250, 0.3750);
        vec3 emissive = vec3(0.0);
        float roughness = 0.5;
        float metalness = 0.0;
        float reflectivity = 0.0;
        float clearCoat = 1.0;
        float clearCoatRoughness = 0.5;

        if( mID == 0.0 )
        {
            diffuse = 0.3 + checkersGradBox( 5.0 * pos.xz ) * vec3(0.1);
        }

        if(mID == 1.0) {
            diffuse = hsv2rgb(vec3((floor(pos.x) + floor(pos.z)) * 0.1, 1.0, 1.0));
            emissive = diffuse * 0.05;

            clearCoat = saturate(pos.x + 0.5 * 0.2);
            clearCoatRoughness = saturate(pos.z + 0.5 * 0.2);
        }

        vec3 totalEmissiveRadiance = emissive;

        PhysicalMaterial physicalMaterial = PhysicalMaterial(
            // diffuseColor
            diffuse * ( 1.0 - metalness ),
            // specularRoughness
            clamp( roughness, 0.04, 1.0 ),
            // specularColor
            mix( vec3( MAXIMUM_SPECULAR_COEFFICIENT * pow2( reflectivity ) ), diffuse, metalness ),
            // clearCoat
            saturate( clearCoat ),
            // clearCoatRoughness
            clamp( clearCoatRoughness, 0.04, 1.0 )
        );

        DirectionalLight directionalLight = DirectionalLight(
            // Direction 
            normalize( vec3(-0.4, 0.7, -0.6) ),
            // Color
            vec3(1.0)
        );

        ReflectedLight reflectedLight = ReflectedLight(
            vec3( 0.0 ),
            vec3( 0.0 ),
            vec3( 0.0 ),
            vec3( 0.0 ) );

        IncidentLight directLight = IncidentLight(
            vec3(0.0),
            vec3(0.0)
        );

        GeometricContext geometry = GeometricContext(
            // Normal
            normal,
            // ViewDir
            -ray
        );

        getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );
        RE_Direct_Physical( directLight, geometry, physicalMaterial, reflectedLight );
        vec3 outgoingLight = reflectedLight.directDiffuse
            + reflectedLight.indirectDiffuse
            + reflectedLight.directSpecular
            + reflectedLight.indirectSpecular
            + totalEmissiveRadiance;

        if( mID == 0.0 )
        {
            outgoingLight *= calcSoftshadow(
                pos,
                directionalLight.direction,
                1e-8,
                2.5 );
        }

        col = outgoingLight;
    }

    col = mix( col, vec3(0.8 ,0.9, 1.0), 1.0 - exp( -1e-4 * pow3(depth) ) );

    return col;
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
    vec3 cw = normalize(ta-ro);
    vec3 cp = vec3(sin(cr), cos(cr),0.0);
    vec3 cu = normalize( cross(cw,cp) );
    vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec3 tot = vec3(0.0);
#if AA>1
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        // pixel coordinates
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        vec2 p = (-iResolution.xy + 2.0 * (fragCoord+o)) / iResolution.y;
#else    
        vec2 p = (-iResolution.xy + 2.0 * fragCoord) / iResolution.y;
#endif
    float s = sin(iTime * 5e-1);
    float c = cos(iTime * 5e-1);

    float fov = 60.0;

    vec3 eye = vec3(c * 5.0, 2.0, s * 4.0);
    vec3 target = vec3(0.0, 1.0, 0.0);

    mat3 camera = setCamera(eye, target, .0);

    // ray direction
    vec3 ray = camera * normalize( vec3(p.xy, 1.0 / tan(0.5 * fov * PI / 180.0)) );

    vec3 col = render(eye, ray);
    col = pow( col, vec3(0.4545) );
    tot += col;
#if AA > 1
    }
    tot /= pow2(float(AA));
#endif

    fragColor = vec4(tot, 1.0);
}

void main()
{
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
