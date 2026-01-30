/*
 * Original shader from: https://www.shadertoy.com/view/llVSRw
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

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
#define MAX_STEPS 64
#define eps 0.01


float udRoundBox( vec3 p, vec3 b, float r )
{
  return length(max(abs(p)-b,0.0))-r;
}

float smink( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

vec2 sunk(vec2 a, vec2 b, float k)
{
	float sm = smink(a.x,b.x, k);
	float m = min(a.x, b.x);
	float ca = abs(sm -a.x);
	float cb = abs(sm -b.x);
	
	return ca < cb ? vec2(sm, a.y) : vec2(m, b.y);
}

vec3 applyFog( in vec3  rgb,       // original color of the pixel
               in float distance ) // camera to point distance
{
    float b = 0.012;
    float fogAmount = 1.0 - exp( -distance*distance*b );
    vec3  fogColor  = 0.6*vec3(0.2,0.3,0.4);
    return mix( rgb, fogColor, fogAmount );
}

vec2 scene(vec3 p)
{
    float a1 = udRoundBox( p - vec3(0.3, 0.0, -1.0), vec3(0.3, 0.01, 5.0), 0.02);
    float a2 = udRoundBox( p - vec3(0.56, -0.2, 0.3), vec3(0.01, 0.15, 0.01), 0.0);
    float a3 = udRoundBox( p - vec3(0.56, -0.2, -1.2), vec3(0.01, 0.15, 0.01), 0.0);
    float a4 = udRoundBox( p - vec3(0.56, -0.2, 2.7), vec3(0.01, 0.15, 0.01), 0.0);
    float a = min(a1, min(a2, a3));
    a = min(a, a4);
    float g  = udRoundBox( p - vec3(0.3, -0.22, -1.0), vec3(0.4, 0.01, 5.0), 0.0);
    
    return sunk(vec2(g,0), vec2(a, 1), 0.1);
}

vec3 getNormal(vec3 p)
{
    vec3 normal;
    vec3 ep = vec3(eps,0,0);
    normal.x = scene(p + ep.xyz).x - scene(p - ep.xyz).x;
    normal.y = scene(p + ep.yxz).x - scene(p - ep.yxz).x;
    normal.z = scene(p + ep.yzx).x - scene(p - ep.yzx).x;
    return normalize(normal);
}

float specular(vec3 normal, vec3 light, vec3 viewdir, float s)
{
	float k = max(0.0, dot(viewdir, reflect(light, normal)));
    return  pow(k, s);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
    vec2 p = fragCoord.xy / iResolution.xy;
    vec2 q = p - vec2(0.5, 0.4);
    
    //dist
    q.y += 0.015*cos(50.0*p.x) * (1.0 - smoothstep(0.0, 0.3, p.y));
    
	vec3 blue = 1.0/255.0 * vec3(26, 31, 40);
    vec3 orange = vec3(1.0, 0.4, 0);
    
    vec3 col = mix(7.5*blue, blue, smoothstep(0.0, 1.0, 2.0*abs(q.y)));
    col = mix(0.4*col + 0.9*orange, col, smoothstep(0.0, 0.65, 2.0*abs(q.y)));
    col *= smoothstep(0.0, 0.02 + 0.015*cos(5.0*(q.x -0.5) + 0.2*sin(800.0*q.x) + 0.3*sin(20.0*q.x)), abs(q.y));
    
    col += 0.12*texture(iChannel0, 2.2*p).x * (1.0 - smoothstep(0.0, 0.5, p.y));
    
    //raymarch
    float d = 5.0;
	float rot = -0.4;
    vec3 eye = vec3(-d*sin(rot) - 0.3, 1.0, -d*cos(rot) );
    vec3 up = vec3(0, 1, 0);
	vec3 forward = vec3(0, 0, 1);
    vec3 right = cross(forward, up);
    
    float f = 1.0;
    float u = fragCoord.x * 2.0 / iResolution.x - 1.0;
    float v = fragCoord.y * 2.0 / iResolution.x - 0.5;
    vec3 ro = eye + forward * f + right * u + up * v;
	vec3 rd = normalize(ro - eye);

   	vec3 ambient = 0.1*vec3(0.73, 0.43,0.34);
    vec3 invLight = -normalize(vec3(0.3, -2.9, -4));
            
    
    float t = 0.0;
    for(int i = 0; i < MAX_STEPS; ++i)
    {
        vec3 p = ro + rd * t;
        vec2 sc = scene(p);
        float d = sc.x;
      	float m = sc.y;
        if(d < eps)
        {
            vec3 normal = getNormal(p);
            float diffuse = max(0.,dot(invLight, normal));
            float spec = specular(normal, invLight, rd, 10.0);

            if(m == 1.0){
            	col = ambient*(1.0+diffuse+spec+0.1*cos(30.0*p.x));
                col += 0.12*texture(iChannel0, 0.1*p.xy).x;
                col = applyFog(col, length(p - eye));
            }else {
                col -= 0.3*diffuse - 0.0*spec;
            }

            break;
        }


        t += d;
    }
	
    
    fragColor = vec4(col, 1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}