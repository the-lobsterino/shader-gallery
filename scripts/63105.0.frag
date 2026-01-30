/*
 * Original shader from: https://www.shadertoy.com/view/lsy3Wt
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
#define texture(s, uv, bias) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
// FastGrass
// Created by Alexey Borisov / 2016
// License: GPLv2

// v1.01 added elevation (click and move)
// v1.00 public release

#define GRASS_CONTRAST (5.5)
#define GRASS_SHADOW_CONTRAST (3.6)
#define GRASS_CONTRAST_INV (1.0 / GRASS_CONTRAST)
#define GRASS_SHADOW_CONTRAST_INV (1.0 / GRASS_SHADOW_CONTRAST)
#define GRASS_WIDTH (0.04)
#define GRASS_WIDTH_INV (1.0 / GRASS_WIDTH)
#define GRASS_BENDING_AMP 5.0
#define GRASS_BENDING_PERIOD 0.03
#define GP2 0.4317

#define MIN_HEIGHT 2.0
#define MAX_HEIGHT 4.5
#define WIND vec2(0.2, 0.1)

vec3 sundir = normalize(vec3(1.0,0.75,1.0));

float noise( in vec3 x )
{
    vec3 f = fract(x);
    vec3 p = floor(x);
    f = f * f * (3.0 - 2.0 * f);
    
    p.xz += WIND * iTime;
    vec2 uv = (p.xz + vec2(37.0, 17.0) * p.y) + f.xz;
    vec2 rg = texture(iChannel0, (uv + 0.5)/256.0, -100.0).yx;
    return mix(rg.x, rg.y, f.y);
}

float fractal_noise(vec3 p)
{
    float f = 0.0;
    // add animation
    //p = p - vec3(1.0, 1.0, 0.0) * iTime * 0.1;
    p = p * 3.0;
    f += 0.50000 * noise(p); p = 2.0 * p;
	f += 0.25000 * noise(p); p = 2.0 * p;
	f += 0.12500 * noise(p); p = 2.0 * p;
	f += 0.06250 * noise(p); p = 2.0 * p;
    f += 0.03125 * noise(p);
    
    return f;
}

float density(vec3 pos)
{    
    float den = 3.0 * fractal_noise(pos * 0.3) - 2.0 + (pos.y - MIN_HEIGHT);
    float edge = 1.0 - smoothstep(MIN_HEIGHT, MAX_HEIGHT, pos.y);
    edge *= edge;
    den *= edge;
    den = clamp(den, 0.0, 1.0);
    
    return den;
}

vec3 raymarching(vec3 ro, vec3 rd, float t, vec3 backCol)
{   
    vec4 sum = vec4(0.0);
    vec3 pos = ro + rd * t;
    for (int i = 0; i < 40; i++) {
        if (sum.a > 0.99 || 
            pos.y < (MIN_HEIGHT-1.0) || 
            pos.y > (MAX_HEIGHT+1.0)) break;
        
        float den = density(pos);
        
        if (den > 0.01) {
            float dif = clamp((den - density(pos+0.3*sundir))/0.6, 0.0, 1.0);

            vec3 lin = vec3(0.65,0.7,0.75)*1.5 + vec3(1.0, 0.6, 0.3)*dif;        
            vec4 col = vec4( mix( vec3(1.0,0.95,0.8)*1.1, vec3(0.35,0.4,0.45), den), den);
            col.rgb *= lin;

            // front to back blending    
            col.a *= 0.5;
            col.rgb *= col.a;

            sum = sum + col*(1.0 - sum.a); 
        }
        
        t += max(0.05, 0.02 * t);
        pos = ro + rd * t;
    }
    
    sum = clamp(sum, 0.0, 1.0);
    
    float h = rd.y;
    sum.rgb = mix(sum.rgb, backCol, exp(-20.*h*h) );
    
    return mix(backCol, sum.xyz, sum.a);
}

float planeIntersect( vec3 ro, vec3 rd, float plane)
{
    float h = plane - ro.y;
    return h/rd.y;
}

mat3 setCamera(vec3 ro, vec3 ta, float cr)
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void skyImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = (2.0 * fragCoord.xy - iResolution.xy) / iResolution.yy;
    vec2 mo = vec2(0.0);
    
    vec3 ro = vec3(0.0, 0.0, -2.0);
    
    // Rotate the camera
    vec3 target = vec3(ro.x+10., 1.0+mo.y*3.0, ro.z);
    
    vec2 cossin = vec2(cos(mo.x), sin(mo.x));
    mat3 rot = mat3(cossin.x, 0.0, -cossin.y,
                   	0.0, 1.0, 0.0,
                   	cossin.y, 0.0, cossin.x);
    target = rot * (target - ro) + ro;
    
    // Compute the ray
    vec3 rd = setCamera(ro, target, 0.0) * normalize(vec3(p.xy, 1.5));
    
    float dist = planeIntersect(ro, rd, MIN_HEIGHT);
    
    float sun = clamp(dot(sundir, rd), 0.0, 1.0);
	vec3 col = mix(vec3(0.78,0.78,0.7), vec3(0.3,0.4,0.5), p.y * 0.5 + 0.5);
	col += 0.5*vec3(1.0,0.5,0.1)*pow(sun, 8.0);
    
    if (dist > 0.0) {
        col = raymarching(ro, rd, dist, col);
    }
    
    fragColor = vec4(col, 1.0);
}

vec4 get_grass(vec2 uv, float seed)
{
    if (uv.y > 1.0)
        return vec4(0.0);
    else if (uv.y < 0.0)
        return vec4(1.0);
    else 
    {        
        float seed2 = seed * 11.2;
        float seed3 = seed * 3.621 - 43.32;
        float bending = abs(0.5 - fract(seed2 + uv.x * GRASS_BENDING_PERIOD * GRASS_WIDTH_INV)) - 0.25;
        uv.x += GRASS_WIDTH * GRASS_BENDING_AMP * 4.0 * uv.y * uv.y * uv.y * bending;
        float shadowX = uv.x - uv.y * (0.25 + fract(seed2) * 0.22);
        float top = 4.0 * abs(0.5 - fract(seed + uv.x * GRASS_WIDTH_INV)) * abs(0.5 - fract(seed3 + uv.x * GRASS_WIDTH_INV * GP2));
        float topB= 4.0 * abs(0.5 - fract(seed + (uv.x + 0.005) * GRASS_WIDTH_INV)) * abs(0.5 - fract(seed3 + (uv.x - 0.009) * GRASS_WIDTH_INV * GP2));
        float topR= 4.0 * abs(0.5 - fract(seed + (uv.x + 0.006) * GRASS_WIDTH_INV)) * abs(0.5 - fract(seed3 + (uv.x + 0.009) * GRASS_WIDTH_INV * GP2));
        float topS= 2.5 * abs(0.5 - fract(seed + 0.7 * (shadowX + 0.31) * GRASS_WIDTH_INV)) * abs(0.5 - fract(seed3 +  0.7 * (shadowX + 0.161) * GRASS_WIDTH_INV * GP2));
        uv.y = uv.y * uv.y;
        float alpha = GRASS_CONTRAST * (uv.y - (1.0 - GRASS_CONTRAST_INV) * top);
        float bright = GRASS_CONTRAST * (uv.y - topB);
        float bright2 = GRASS_CONTRAST * (uv.y - topR);
        float shadow = GRASS_SHADOW_CONTRAST * (uv.y - (1.0 - GRASS_SHADOW_CONTRAST_INV) * topS);
        return clamp(vec4(1.0 - alpha, bright, 1.0 - shadow, bright2), 0.0, 1.0);
    }
}

void mainImage(out vec4 result, in vec2 fragCoord)
{
    float t = iTime/5.;
    result = vec4(0, 0, 0, 1);
    fragCoord -= iResolution.xy * 0.5;
	vec2 uv = fragCoord.xy / iResolution.y;
    uv.y += 0.35 * (1. + cos(t));
    
    float elevation = 1.;//iMouse.y / iResolution.y;
    
    uv.y += 0.3 - elevation * 0.8;
    uv.y *= 1.8;
    float k = 1.0;
    
    vec3 grassColor = vec3(0.4, 0.9, 0.1);
    vec3 grassBackColor = grassColor * (0.25 + elevation * 0.2);
    vec3 grassColorR = vec3(0.6, 0.7, 0.3);
    vec3 grassShadow = grassColor * vec3(0.15, 0.2, 0.9);
    
    float pos = iTime * 3.0;
    float iPos = floor(pos);
    float fPos = fract(pos);
    
    uv.x += sin(pos * 0.3) * 0.4;
     
    //vec3 c = mix(vec3(0.53, 0.63, 0.78), vec3(0.42, 0.52, 0.65), uv.y - uv.x * 0.5);
    vec4 skycol;
    skyImage(skycol, (uv + 0.5) * iResolution.y);
    vec3 c = skycol.rgb;
    
    for (int i = 50; i >= 0; i--)
    {
        float dist = (float(i) - fPos) / (60. + 40. * cos(t));
        vec2 uv2 = uv;
        uv2 *= 0.15 + dist * 1.4;
        uv2 *= 6. + 4. * cos(t);
        uv2.y += elevation + 0.45 - dist * (0.5 + elevation);
        vec4 grass = get_grass(uv2, fract((iPos + float(i)) * 43.2423));
        vec3 color = mix(grassBackColor, grassColor, grass.y);
        color = mix(color, grassColorR, grass.w);
        color = mix(color, grassShadow, grass.z);
        if (i == 0)
            grass.x *= smoothstep(0.0, 1.0, 1.0 - fPos);
        if (i == 50)
            grass.x *= fPos;
        c = mix(c, color, grass.x);
    }
       
	result = vec4(c, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}