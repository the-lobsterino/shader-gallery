/*
 * Original shader from: https://www.shadertoy.com/view/MtdyzB
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
// Plento

const float smod = 0.4; // speed multiplier

float opS( float d1, float d2 ) {return max(-d1,d2);}

float sdBox( vec3 p, vec3 b ){
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

mat2 rot(float a) {
    return mat2(cos(a), -sin(a), sin(a), cos(a));
}
vec2 rot2(vec2 k,float t){
	return vec2(cos(t) * k.x - sin(t) * k.y, sin(t) * k.x + cos(t) * k.y);
}


float map(vec3 rp)
{
   
   float p = sin(rp.z * 0.1) * 2.3;
   rp = vec3(rot2(rp.xy, p), rp.z);
    
   vec3 pos = rp - vec3(-iTime*1.6, 0.0, 4.0); 
    pos.z += iTime*2.0*smod;
   float td = 0.07;
    
   vec3 b = vec3(1.0 - td*2.0, 4.0, 3.0);
   pos = mod(pos, b) - 0.5 * b; 
  
   pos.yz *= rot(iTime*0.3);
    
   float res = sdBox( pos, vec3(0.5 - td));
    
   res = opS(sdBox(pos, vec3(0.4, 0.4, 1.1)), res);
   res = opS(sdBox(pos, vec3(1.1, 0.4, 0.4)), res);
   res = opS(sdBox(pos, vec3(0.4, 1.1, 0.4)), res);
    
   return res;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = 2.2 * vec2(fragCoord.xy - 0.5*iResolution.xy)/iResolution.y; 
   
    vec3 ro = vec3(0.0, 0.0, 10.0); 
    vec3 rd = normalize(vec3(uv,2.0));
    
    ro.z += iTime * 8.0 * smod; 
    
    float t = 0.0;
    float d = 0.0;
    
    // glow stuff
    float minDist = 999.0; 
    vec3 glowCol = vec3(0);
    
    // glow size and softness.
    float gSize = 0.14;
    float softness = 0.55;
    
    float fog = 0.0; // glow fog
    float g = 0.0;
    
    for (int i = 0; i < 75; i++)
    {
    	d = map(ro + rd * t);
        
        minDist = min(minDist, d); 
        
        if(abs(d)<0.001 || t > 25.0) 
        {
            minDist = abs(d);
            break;    
        }
        
        t += d * 0.75;
        
        // Acquire some edge color if the distance to the closest object is 
        // greater than the minimum distance to an object that the ray encountered.
        // Basically, if the ray barely misses an object, add some glow color. 
        if(d >= minDist && abs(d) > 0.15)
        {
            fog = smoothstep(0.13, 0.12, t / 160.0);
            
             glowCol += vec3(1.0, 0.0, 0.0) 
                 * smoothstep(gSize,gSize - softness, minDist) * fog ;
            
            g++;
        }
        
    }
    
    glowCol /= g;
    
    vec3 col = vec3(0);
    
    col += glowCol*12.0;
    
    col *= smoothstep(0.99, 0.05, length(uv*0.41));
    col *= smoothstep( 0.0, 0.6, length(uv));
   
    fragColor = vec4(sqrt(clamp(col, 0.0, 1.0)), 1.0);
 
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}