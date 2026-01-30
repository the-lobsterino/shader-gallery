 // Original shader from: https://www.shadertoy.com/view/tdVyWw
#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
//
///Por jorge flores P. -18-oct-2020
/// This shader is the first in 2d, there are some functions of other users
/// from the great Shadertoy community, thanks for sharing your ideas !!!!
///----------------
///Este shader es el primero en 2d, existe algunas funciones de otros usuarios
///de la grande comunidad shadertoy, gracias por compartir sus ideas!!!!

#define saturate(x) clamp(x, 0.0, 1.0)
#define R iResolution.xy
#define ss(a, b, t) smoothstep(a, b, t)
#define SS(U) smoothstep(3./R.y,0.,U)



float box(vec2 p, vec2 b)
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float circ(vec2 p, float r)
{
    return length(p)-r;
}


vec4 mountains(vec2 uv)
{
    uv.y -= .12;
    
    
    vec3 col = vec3(0.0);
    vec3 col2 =vec3(0.0);
     //vec3 col = texture(iChannel0, uv*16.).xyz;
    
    float a = 0.;
    float snow = 0.;
    
    for(float i = 0.; i < 1.; i++){ 
        uv.x += iTime*.35;
        
        //float ht = texture(iChannel0, uv*16.).x;
        float ht =0.5;
        
        float nse = cos(uv.x*14. + i*345.)*.01 + cos(uv.x*44. + i*123.)*.003
            + cos(uv.x*2. + i*654.)*.01;
        
        vec2 p = uv + nse;
        float t = (1.3-i*.02)*p.x*.8 + i*9.;
        float h = .06*asin(sin(6.*t + 2.5*i)*0.999);
        float c = ss(.104,.1, p.y - h - i*.01 + .02);
    	a = mix(a, 1., c);
        
        
        //vec3 col2 = texture(iChannel0, uv*0.125).xyz;
        
    	col = mix(col, mix(vec3(.2, .23, .3),1.3*vec3(0.13, 0.26, 0.18),i), c);
        //col = mix(col, mix(col2,1.3*vec3(0.13, 0.26, 0.18),i), c);
        
        col +=ht*.06;
    	snow = ss(.66, .674, (uv.y + 0.522)+nse*1.84);
    	col = mix(col, vec3(3), snow);   //pico de colina
        
        
    }
    return vec4(col, a);
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    vec3 col=vec3(0.2,0.478,1.13);
     vec2 p = (2.*fragCoord-iResolution.xy)/iResolution.y;
    //float w = cos(p.y + p.x - iTime + cos(p.x * 2.14 + 4.2 * p.y));
    ///p *= 1. + (.03 - .03 * w);

    vec2 ap= abs(p);
    p.y-=.25;
    vec2 mp = vec2(abs(p.x),p.y);
    
      // Mountains
    vec4 mnt = mountains(p);
    col = mix(col, mnt.rgb, mnt.a);
    p.x+=1.0*sin(iTime); ///mover vehiculo
    
    float sp11A = circ(p-vec2(.23,-.27),.165);
    float sdb1=box( p-vec2(0.0,0.0), vec2(0.4,0.2)); //grande bloque
    float sdb2=box( p-vec2(-0.25,0.12), vec2(0.1,0.06)); //ladrillos
    float sdb3=box( p-vec2( 0.0,0.12), vec2(0.1,0.06));
    float sdb4=box( p-vec2( 0.25,0.12), vec2(0.1,0.06));
    
    float sdb5=box( p-vec2( 0.25,-0.1), vec2(0.1,0.06));
    float sdb5h1=box( p-vec2( 0.26,-0.05), vec2(0.09,0.01));
    float sdb5v1=box( p-vec2( 0.16,-0.1), vec2(0.01,0.06));
    
    float sdb5h2=box( p-vec2( 0.26,-0.155), vec2(0.08,0.005));
    float sdb5v2=box( p-vec2( 0.34,-0.11), vec2(0.01,0.036));
    
    
    float sp11=circ(p-vec2(.23,-.27),.045);
    
    float sp12A = circ(p-vec2(-0.23,-.27),.165);
    float sp12=   circ(p-vec2(-0.23,-.27),.045);
    
    
    //piso 
    float sdb6=box( p-vec2( 0.0,-0.45), vec2(2.9,0.016));

        
    sdb1 = SS(sdb1);
    sdb2 = SS(sdb2);
    sdb3 = SS(sdb3);
    sdb4 = SS(sdb4);
    
    sp11A = SS(sp11A);
    sp11 = SS(sp11);
    
    sp12A= SS(sp12A);
    sp12 = SS(sp12);
    
    
    sdb5 = SS(sdb5);
    sdb5h1 = SS(sdb5h1);
    sdb5v1 = SS(sdb5v1);
    
    sdb5h2 = SS(sdb5h2);
    sdb5v2 = SS(sdb5v2);
    
    sdb6 = SS(sdb6);
    
    
   // l1= SS(l1);    
    
    //vehiculo
    col = mix(col, vec3(0.2,0.8,0.3), sp11A);// rueda
    col = mix(col, vec3(1.0), sdb1);
    col = mix(col, vec3(1.0,0.1,0.2), sdb2);
    col = mix(col, vec3(1.0,0.1,0.2), sdb3);
    col = mix(col, vec3(1.0,0.1,0.2), sdb4);
    
    //ladrillo
    col = mix(col, vec3(0.6,0.6,0.6), sdb5);
    col = mix(col, vec3(0.8,0.8,0.8), sdb5h1);
    col = mix(col, vec3(0.8,0.8,0.8), sdb5v1);
    col = mix(col, vec3(0.7,0.7,0.7), sdb5h2);
    col = mix(col, vec3(0.7,0.7,0.7), sdb5v2);
    
    //rueda
    //col = mix(col, vec3(0.2,0.8,0.3), sp11A);  //rueda
    col = mix(col, vec3(0.5,0.5,0.2), sp11);
    
    col = mix(col, vec3(0.2,0.8,0.3), sp12A);
    col = mix(col, vec3(0.5,0.5,0.2), sp12);
    
    
    col = mix(col, vec3(0.5,0.5,0.2), sdb6);
    
 
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}