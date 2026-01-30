/*
 * Original shader from: https://www.shadertoy.com/view/lsBfDW
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
#define M_PI 3.141592
#define STEPS 150

vec3 light_p = vec3(0.0, 0.0, 0.0);
vec3 light_n = normalize(vec3(0.0, -1.0, 0.0));
vec3 light_C = vec3(0.9, 1.0, 0.9);

float rad2deg = 180.0 / M_PI;
float deg2rad = M_PI / 180.0;

float g_Epsilon = 0.002;

vec3 rotate(in vec3 p, float t)
{
    float theta = t * deg2rad;
	mat3 mtx = mat3(
   		cos(theta), -sin(theta), 0.0,
    	sin(theta), cos(theta), 0.0,
    	0.0, 0.0, 1.0
	);
    return p * mtx;
}

float sdf(vec3 p)
{
    p = rotate(p, 30.0 * p.z * 0.075);
	vec3 q;
    q.x = mod(p.x, 5.0) - 2.5;
    q.y = mod(p.y, 5.0) - 2.5;
    q.z = mod(p.z, 0.3) - 0.15;
    
	return length(q) - 0.8;
}

vec3 getNormal(vec3 p)
{
	float h = g_Epsilon;
	return normalize(vec3(
		sdf(p + vec3(h, 0, 0)) - sdf(p - vec3(h, 0, 0)),
		sdf(p + vec3(0, h, 0)) - sdf(p - vec3(0, h, 0)),
		sdf(p + vec3(0, 0, h)) - sdf(p - vec3(0, 0, h))
	));
}

float shadow(vec3 r0, vec3 rd, float maxt, float k)
{
	float t = g_Epsilon;
	float res = 1.0;
    vec3 p;
	for( int i = 0; i < 100; ++i )
	{
		if( t >= maxt )
			break;

        p = rd*t + r0;
		float h = sdf(p);
		if(h < g_Epsilon*0.1)
			return 0.0;
		res = min( res, k * h / t );
		t += h;
	}
	return res;
}

float light(vec3 p)
{
	vec3 ro = light_p;
	vec3 rd = normalize(p - ro);

	float shadowFactor = 0.0;
	//if( acos(dot(rd, light_n)) * rad2deg < 45.0 )
		shadowFactor = shadow( p, -rd, length(p - ro), 5.0 );
	    
	return shadowFactor;
}

vec3 raymarch(vec3 r0, vec3 rd)
{
	vec3 color = vec3(0.0, 0.05, 0.1);
	float t = 0.0;
                
	vec3 p; int j = 0;
	for(int i = 0; i < STEPS; ++i)
	{
		p = rd * t + r0;
		float d = sdf(p);
		if(d < g_Epsilon)
		{
			j = i;
            break;
		}
		t += d;
	}
    
    float sf = light(p);
    
    color = vec3(1.0, 0.5, 0.0);
    
    // Blinn-Phong shading
    // Diffuse
	vec3 N = getNormal(p);
	vec3 toLgt = normalize(light_p - p);
	float Id = dot( N, toLgt );
	color = color * Id;
    
    // Specular
    vec3 H = normalize(toLgt + -rd);
	float Is = pow( dot(H, N), 60.0 );
	color += vec3(1.0) * Is;
	color = clamp(color, 0.0, 1.0);
    
	float b = 0.015;
	float fogStrength = 1.0 - exp(-t * b);

    color = mix(color, vec3(0.1, 0.9, 1.0), fogStrength);
    color *= sf;
	
    return color;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p_uv = fragCoord.xy / iResolution.xy;
	
    float aspect_ratio = float(iResolution.x) / float(iResolution.y);
    p_uv = p_uv * 2.0 - 1.0;
    
    float angle = -0.05 * iTime * 2.0 * M_PI;
    float focal_length = 1.0 / tan( 75.0 / 2.0 * deg2rad );
    
    light_p = vec3(0.0, 0.0, iTime + 20.0);
    light_n = vec3(0.0, 0.0, 1.0);
    
    vec3 eye = vec3(2.5 * cos(angle), 2.5 * sin(angle), iTime);
    vec3 focus = vec3(eye.xy, iTime + 1.0);
    vec3 view = normalize(focus - eye);
    vec3 up = -normalize(vec3(eye.xy, 0.0));
    vec3 right = cross(up, view);

    vec3 rd = normalize(view * focal_length + up * p_uv.y + right * p_uv.x * aspect_ratio);
    vec3 color = raymarch(eye, rd);
    
    fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}