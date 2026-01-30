/*
 * Original shader from: https://www.shadertoy.com/view/csVGDD
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
#define rot(a) mat2( cos( a + vec4(0,11,33,0) ) )

void mainImage( out vec4 O, vec2 u )
{
	float t = iTime, dt = .03, s,c,f;
    vec2  R = iResolution.xy,
          q = ( u+u - R ) / R.y;

    vec3 P = vec3(0), D = normalize(vec3(q,3) ), l = vec3(1), p;
    D.yz *= rot(-.15); 
    D.xz *= rot(.1*t);
    P.y += 2.;        
    P.x -= t*.4;
	
    t = 2.5;
    O *= 0.;
    for(float i = 0. ; i<12e1; i++) {
        p = P + t*D;
        if(p.y<0.)D.y = -D.y, P = p, t = .2;
        s = 1.2, f = p.y, c = (1.7-f)*(4.2-f);
        for(int ii=0;ii<20;++ii) {
                if (s >= 8e2) break;
                p.xz *= rot(1.),
                c += abs( dot(sin(p*s),l)) / s,
                f += dot(sin(p.xz*.4*s),l.xz) / s;
                s *= 1.7;
        }

        t  += dt * min(min(1.8*f,max(c,.05)),p.y+.3);
        dt *= 1.032;
        s = .5/(1.+exp(-c));
        c = 1. - min( .3* ( f>.001 ? c : s) , 1.);
        f = 1. - s;
        O = .9*O + .05* c*vec4(c*c*(f+.5*c+.2),c*.5*(f-c+3.), f, 0) *(.8 + .2*t);		
    }  
    O.rgb += f*vec3(3,4,7)*(1.-exp(-.08*t)); 
    
    O =  .5 * log(1.+O);           
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}