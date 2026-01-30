/*
 * Original shader from: https://www.shadertoy.com/view/3ddcD2
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
/////////////////////////////////////////////////////////////
////       ...  🌟 🌬️ Cosmic Heaven 🌫️ 🌌 ...             ////
/////////////////////////////////////////////////////////////
// Brasil/Amazonas/Manaus
// Created by Rodrigo Cal (twitter: @rmmcal)🧙🧞
// - Started: 2020/10 - Published: 2020/10
// - https://www.shadertoy.com/view/Ws3yzS
/////////////////////////////////////////////////////////////
// -----------------------------------------------------------
//
//  🌟 🌬️ Cosmic Heaven 🌫️ 🌌
//  
//	Pass: Cosmo 
//  
//      ... @rmmcal 2020/10 
//  
// -----------------------------------------------------------
/////////////////////////////////////////////////////////////
//

float dist(vec3 p){
    p *= 1.;
    float g =  abs(sin(p.x)*cos(p.y)+sin(p.y)*cos(p.z)+sin(p.z)*cos(p.x))-cos(p.z*2.-fract(iTime)*3.1415926*2.)/120.;
	float d =  1.4-g+(p.y)+(-p.z*.1);
	
    vec3 ctv = cos(p*21.+iTime*3.);
    d += .1*( smoothstep(-1.0,1.5, .5 - abs(ctv.x + ctv.y + ctv.z)) ) ;
    d = 10.-abs(d);
    p.y +=7.0;

    float t = abs(fract(iTime*.1)*2.-1.)*2.;
    t*=t; t*=t; t*=t;
    p *= .1;
	float d2 = 1.6-abs(sin(p.x)*cos(p.y)+sin(p.y)*cos(p.z)+sin(p.z)*cos(p.x))-cos(p.z*2.-fract(iTime)*3.1415926*2.)/120.;
    
    d = max(d,mix(d,d2,sin(iTime*.1)));
    return d;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float t = (iTime);
    vec2 aspectRatio = vec2(1., iResolution.y/iResolution.x);
	vec2 uv = fragCoord/iResolution.xy; 
    vec2 p = (uv-.5)*aspectRatio;

    vec3 cpos = vec3(0.0,0.0,-20.0);
    vec3 cdir = vec3(0.0,0.0,  0.0);
    
    cpos += vec3(t/3.,0.0,(cos(t*.04)*81.)) * clamp(pow(t*.2,8.),0.,1.);
    vec3 bpos = cpos;
    vec3 ray = vec3(sin(p.xy)*(1.+sin(t*.1)*clamp((t-30.)*0.1, 0., 1.)),.5);
   
    vec3 g,b;
    for (int i = 0; i < 250; i++) {
        float d = dist(cpos);
        if (d > .01)   b += vec3(0.,1.,0.)/(d*1000.);
		d = max(d,.01);
        cpos += ray*d;
        if (d < 0.01) break;
        if (d > 128.) break;
        g += vec3(.5,0.4,1.)*(min(1./1., d)/25.)/ max(0.4, (cpos.z-bpos.z-20.)*.2);
    }

    vec3 col = g;
    col += b*smoothstep(-80.,40., -cpos.z)*.2;
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}