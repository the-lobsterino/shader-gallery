/*
 * Original shader from: https://www.shadertoy.com/view/wsffRN
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
#define F(s)p.s=abs(p.s)-.3+sin(iTime*9.)*.05
void mainImage(out vec4 O, in vec2 C) {
    float g=0.,e; O-=O;
	for(float i=0.;i<80.;++i){
    	vec3 p=g*vec3(C/iResolution.y-.7,1)+vec3(0,4,iTime*5.);
    	p=mod(p,8.)-4.;
    	for(int j=0;j<3;++j)F(xy),F(yz),F(xz);
    	g+=e=length(cross(p,.2+p-p))-.02;
    	e<.01?O.xyz+=(cos(p+exp(-p*8.)))/i:p;
	}
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}