#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// https://www.shadertoy.com/view/Xts3RB

float df(vec4 p)
{
	p *= 0.95;
	//return .3 - max(abs(p.w),max(abs(p.x),max(abs(p.y),abs(p.z))))*3.;
	return .3-length(p * atan(p.x,p.y) / 3.14159 * 5.)*.3;
}

void main()
{
    vec4 p=vec4(gl_FragCoord.xy,0.,1.)/resolution.x-.5,r=p-p,q=r;p.y+=.25;
    q.zw-=time*.3;
    
    for (float i=1.; i>0.; i-=.01) {

        float d=0.,s=1.;

        for (int j = 0; j < 7; j++)
            r=max(r=abs(mod(q*s+1.,2.)-1.),r.yzxw),
            d=max(d,df(r)/s),
            s*=3.;

        q+=p*d;
        
        gl_FragColor = p-p+i;

        if(d<1e-5) break;
    }
    gl_FragColor.a = 1.;
}