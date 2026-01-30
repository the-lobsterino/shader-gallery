/*
 * Original shader from: https://www.shadertoy.com/view/ctjSR3
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define time iTime

// fonction de rotation
mat2 rot(float a)
{
    float ca = cos(a);
    float sa = sin(a);
    return mat2(ca, sa, -sa, ca);
}

float box(vec3 p, vec3 s)
{
    p = abs(p) - s;
    return max(p.x, max(p.y, p.z) );
}

float map(vec3 p)
{
    for(float i=0.0; i<8.0; ++i) {
    
    p.xz *= rot(time*0.5);
    p.xy *= rot(time*0.3);
    p=abs(p)-1.2;
    }
    // box
    //float d = box(p, vec3(1.0));
    
    // sphere
    float d = length(p) - 1.0;
    
    return d;
}

vec3 norm(vec3 p, float dur)
{
    float centre = map(p);
    float decal_x = map(p - vec3(dur, 0,   0) );
    float decal_y = map(p - vec3(0,   dur, 0) );
    float decal_z = map(p - vec3(0,   0,   dur) );
    vec3 diff = centre - vec3(decal_x, decal_y, decal_z);
    return normalize(diff);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-iResolution.xy*0.5);
    uv /= iResolution.y; 

    vec3 col = vec3(0);

    // Raymarching loop
    vec3 p = vec3(0,0,-70);
    
    //p.x += sin(time)*3.0;
    
    float focale = 3.0;
    vec3 r = normalize( vec3(uv, focale) );
    
    vec3 light = vec3(1,3,-2);
    light.xz *= rot(time);
    light.xy *= rot(time*0.3);
    //light.x += sin(time)*5.0;
    light = normalize(light);
    
    for(float i=0.0; i<100.0; ++i)
    {
        float d = map(p);
        if(d < 0.001) {
                       
            break;
        }
        
        p += r * d;        
        
    }
    
  
  /*  float depth = length(p - start);
    float fog = clamp(1.0 - depth/100.0, 0.0 , 1.0);
    col *= pow(fog, 2.01);
    col += (1.0-pow(fog,*/
    
    vec3 n = norm(p, 0.01);
            vec3 h = normalize(light - r);
            
            float lambert = max(0.0, dot(n, light) );
            float spec = max(0.0, dot(n,h));
            
            float fresnel = 1.0 - abs(dot(n,r));
            
            vec3 diffuse =  vec3(0.4,0.5,1.0);
           col += lambert * diffuse;
            
            col += lambert * pow(spec, 10.0) * diffuse;
            col += pow(spec, 10.0);
            
            col += pow(fresnel,1.2) * vec3(0.4,0.6,1.0);
            
            //tone mapping
            col = smoothstep(0.0,1.0,col);
            
//gamma
col= pow(col, vec3(0.4545));

    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}