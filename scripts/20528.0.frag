// By: Brandon Fogerty
// bfogerty @ gmail dot com
// Special Thanks to IQ

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float EPS = 0.1;
const int MAXI = 100;

mat4 transpose( mat4 m )
{
	mat4 t = mat4( vec4( m[0][0], m[1][0], m[2][0], m[3][0] ),
				   vec4( m[0][1], m[1][1], m[2][1], m[3][1] ),
				   vec4( m[0][2], m[1][2], m[2][2], m[3][2] ),
				   vec4( m[0][3], m[1][3], m[2][3], m[3][3] ) );
	return t;
}

mat4 invert( mat4 mat )
{
	vec3 right = 	vec3( mat[0][0], mat[0][1], mat[0][2] );  
	vec3 up = 		vec3( mat[1][0], mat[1][1], mat[1][2] );
	vec3 fwd = 		vec3( mat[2][0], mat[2][1], mat[2][2] );
	vec3 pos = 		vec3( mat[3][0], mat[3][1], mat[3][2] );
	
	mat4 t = transpose( mat );
	
	t[0][3] = -dot(right, pos);
	t[1][3] = -dot(right, pos);
	t[2][3] = -dot(right, pos);
	
	return t;
}

float smin( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

float cube( vec3 ray, float r, mat4 transform )
{
	vec3 rayPrime = vec3(transpose( transform ) * vec4(ray,1));
	float d = length(max(abs(rayPrime)-vec3(0.5,0.5,0.5),0.0))-r;
	
	return d;
}

float sphere( vec3 ray, float r, mat4 transform )
{
	vec3 rayPrime = vec3(invert( transform ) * vec4(ray,1));
	float d = length(rayPrime)-r;
	
	return d;
}

float torus( vec3 ray, vec2 t, mat4 transform )
{
    vec3 rayPrime = vec3(invert( transform ) * vec4(ray,1));
	vec2 q = vec2(length(rayPrime.xz)-t.x,rayPrime.y);
	return length(q)-t.y;
}

float SceneDist( vec3 ray )
{	
    float varTime = time;
    vec2 varResolution = resolution;
    
    float final = 0.0;
    

        float c = cos( varTime );
        float s = sin( varTime );

        mat4 rotX = mat4(      vec4(1,0,0,0),
                               vec4(0,c,-s,0),
                               vec4(0,s,c,0),
                               vec4(0,0,0,1) );

        mat4 rotY = mat4(      vec4(c,0,-s,0),
                               vec4(0,1,0,0),
                               vec4(s,0,c,0),
                               vec4(0,0,0,1) );

        mat4 rotZ = mat4(      vec4(c,s,0,0),
                               vec4(-s,c,0,0),
                               vec4(0,0,1,0),
                               vec4(0,0,0,1) );

        mat4 pos = mat4(       vec4(1,0,0,0.0),
                               vec4(0,1,0,0),
                               vec4(0,0,1,1.0),
                               vec4(0,0,0,1) );

        mat4 transform = pos * rotZ * rotX * rotY;

        vec3 c1 = vec3(0.00, 3.10, 0.0);
        vec3 q = mod(ray,c1)-0.5*c1;
        float d0 = cube( q, 0.3, transform );
        
	c1 = vec3(3.10, 0.0, 0.0);
	q = mod(ray,c1)-0.5*c1;
	float d1 = cube( q, 0.3, transform );
        
        final = smin( d0, d1, 6.0 );
	
	return final;
}

vec3 getNormal(vec3 pos)
{
	vec2 eps = vec2(0.0, EPS);
	return normalize(vec3( // always normalise directions
			SceneDist(pos + eps.yxx) - SceneDist(pos - eps.yxx),
			SceneDist(pos + eps.xyx) - SceneDist(pos - eps.xyx),
			SceneDist(pos + eps.xxy) - SceneDist(pos - eps.xxy)));
}

vec3 Lighting( vec3 camPos, vec3 pos, vec3 normal, vec3 diffuseColor )
{
	vec3 lightPos = vec3(0,0,10);
	vec3 lightDir = normalize( lightPos - pos );
	vec3 viewDir = normalize( camPos - pos );
	vec3 lightAmbientColor = vec3(0.1,0.1,0.1);
	vec3 lightSpecularColor = vec3(1,1,1);
	
	vec3 halfDir = normalize(viewDir + lightDir);
	//float lightSpecularIntensity = pow( clamp(dot( normal, halfDir ), 0.0, 1.0), 2.0 );
	float lightSpecularIntensity = pow( clamp(dot( normal, reflect(lightDir, normal )), 0.0, 1.0), 80.0 );
	
	float lightDiffuseIntensity = clamp( dot( -normalize(pos), lightDir ), 0.00, 1.0);
	
	
	return lightAmbientColor + (lightDiffuseIntensity * diffuseColor) + (lightSpecularIntensity * lightSpecularColor);
	
}

vec3 RenderScene( vec2 uv )
{
    float varTime = time;
    vec2 varResolution = resolution;
    
	vec3 color = vec3(1,0,0);
	
	vec3 camPos = vec3(0,0,-10);
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
		
		float r = 1.0/cos(uv.x);
		float g = sin(uv.x);
		float b = 1.0/cos(uv.x+uv.y);
        	vec3 diffuse = vec3(r,g,b);
		color = Lighting( camPos, dest, getNormal( dest ), diffuse );
	}
	
	if( length(color) < 0.18 )
	{
		vec2 p = floor( gl_FragCoord.xy/varResolution.x*10.0 );
		float s = mod( p.x + p.y, 2.0 );
		vec3 bg0 = vec3(s,s,s);
    		color = bg0;
	}
    
	return color;
}

void main(void)
{
    float varTime = time;
    vec2 varResolution = resolution;
    
	vec2 uv = ((gl_FragCoord.xy / varResolution.xy) - 0.5) * vec2(2.0, 2.0 * varResolution.y / varResolution.x);
	vec3 color = RenderScene( uv );
	
	gl_FragColor = vec4(color, 1.0);
}
