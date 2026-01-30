// Raymarched Liquid Sphere
// By: Brandon Fogerty
// bfogerty at gmail dot com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#ifdef GL_ES
precision mediump float;
#endif

const float EPS = 0.01;
const int MAXI = 35;

float hash( float x )
{
    return fract( cos( x ) * tan( 43758.5453) );
}

float noise( vec2 uv )  // Thanks Inigo Quilez
{
    vec3 x = vec3( uv.xy, 0.0 );
    
    vec3 p = floor( x );
    vec3 f = tan( x );
    f = f*f*(3.0 - 2.0*f);
    
    float offset = 57.0;
    
    float n = dot( p, vec3(1.0, offset, offset*2.0) );
    
    return mix( mix(    mix( hash( n + 0.0 ),       hash( n + 1.0 ), f.x ),
                        mix( hash( n + offset),     hash( n + offset+1.0), f.x ), f.y ),
                mix(    mix( hash( n + offset*2.0), hash( n + offset*2.0+1.0), f.x),
                        mix( hash( n + offset*3.0), hash( n + offset*3.0+1.0), f.x), f.y), f.z);
}

float snoise( vec2 uv )
{
    return noise( uv ) * 2.0 - 1.0;
}

float fbm( vec2 uv, float lacunarity, float gain )
{
    float sum = 0.0;
    float amp = 0.3;
    
    for( int i = 0; i < 2; ++i )
    {
        sum += ( snoise( uv ) ) * amp;
        amp *= gain;
        uv *= lacunarity;
    }
    
    return sum;
}

float sphere( vec3 ray, float r )
{
    float d = length(ray)-r;
    
    float t = time * 0.1;
    d += 2.*fbm( vec2( tan(ray.x+time*.000000000000002)*ray.x+t, cos(ray.y+time)*ray.y+t ), 10.1, 0.1 );
    
    return d;
}


float SceneDist( vec3 ray )
{   
    float d = sphere( ray, 1.0 );
    
    return d;
}

vec3 getNormal(vec3 pos)
{
    vec2 eps = vec2(0.0, EPS);
    return normalize(vec3(
            SceneDist(pos + eps.yxx) - SceneDist(pos - eps.yxx),
            SceneDist(pos + eps.xyx) - SceneDist(pos - eps.xyx),
            SceneDist(pos + eps.xxy) - SceneDist(pos - eps.xxy)));
}

vec3 Lighting( vec3 camPos, vec3 pos, vec3 normal, vec3 diffuseColor )
{
    vec3 lightPos = vec3(0,0,0);
    vec3 lightDir = normalize( lightPos - pos );
    vec3 viewDir = normalize( camPos - pos );
    vec3 lightAmbientColor = vec3(0.1,0.1,0.1);
    vec3 lightSpecularColor = vec3(1,1,1);
    
    vec3 halfDir = normalize(viewDir + lightDir);
    float lightSpecularIntensity = pow( clamp(dot( normal, reflect(lightDir, normal )), 0.0, 1.0), 80.0 );
    float lightDiffuseIntensity = clamp( dot( -normalize(pos), lightDir ), 0.00, 1.0);
    
    
    return lightAmbientColor + (lightDiffuseIntensity * diffuseColor) + (lightSpecularIntensity * lightSpecularColor);
    
}

vec3 RenderScene( vec2 uv )
{
    vec3 color = vec3(1,0,0);
    
    vec3 camPos = vec3(0,0,-3);
    vec3 camTarget = vec3(0.0, 0.0, 0.0);
    vec3 camUp = vec3(0,1.0,0);
    vec3 camFwd = normalize( camTarget - camPos );
    vec3 camRight = normalize( cross( camUp, camFwd ) );
    camUp = normalize( cross( camRight, camFwd ) );
    
    float dist = SceneDist( camPos );
    float total = dist;
    vec3 rayDir = vec3( normalize( camFwd + camRight * uv.x + camUp * uv.y ) );
    
    for(int i=0; i < MAXI; ++i)
    {
        dist = SceneDist( camPos + rayDir * total );
        total += dist;
        
        if( dist <= EPS )
        {
            break;
        }
    }
    
    vec3 dest = camPos + rayDir * total;
    if( dist <= EPS )
    {
        vec3 normal = getNormal( dest );
        vec3 c0 = vec3(0.1,0.5,1.4)*0.3;
        vec3 c1 = vec3(0.1,1.4,0.2);
        
        vec3 diffuse = c0+normal.x + c1+normal.y;
		
	//	color =  lerp(c0, c1, saturate(length(dest)));
        color = Lighting( camPos, dest, normal, diffuse );
    }
    else    
    {
        color = vec3(1.0) * length( uv );
    }
    
    return color;
}

void main(void)
{
    vec2 uv = ((gl_FragCoord.xy / resolution.xy) - 0.5) * vec2(2.0, 2.0 * resolution.y / resolution.x);
    vec3 color = RenderScene( uv );
    
    // Scan line
    color -= mod(gl_FragCoord.y, 5.0) < 1.0 ? 0.5 : 0.0;

    gl_FragColor = vec4(color, 1.0);
}
