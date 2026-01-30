// By: bfog
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
const int MAXI = 100;

float rand(vec2 n) { 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}
float fbm(vec2 n) {
	float total = 0.0, amplitude = 1.0;
	for (int i = 0; i < 4; i++) {
		total += noise(n) * amplitude;
		n += n;
		amplitude *= 0.5;
	}
	return total * 0.5;
}

float sphere( vec3 ray, float r )
{
    float d = length(ray)-r;
	float t = time * 0.1;
    	d += 0.5 * cos(ray.x*3.14159+t);
	//d += fbm( vec2( cos(ray.x+time)*ray.x+t, sin(ray.y+time)*ray.y+t ) );
	
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
    vec3 lightPos = vec3(0,0,10);
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
    vec3 color = RenderScene( uv ).xzy;
    
    // Scan line
    color -= mod(gl_FragCoord.y, 2.0) < 1.0 ? 0.5 : 0.0;

    gl_FragColor = vec4(color, 1.0);
}
