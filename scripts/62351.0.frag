/*

 Necip's mutant

 * Original shader from: https://www.shadertoy.com/view/tslyRB
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
float iTime = 0.;
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //

#define pmod(p,x) mod(p,x) - 0.5*x
#define pal(a,b,c,d,e) ((a) + (b)*sin((c)*(d) + (e)))

#define rot(x) mat2(cos(x),-sin(x),sin(x),cos(x))
#define iTime (iTime*1.6)

vec4 valueNoise(vec2 t, float w){
    vec2 fr = fract(t);
	return 
        mix(
            mix( 
                texture(iChannel0,vec2(floor(t.x), floor(t.y))/256.),
                texture(iChannel0,vec2(floor(t.x), floor(t.y) + 1.)/256.),
            	smoothstep(0.,1.,fr.y)
            ),
            mix( 
                texture(iChannel0,vec2(floor(t.x) + 1.,floor(t.y))/256.),
                texture(iChannel0,vec2(floor(t.x) + 1.,floor(t.y) + 1.)/256.),
            	smoothstep(0.,1.,fr.y)
            ),
            smoothstep(0.,1.,pow(fr.x, w)));
}
vec4 fbm(vec2 uv){
	vec4 n = vec4(0);
    
    
    n += valueNoise(uv*800.,0.1);
    //n += valueNoise(uv*1000., 0.1)*0.5;
    n += valueNoise(uv*1700.,0.1)*0.5;
    
    n -= valueNoise(uv*10.,1.)*1.;
    n -= valueNoise(uv*20.,0.5)*0.5;
    
    
    n = max(n, 0.);
    return n;
}
#define pi acos(-1.)
#define rot(x) mat2(cos(x),-sin(x),sin(x),cos(x))
vec3 hsv2rgb_smooth( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

	// rgb = rgb*(3.0-2.0*rgb); // cubic smoothing	

	return c.z * mix( vec3(1.0), rgb, c.y);
}


vec3 get(vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5*iResolution.xy)/iResolution.y;
	vec2 uvn = uv;
    uv *= 1. - dot(uv,uv)*0.3;
    
    uv *= 4.;
    
    float rang = 0.2;
    
    uv -= rang*0.5;
    uv.x += iMouse.x/iResolution.y*rang;
    uv.y += iMouse.y/iResolution.y*rang;
    

    vec3 col = vec3(0);

    vec2 p = uv;
    
    
    float un = 1.;
    float T = iTime*1.;
    float fa; 
    const float its = 3.;
    
    float xx;
    float yy;
    for(float i = 0.; i < its; i++){
        
        float dpp = dot(p, p);
        dpp = clamp(dpp, 0.04,0.6);
        
        p = (p + 0.)/dpp;
        
        
        float yy=abs(sin(p.y*40. + T/1.));
        float xx=abs(sin(p.x*40. + T/1.));
        //if(dpp > 0.0 && i == 3)
        if(i == its -1.)
    		fa = exp(-min(yy,xx)*6.)*un;
        
        //p = clamp(p,-3.,3.);
        //p.x -= 0.5;
        //p *= rot(0.5*3.14);
        float f = sin(iTime*0.125*pi);
        float ff = sin(iTime*0.125*pi + pi/2.);
        
        //p.x += 0.8;
        p.x -= xx = pow(abs(f),2.5 )*sign(f)*3.5;
        p *= 1. + pow(fract(abs(ff)),5.)*0.6;

        //p.xy*= rot(floor(iTime/2.)*3.14+ pow(abs(f),20.)*fract(iTime/2.)*3.14);
        float tt = iTime*0.25;
        float ft = mod(tt, 2.);
        tt = floor(tt);
        ft = pow(smoothstep(0.,1.,pow(ft, 1.5) - 0.4), 2.25);
        p.xy *= rot((tt + ft)*pi*1.);
        //tt -= floor(mod(iTime/4., 1.));
        //p.xy*= rot(floor(tt)*3.14/2.+ pow(smoothstep(0.,1.,ft), 2.)*3.14/2.);
        //p.y -= yy = sin(iTime*0.5)*1.;
        //p.y -= yy = sin(iTime*0.5)*0.4;
        //p.y -= 0.2;
        p = clamp(p,-4.,4.);
        
        
    }
    
    
    float modD = 0.04;

    p = mix(p,sin(p*11.14 + T*1.), smoothstep(0.,1.,0. +smoothstep(0.,1.,dot(uvn,uvn)*0.9 )*0.4)*0.1);
    //p = sin(p*6. + T);
    
    
    //p = pmod(p, modD);
    
    float i = log(length(((p.xy)/modD)) + 100. + iTime*3.5);
    
    float id = floor(i*30.);
    //p = log(p);
    
    //i = iTime;
    
    //col += fract(p.yyy);
    //col -= exp(-abs(fract((i)/modD/(1. - xx*2.)) - 0.5)*40.)*0.7;
    //col -= exp(-abs(fract(2.*log(i)/modD/(1. - xx*2.)) - 0.5)*40.)*2.;
    ////col -= exp(-abs(fract(i*200.) - 12.5*modD)*4.)*0.7;
    //vec3 aa =pal(0.5,0.5,vec3(0.1,0.7,.9), 0.6 + sin(id*0.4 + iTime)*.4, id*0.9 + iTime*0.5 - dot(uvn,uvn)*.5- dot(abs(p- 0.5) ,abs(p- 0.5) )*.02);
    vec3 aa =pal(0.5,0.55,vec3(0.1,0.7,0.9), 0.6 + sin(id*0.4 + iTime)*.4, id*0.9 + iTime*0.5 - dot(uvn,uvn)*.5);
    //vec3 aa =pal(0.1,0.9,vec3(0.9,.2,0.1), 0.8 + sin(id*0.4 + iTime)*.4, id*0.9 + iTime*0.5 - dot(uvn,uvn)*0.5);
    //vec3 aa =pal(0.5,0.6,vec3(0.9,.2,0.1), 0.8 + sin(id*0.4 + iTime)*.1, id*0.9 + iTime*0.5 - dot(uv,uv)*0.1);
    //vec3 aa =pal(0.5,0.5,vec3(0.9,.2,0.1), 0.8 + sin(id*0.4 + iTime)*.4, id*0.9 + iTime*0.5 - dot(uvn,uvn)*.5);
    
    aa = max(aa, 0.);
    col += aa;
    //col += pal(0.5,.5,vec3(0.2,.9,0.6),1.,1.4 + id*1. + iTime*0.9);
    
    col = max(col, 0.);
    
    col = mix(col,smoothstep(0.,1.,col), 0.8);
    
    
    col -= fbm(uvn).x*0.01;
    col += fbm(uv + 4.).x*0.01;
    
    
    col = pow(col, vec3(1. + dot(uvn,uvn)*0.4) + pow(fa, 1.)*0.2);
    
    //col *= 1. - pow(fa, 7.)*4.;
    
    col *= 1. - dot(uvn,uvn);
    
    return col;
}
    
    


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 col = vec3(0);
    
    // float(min(iFrame,0)) hack for faster compilation (stops loop unrolling)
    for(float i =0.; i < 9.; i++){
    	col += get(fragCoord + vec2(mod(i,3.),floor(i/3.))*0.25);
    }
    col /= 9.;
    
	col = pow(col, vec3(0.4545));
    
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

#undef iTime

void main(void)
{
    iTime = time;
    mainImage(gl_FragColor, gl_FragCoord.xy);
}