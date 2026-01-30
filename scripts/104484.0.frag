/*
 * Original shader from: https://www.shadertoy.com/view/7dtBR7
 */



#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution,1.)

// --------[ Original ShaderToy begins here ]---------- //
#define R(p,a,t) mix(a*dot(p,a),p,cos(t))+sin(t)*dot(p,a)
#define H(h) (cos((h)*6.3+vec3(0,23,21))*.5+.5)

void mainImage(out vec4 O, vec2 C)
{
    vec3 p=iResolution;
	    vec3 r=iResolution;
		    vec3 c=vec3(0);
			    vec3 uv=(vec3((gl_FragCoord.xy-.5*r.xy)/r.y,.27));
	
	uv=uv/uv.z;
    float s,e,g=0.,t=iTime;
	for(float i=0.;i<90.;i++){
        p=R(g*uv,vec3(0.),0.);
        p.z+=t*.5;
        p=asin(.7*sin(p));
        s=2.5+sin(.5*t+3.*sin(t*2.))*.5;
        for(int i=0;i<6;i++) {
            p=abs(p),
            p=p.x<p.y?p.zxy:p.zyx,
            s*=e=2.;
            p=p*e-vec3(3,2.5,3.5);
        }
        g+=e=abs(length(p.xz)-.3)/s+2e-5;
	    c+=mix(vec3(1),H(p.z*.5+t*.1),.4)*.02/exp(.5*i*i*e);
	}
	c*=c;
    O=vec4(c,1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}