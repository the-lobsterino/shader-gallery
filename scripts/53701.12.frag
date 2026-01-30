// dogshit edit 4 u
#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

const float pi = 3.14159;

mat3 xrot(float t)
{
    return mat3(1.0, 0.0, 0.0,
                0.0, cos(t), -sin(t),
                0.0, sin(t), cos(t));
}

mat3 zrot(float t)
{
    return mat3(cos(t), -sin(t), 0.0,
                sin(t), cos(t), 0.0,
                0.0, 0.0, 1.0);
}

float sdCappedCylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float smin( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

float pMod1(inout float p, float size)
{
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p + halfsize, size) - halfsize;
	return c;
}

float sdSphere( vec3 p, float s )
{
    return length(p)-s;
}



float map(vec3 pos, float q)
{
    vec3 p = pos;
    float so = q;
    float sr = atan(pos.z,pos.x);
    so += pos.y * 0.5;
    so += sin(pos.y*55.0+sr-iTime) * 0.005;
    so += sin(pos.y*125.0+sr-iTime*10.0) * 0.004;
    //float ro = pos.y*10.0-iTime;
    //pos.xz += vec2(cos(ro), sin(ro)) * 0.07;
    float d = sdCappedCylinder(pos, vec2(so, 10.0));
    float k = pos.y;
	

    p.z += sin(fract(time*0.1)*6.28)*0.1;	//fract(time*0.1);
    float c3 = pMod1(p.z,0.4);
    p.x += sin(fract(time*0.04)*6.28+c3*4.0);
    float c1 = pMod1(p.x,0.4);
    p.y += sin(fract(time*0.02)*6.28+c1*32.0);
    float c2 = pMod1(p.y,0.4);
	
	
    float d1 = sdSphere(p,0.02);
    k = smin(d1,k,22.0);
	
    return smin(d,k,22.0);
}

vec3 surfaceNormal(vec3 pos)
{
 	vec3 delta = vec3(0.01, 0.0, 0.0);
    vec3 normal;
    normal.x = map(pos + delta.xyz,0.0) - map(pos - delta.xyz,0.0);
    normal.y = map(pos + delta.yxz,0.0) - map(pos - delta.yxz,0.0);
    normal.z = map(pos + delta.zyx,0.0) - map(pos - delta.zyx,0.0);
    return normalize(normal);
}

float trace(vec3 o, vec3 r, float q)
{
    float t = 0.0;
    float ta = 0.0;
    for (int i = 0; i < 168; ++i)
    {
        float d = map(o + r * t, q);
        t += d;	//*0.5;
    }
    return t;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    
    vec3 r = normalize(vec3(uv, 1.0));
	
    r *= zrot(sin(time*0.5)*0.2) * xrot(-pi*0.05+sin(time*0.1)*0.1);
    
    vec3 o = vec3(0.0, 0.15, -0.5);
    
//    float t = trace(o, r, 0.0);
    float t = trace(o, r, 0.0+sin(time)*0.05);

	vec3 world = o + r * t;
    vec3 sn = surfaceNormal(world);
    
    vec3 vol = vec3(0.0);
    
    float prod = max(dot(sn, -r), 0.0);
    
    float fd = map(world, 0.0);
    float fog = 1.0 / (1.0 + t * t * 0.005 + fd * 10.0);
    
    vec3 sky = vec3(68.0,123.0,123.0) / 255.0;
    
	float zzz = sin(time*0.45)*170.0;
    vec3 fgf = vec3(40.0+zzz,160.0,190.0) / 255.0;
	
    vec3 fgb = vec3(10.0,110.0,49.0) / 255.0;
    vec3 fg = mix(fgb, fgf, prod);
    
    vec3 back = mix(fg, sky, 1.0-fog);
    
    vec3 mmb = mix(vol, back, 0.8);
    
    vec3 fc = mmb * vec3(1.0);
    
	
	uv.x += sin(time+uv.y*0.7)*1.4;
	fragColor = vec4(fc*1.0-abs(uv.x*uv.y*0.35), 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}