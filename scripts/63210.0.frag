/*
 * Original shader from: https://www.shadertoy.com/view/Mt33Dn
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
#define round(x, f) (floor((x)/(f) + 0.5) * (f))

float random(float p)
{
    return fract(52.043*sin(p*205.429));
}
float random2(float p)
{
    return random(p)*2.0-1.0;
}

// http://iquilezles.org/www/articles/smin/smin.htm
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float sign2(float x)
{
    return x<0.0 ? -1.0 : 1.0;
}

float tree(vec2 uv, float thick, float offset)
{
    float v = uv.y;
    float zoom = 1.0;
    
    v = smin(v, length(uv)-thick, 0.5);
    
    float pos = 0.0;
    for (float i=3.0 ; i<=12.0 ; i++)
    {
        float k = 0.5 / i;
        
        // render branch/cap
        if (uv.y > 1.0) v = smin(v, (length(uv-vec2(0.0,1.0))-thick)/zoom, k);
        else if (uv.y > 0.0) v = smin(v, (abs(uv.x)-thick)/zoom, k);
        
        // move down for child
        uv.y -= 1.0;
		
        pos *= 2.0;
        if (uv.x > 0.0) pos++;
        
        // rotate left/right depending on side
        float angle = 0.4 + 0.1 * random(offset + pos);
        vec2 t = vec2(cos(angle), sign2(uv.x)*sin(angle));
        uv = uv * mat2(t.x,-t.y, t.y,t.x);
        
        float scale = 1.4 + 0.1 * random(offset + pos);
        zoom *= scale;
        uv *= scale;
    }
    
    return v;
}

vec3 stars(vec2 uv)
{
    vec2 r = round(uv, 0.1);
    
    float rand = r.x*2.32 + r.y;
    
    uv -= r;
    uv.x += 0.05 * random2(rand);
    uv.y += 0.05 * random2(rand+0.541);
    
    float blink = random(rand+0.5) < 0.1 ? 0.8 + 0.2 * sin(35.0*iTime+random(rand+1.5)) : 0.0;
    float dark = random(rand+52.0) < 0.5 ? 1.0 : 0.3;
    
    return vec3(dark * max(0.0, 0.8 + blink - iResolution.y * length(uv)));
}

vec3 meteor(vec2 uv, float gtime, float delay)
{
    float seed = round(gtime, delay);
    
    float startTime = (delay - 1.5) * random(seed);
    float time = max(0.0, min(1.0, gtime-seed - startTime));
    
    vec2 start = vec2(
        random2(seed),
        0.7 + 0.3 * random(seed+0.1)
    );
    
    vec2 end = start * 0.5;
    
    uv = uv - mix(start, end, time);
    
    end = normalize(end - start);
    uv = uv * mat2(end.x, end.y, -end.y, end.x);
    uv.x *= 0.1;
    
    float alpha = 16.0 * pow(time, 2.0) * pow(time - 1.0, 2.0);
    return vec3(max(0.0, alpha - iResolution.y * length(uv)));
}

vec3 meteorstorm(vec2 uv)
{
    return
        meteor(uv, iTime, 9.5837) +
        meteor(uv, iTime + 15.3, 15.459) +
        meteor(uv, iTime + 125.0, 31.2);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 guv = (fragCoord.xy - vec2(iResolution.x*0.5, 0.0)) / iResolution.y;
    float gv = 20.0;
    float gz = 20.0;
    
    for (float i=10.0 ; i<30.0 ; i++)
    {
        vec2 uv = guv;
        uv *= 1.0;
        uv *= i;
        uv.x -= 4.0 * i;
        uv.x += iTime;
        
        float offset;
        offset = round(uv.x, 10.0);
        gv = min(gv, 4.0/i*tree(uv-vec2(offset+1.0*random2(offset),0.0), 0.15, random(offset)));
        gz = min(gz, 0.02*i+tree(uv-vec2(offset+1.0*random2(offset),0.0), 0.15, random(offset)));
    }
    
    vec3 col =
        stars(guv) +
        meteorstorm(guv) +
        mix(vec3(0.0, 0.1, 0.4), vec3(0.0, 0.0, 0.1), guv.y) +
        vec3(2.0, 0.4, 0.03) * 2.0
        	* max(0.15-guv.y*(1.4-abs(guv.x)), 0.0)
        	* clamp(1.0-40.0*(0.03-guv.y*(1.4-1.3*abs(guv.x))), 0.0, 1.0)
        +
        vec3(2.0, 0.8, 0.1) * max(2.0 - 10.0*length(vec2(guv.x, guv.y)), 0.0);
    
    col = mix(col, vec3(0.0), 100.0*(guv.y+0.005*sin(guv.x+0.1*iTime))<1.0?1.0:0.0);
    col = mix(col, vec3(0.4, 0.05, 0.0) * clamp(-gv, 0.0, 1.0), gv<0.0?1.0:0.0);
    
    float mist = max(0.0, 3.0-1.45*length(vec2(0.4*guv.x,guv.y+1.5)));
    col = mix(col, vec3(1.0), clamp(gz*mist*mist, 0.0, 1.0));
    
    fragColor = vec4(sqrt(col), 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}