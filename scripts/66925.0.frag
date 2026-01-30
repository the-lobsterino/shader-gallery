/*
 * Original shader from: https://www.shadertoy.com/view/Wlsfzs
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

// Emulate some GLSL ES 3.x
int int_mod(int a, int b)
{
    return (a - (b * (a/b)));
}

// --------[ Original ShaderToy begins here ]---------- //
#define rot(a)mat2(cos(a),sin(a),-sin(a),cos(a))

float map(vec3 p)
{
	p.xz*=rot(iTime*.5);
	p.xy*=rot(iTime*.5);
	float s=2.,r2;
	p=abs(p);
    for(int i=0; i<12;i++){
		p=1.-abs(p-1.);
        if(fract(iTime*.5)<.7){
            r2=1.2/dot(p,p);
        }else{
            r2=(int_mod(i,3)==1)?1.3:1.3/dot(p,p);
        }
    	p*=r2;
    	s*=r2;
	}
	return length(cross(p,normalize(vec3(1))))/s-0.003;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv=(2.*fragCoord-iResolution.xy)/iResolution.y;
  	vec3 ro=vec3(
        mix(8.,3.,sin(iTime*.2+.3*sin(iTime*.5))*.5+.5),
        mix(-.5,.5,cos(iTime*.1+.5*cos(iTime*.7))*.5+.5),
        0);
  	vec3 w=normalize(-ro);
  	vec3 u=normalize(cross(w,vec3(0,1,0)));
  	vec3 rd=mat3(u,cross(u,w),w)*normalize(vec3(uv,2));
    vec3 p;
    float h=0.,d,i=1.;
	for(int ii=1;ii<120;ii++)
    {
    	p=ro+rd*h;    
		d=map(p);
    	if(d<.0001)break;
    	h+=d;
        i++;
	}
    fragColor.xyz=30.*vec3(cos(p*.8)*.5+.5)/i;
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}