/*
 * Original shader from: https://www.shadertoy.com/view/Md3BRB
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
float hash(in float entropy)
{
    return fract(sin(entropy*821.91)*951.51);
}

float hash3(in vec3 entropy)
{
    return hash(3.7*entropy.x + 721.5*entropy.y + 3.91*entropy.z + 0.5);
}

float noise(in vec3 p)
{
    vec3 ipos = floor(p);
    vec3 fpos = fract(p);
    
    float a = hash3(ipos + vec3(0, 0, 0));
    float b = hash3(ipos + vec3(1, 0, 0));
    float c = hash3(ipos + vec3(0, 1, 0));
    float d = hash3(ipos + vec3(1, 1, 0));
    
    float e = hash3(ipos + vec3(0, 0, 1));
    float f = hash3(ipos + vec3(1, 0, 1));
    float g = hash3(ipos + vec3(0, 1, 1));
    float h = hash3(ipos + vec3(1, 1, 1));
    
    vec3 t = smoothstep(0., 1., fpos);
    
    return mix(mix(mix(a, b, t.x), mix(c, d, t.x), t.y),
               mix(mix(e, f, t.x), mix(g, h, t.x), t.y),
               t.z);
}

float fbm(in vec3 p)
{
    float res = 0.;
    float amp = 0.5;
    float freq = 2.0;
    for (int i = 0; i < 5; ++i)
    {
        res += amp*noise(freq*p);
        amp *= 0.5;
        freq *= 2.0;
    }
    return res;
}

float map(in vec3 p, out int id)
{
    float sphere = length(p - vec3(0, 1, 0)) - 1.;
    float ground = p.y;
    float d = min(sphere, ground);
    
    if (d == ground)
    {
        id = 0;
    }
    if (d == sphere)
    {
        id = 1;
    }
    
    return d;
}

vec3 map_n(in vec3 p)
{
    vec2 e = vec2(0, 0.001);
    int garbage;
    return normalize(vec3(map(p + e.yxx, garbage), map(p + e.xyx, garbage), map(p + e.xxy, garbage)) - map(p, garbage));
}

float shadow(in vec3 p, in vec3 l)
{
    float res = 1.;
    float k = 4.;
    
    float t = 0.1;
    float t_max = 50.;
    for(int i = 0; i < 256; ++i)
    {
        if (t > t_max) break;
        int garbage;
        float d = map(p + t*l, garbage);
        if (d < 0.001)
        {
            return 0.0;
        }
        res = min(res, d*k/t);
        t += d;
    }
    
    return res;
}

//NOTE: GGX lobe for specular lighting, took straight from here: http://www.codinglabs.net/article_physically_based_rendering_cook_torrance.aspx
float chiGGX(float v)
{
    return v > 0. ? 1. : 0.;
}
float GGX_Distribution(vec3 n, vec3 h, float alpha)
{
    float NoH = dot(n,h);
    float alpha2 = alpha * alpha;
    float NoH2 = NoH * NoH;
    float den = NoH2 * alpha2 + (1. - NoH2);
    return (chiGGX(NoH) * alpha2) / ( 3.1415926 * den * den );
}

vec4 render(in vec2 uv)
{
    float time = 0.1*iTime;
    
    vec3 at = vec3(0, 1, 0);
    vec3 ro = vec3(4.*sin(time), 2, -4.*cos(time));
    vec3 cam_z = normalize(at - ro);
    vec3 cam_x = normalize(cross(vec3(0,1,0), cam_z));
    vec3 cam_y = cross(cam_z, cam_x);
    vec3 rd = normalize(cam_x * uv.x + cam_y * uv.y + 2. * cam_z);
    
    int id = -1;
    float t_max = 50.;
    float t = 0.001;
    for (int i = 0; i < 256; ++i)
    {
        if (t > t_max) break;
        
        int curr_id;
        float d = map(ro + t*rd, curr_id);
        if (d < 0.001)
        {
            id = curr_id;
            break;
        }
        t += d;
    }
    
    vec3 sun_color = vec3(1.5);
    vec3 background = vec3(1.4, 1.6, 1.8);
    vec3 p = ro + t*rd;
    vec3 col = background;
    if (id != -1)
    {
        vec3 n = map_n(p);
        vec3 l = -normalize(vec3(0.5, -0.9, 0.5));
        
        vec3 shad = vec3(0);
        
        float ao = 1.;
        if (id == 0)
        {       
#if 1       
           //NOTE: iq's analytical sphere occlusion
            vec3 d = vec3(0, 1, 0) - p;
            float l = length(d);
            ao  = 1.0- max(0.0,dot(n,d))/(l*l*l);
            
#else       
            //NOTE: fake occlusion
            float t = length(p);
            ao = smoothstep(0.0, 1.5, t);
#endif
        }
        else if (id == 1)
        {
            ao = 0.5 * (dot(n, vec3(0,1,0)) + 1.);
        }
        
     	float roughness;
        if (id == 0)
        {
            roughness = 0.3;
        }
        else if (id == 1)
        {
            roughness = 0.9;
        }
        
        //ambient
        shad += 0.3 * ao * background;
        
        //sun reflection
        {
            vec3 v = normalize(ro - p);
            vec3 h = normalize(l + v);
            float R0 = 1. - roughness;
            float fresnel = R0 + (1. - R0) * pow(1. - dot(v, n), 5.);
            float diff = (1. - fresnel) * max(0., dot(n, l));
            float spec = fresnel * GGX_Distribution(n, h, roughness);
            shad += 0.7 * shadow(p, l) * (diff + spec) * sun_color;
        }
        
        float t = 1.0;
        if (id == 0)
        {
            vec3 _p = p;
            _p.x = fbm(p);
            _p.z = fbm(p);
            t = fbm(_p * vec3(6, 1.0, 0.3));
        }
        else if (id == 1)
        {
            t = fbm(p * vec3(2.9, 0.2, 3.1));
        }
        
        vec3 color;
        if (id == 0)
        {
            color = mix(vec3(0.05), vec3(0.6, 0.5, 0.35), t);
        }
        else if (id == 1)
        {
            color = mix(vec3(0.05), vec3(3.0, 2.5, 1.65), t);
        }
        
        col = shad * color;
        col = mix(col, background, length(p) / t_max);
    }
    
    //poor man's tonemap
    float k = 1.0;
    return vec4(1.0 - exp(-col * k), 1.0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
	
    //vignette
    vec2 _uv = uv * (1. - uv);
    float vig = pow(_uv.x*_uv.y*15., 0.15);
    
    //render
    uv = 2.0 * uv - 1.0;
    uv.x *= iResolution.x/iResolution.y;
    fragColor = vig * sqrt(render(uv)); //poor man's gamma correct
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}