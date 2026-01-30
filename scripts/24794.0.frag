#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = 3.141592;

float hash(float n) 
{ 
    return fract(sin(n)*43758.5453123); 
}

float noise2(in vec2 x)
{
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    float n = p.x + p.y*157.0;
    return mix(mix(hash(n+0.0), hash(n+1.0),f.x), mix(hash(n+157.0), hash(n+158.0),f.x),f.y);
}

float noise3(in vec3 x)
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    float n = p.x + p.y*157.0 + 113.0*p.z;
    return mix(
        mix(mix(hash(n+  0.0), hash(n+  1.0),f.x), mix(hash(n+157.0), hash(n+158.0),f.x),f.y),
        mix(mix(hash(n+113.0), hash(n+114.0),f.x), mix(hash(n+270.0), hash(n+271.0),f.x),f.y),f.z);
}

vec2 r(vec2 v,float y)
{
    return cos(y)*v+sin(y)*vec2(-v.y,v.x);
}

vec3 smin(vec3 a, vec3 b)
{
    if (a.x < b.x)
        return a;
    
    return b;
}

vec3 smax(vec3 a, vec3 b)
{
	if (a.x > b.x)
        return a;
    
    return b;
}

vec3 sinv(vec3 a)
{
	return vec3(-a.x, a.y, a.z);    
}

float sdSphere(vec3 p, float s)
{
  return length(p)-s;
}

float sdBox(vec3 p, vec3 b, float r)
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0)) - r;
}

float sdCylinder( vec3 p, vec3 c )
{
  return length(p.xz-c.xy)-c.z;
}

float smoothmax( float a, float b, float k )
{
    return -log(exp(k*a) + exp(k*b))/-k;
}

float smoothmin( float a, float b, float k )
{
    return -log(exp(-k*a) + exp(-k*b))/k;
}

float cylsphere(vec3 p)
{
    float d = max(sdCylinder(p, vec3(0.0, 0.0, 0.04)), sdBox(p, vec3(0.3), 0.0));
    d = smoothmin(d, sdSphere(p+vec3(0.0, 0.35, 0.0), 0.08), 48.0);
    d = smoothmin(d, sdSphere(p-vec3(0.0, 0.35, 0.0), 0.08), 48.0);
    return d;
}



vec3 greeble(vec3 p, float findex, float phase)
{
    const int indexCount = 6;
    int index = int(findex * float(indexCount));
    p.y -= phase * 0.2 - 0.2;
    
        
    return vec3(sdBox(p, vec3(0.4), 0.025), 10.0, 0.0);
}

vec3 f( vec3 p )
{
    ivec3 h = ivec3(p+1337.0);
    float hash = noise2(vec2(h.xz));
    h = ivec3(p+42.0);
    float phase = noise2(vec2(h.xz));
    vec3 q = p;
    q.xz = mod(q.xz, 1.0);
    q -= 0.5;
	return greeble(q, hash, phase);
}

vec3 colorize(float index)
{
    if (index == 0.0)
        return vec3(0.4, 0.6, 0.2);
    
    if (index == 1.0)
        return vec3(0.6, 0.3, 0.2);
    
    if (index == 2.0)
        return vec3(1.0, 0.8, 0.5);
    
    if (index == 3.0)
        return vec3(0.9, 0.2, 0.6);
    
    if (index == 4.0)
        return vec3(0.3, 0.6, 0.7);
    
    if (index == 5.0)
        return vec3(1.0, 1.0, 0.3);
    
    if (index == 6.0)
        return vec3(0.7, 0.5, 0.7);
    
    if (index == 7.0)
        return vec3(0.4, 0.3, 0.4);
    
    if (index == 8.0)
        return vec3(0.8, 0.3, 0.2);
    
    if (index == 9.0)
        return vec3(0.5, 0.8, 0.2);
    
	return vec3(index / 10.0);
}

float ao(vec3 v, vec3 n) 
{
    const int ao_iterations = 10;
    const float ao_step = 0.2;
    const float ao_scale = 0.75;
    
	float sum = 0.0;
	float att = 1.0;
	float len = ao_step;
    
	for (int i = 0; i < ao_iterations; i++)
    {
		sum += (len - f(v + n * len).x) * att;		
		len += ao_step;		
		att *= 0.5;
	}
	
	return 1.0 - max(sum * ao_scale, 0.0);
}

void main( void ) {
    gl_FragColor.xyz = vec3(0);
    
    vec3 q = vec3((gl_FragCoord.xy / resolution.xy - 0.5), 1.0);     
    float vignette = 1.0 - length(q.xy);
    q.x *= resolution.x / resolution.y;
    q.y -= 0.5;
    vec3 p = vec3(0, 0.0, -10.0);
    q = normalize(q);
    q.xz = r(q.xz, time * 0.1);
    p.y += 2.5;
	p.z -= time*0.5;
    
    float t=0.0;
    vec3 d = vec3(0);
    float steps = 0.0;
    const float maxSteps = 64.0;
    for (float tt = 0.0; tt < maxSteps; ++tt)
    {
        d = f(p+q*t);
        t += d.x*0.45;
        if(!(t<=50.0)||d.x>=0.0001)
        {
            break;
        }
        steps = tt;
    }

    vec3 glow = vec3(1.1, 1.1, 1.0);
    vec3 fog = vec3(0.7, 0.75, 0.8);
    vec3 color = fog;

    if (t <= 50.0)
    {
        vec3 hit = p+q*t;

        vec2 e = vec2(0.001, 0.00);
        vec3 normal= vec3( f(hit + e.xyy).x - f(hit - e.xyy).x, f(hit + e.yxy).x - f(hit - e.yxy).x, f(hit + e.yyx).x - f(hit - e.yyx).x) / (2.0 * e.x);

        normal= normalize(normal);
    
        float fao = ao(hit, normal);
        vec3 ldir = normalize(vec3(1.0, 1.0, -1.0));
        vec3 light = (0.5 * fog.rgb + vec3(0.5 * fao * abs(dot(normal, ldir)))) * colorize(d.y); // diffuse
        light += (1.0 - t / 50.0) * vec3(fao * pow(1.0 - abs(dot(normal, q)), 4.0)); // rim
        q = reflect(q, normal);
        light += fao * vec3(pow(abs(dot(q, ldir)), 16.0)); // specular
        color = min(vec3(1), light);
        color *= fao;
    }
    
    float luma = dot(color.rgb, vec3(0.3, 0.5, 0.2));
    color = mix(color, 1.0 * luma * vec3(1.0, 0.9, 0.5), 2.0 * max(0.0, luma-0.5)); // yellow highlights
    color = mix(color, 1.0 * luma * vec3(0.2, 0.5, 1.0), 2.0 * max(0.0, 0.5-luma)); // blue shadows
    //color = mix(color, glow, 0.8 * pow(steps / 90.0, 8.0)); // glow
    color = mix(color, fog, pow(min(1.0, t / 50.0), 0.5)); // fog
    color = pow(color, vec3(0.8)); // gamma
    color = smoothstep(0.0, 1.0, color); // contrast
    color *= pow(vignette + 0.3, 0.5); // vignette
    gl_FragColor = vec4(color, 1.0);
}