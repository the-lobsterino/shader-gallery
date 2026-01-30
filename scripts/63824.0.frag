/*
 * Original shader from: https://www.shadertoy.com/view/ll2fz1
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution, 1.)

// --------[ Original ShaderToy begins here ]---------- //
/**/
//torus sdf
#define v vec3
#define r(i) length(v(0,length(t[i].xy)-1.,s[i]))-.1

void mainImage( out vec4 O, in vec2 U )
{
    v p = iTime*v(.5),
    	 F = iResolution,
         d = normalize(v((U.xy * 2.0 - F.xy) / F.y,1)),s,q,f;
    float D = 0.,
          l,
          Q;
    for (int i = 0; i < 99; i++) {
        
        F = floor(p*.5);
        f =	v(sign(sin(F.y*F.z+F.zx+.1)),1);
        s = (mod(p,2.)-1.)*f;
        
        v a = v(1,-1,0);
        mat3 t = mat3(
            s.yzx+a.xxz,
            s.zxy-a.xxz,
            s+a
        );

        l = min(min(r(0),r(1)),r(2));
		
        //position of the nearest torus
        int pos = int(r(1)<=l) + 2*int(r(2)<=l);
        q = (pos == 0) ? t[0] : (pos == 1) ? t[1] : t[2];
        
        p += d*l;
        D += l;
    }
    //coloring the truchet in a rainbow pattern
    O.xyz = (sin(((mod(F.x+F.y,2.)*2.-1.)
            *(atan(q.x,q.y)*6.+atan(q.z,length(q.xy)-1.)*f.x*f.y)*1.9+iTime*4.) //+3.14*10.0*atan(q.z,length(q.xy))
            *2.1+v(1,2,3))*0.5+0.5)
            /(D*D*.02+1.);
    
    //O.xyz = q*0.5+0.5;
    //O /= (D*D*.02+1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}