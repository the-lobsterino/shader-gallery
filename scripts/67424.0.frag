/*
 * Original shader from: https://www.shadertoy.com/view/ttBfDD
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution vec3(resolution,1.)

// --------[ Original ShaderToy begins here ]---------- //
void mainImage(out vec4 O, in vec2 C) {
    float i=1.,h=0.,e,s,k;
    for(int ii=1;ii<99;++ii){
        vec3 R=iResolution,
        p=h*normalize(vec3((C-.5*R.xy)/R.y,1))+vec3(0,1,iTime);
		s=2.;
        p=abs(mod(p-1.,2.)-1.)-1.;
        for(int j=0;j<12;++j)
            p=1.-abs(p-1.),
            p=p*(k=-1./dot(p,p))-vec3(.1,sin(iTime*0.5),.1),
            s*=abs(k);
        h+=e=length(p.xz)/s;
        if(e<.003)break;
	++i;
	}
    O+=12./i-O;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}