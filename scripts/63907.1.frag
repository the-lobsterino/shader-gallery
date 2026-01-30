// pure ASS
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float saturate( float x )
{
    return clamp( x, 0.0, 1.0 );
}

float Sphere( vec3 p, float s )
{
	return length( p ) - s;
}

float Scene( vec3 p )
{
	p.x += sin(p.y*4.0+time)*0.1;
	p.z += sin(p.x*4.0+time)*0.4;
    float a = p.x;
    p.x = -p.y;
    p.y = a;
	
	p *= 1.+.25*sin(atan(p.x, p.y)*8.)/(1.0+.49*(p.z));
    
    // sphere
    float ret = Sphere( p, 0.3 );
	return ret;
}

float CastRay( in vec3 ro, in vec3 rd )
{
    const float maxd = 5.0;
    
	float h = 1.0;
    float t = 0.0;
   
    for ( int i = 0; i < 50; ++i )
    {
        if ( h < 0.001 || t > maxd ) 
        {
            break;
        }
        
	    h = Scene( ro + rd * t );
        t += h;
    }

    if ( t > maxd )
    {
        t = -1.0;
    }
	
    return t;
}

vec3 SceneNormal( in vec3 pos )
{
	vec3 eps = vec3( 0.0001, 0.0, 0.0 );
	vec3 normal = vec3(
	    Scene( pos + eps.xyy ) - Scene( pos - eps.xyy ),
	    Scene( pos + eps.yxy ) - Scene( pos - eps.yxy ),
	    Scene( pos + eps.yyx ) - Scene( pos - eps.yyx ) );
	return normalize( normal );
}

vec3 KeyColor = vec3( .4, 0.58, 0.84 );
vec3 FillColor = vec3( 0.59, 0.19, 0.25 );
vec3 Albedo = vec3(0.46, 0.26, 0.46);

vec3 Sky( vec3 rayDir )
{
    vec3 skyPos     = rayDir;
    vec2 skyAngle   = vec2( atan( skyPos.z, skyPos.x ), acos( skyPos.y ) );

    vec3 color = KeyColor * mix( 1.0, 0.4, smoothstep( 0.0, 1.0, saturate( 1.5 * skyPos.y + 0.1 ) ) );
    color = mix( color, FillColor, smoothstep( 0.0, 1.0, saturate( -1.5 * skyPos.y - 0.1 ) ) );
    return color;
}

void main(void)
{
	vec2 q = gl_FragCoord.xy / resolution.xy;
	vec2 p = -1.0 + 2.0 * q;
	p.x *= resolution.x / resolution.y;

 	vec3 rayOrigin	= vec3( 0.0, 0.0, -2.0 );
	vec3 rayDir 	= normalize( vec3( p.xy, 2.0 ) );

	vec3 color = Sky( rayDir );
	float t = CastRay( rayOrigin, rayDir );
    	if ( t > 0.0 )
    	{
        	vec3 pos = rayOrigin + t * rayDir;
        	vec3 normal = SceneNormal( pos );
		
        	vec3 sunDir = normalize( vec3( 0.707, 0.707, -0.4 ) );
		vec3 SunColor = vec3(1.64,1.27,0.99);
		
		vec3 SkyDir = normalize(vec3(0.0, 1.0, 0.0));
		vec3 SkyColor = vec3(0.16,0.20,0.28);
		
		vec3 IndirectDir = normalize(sunDir * vec3(-1.0,0.0,-1.0));
		vec3 IndirectColor = vec3(0.40,0.28,0.20);
		
		vec3 light = SunColor * saturate( dot( normal, sunDir ) );
		light += SkyColor * saturate(dot(normal, SkyDir));
		light += IndirectColor * saturate(dot(normal, IndirectDir));
  
 		color = Albedo * light;
    	}
	
    	color = pow(color, vec3(1.0/2.2));
	color = color * 1.0-length(p*0.6);
        
    	gl_FragColor = vec4( color, 1.0 );
}
