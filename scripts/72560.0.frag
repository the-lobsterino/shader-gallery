/*
 * Original shader from: https://www.shadertoy.com/view/7dlSWn
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
#define EPS 0.001
#define MAX_STEPS 32
#define ITR 8

mat2 rot(float a){
	float s=sin(a);
	float c=cos(a);
	return mat2(c,s,-s,c);
}



float scale;

float map(vec3 p){
	p+=vec3(1.0,1.0,iTime*0.2);
	p.xy*=rot(iTime*0.05);
	p.yz*=rot(iTime*0.05);
	float s=3.0;
	for(int i=0;i<ITR;i++){
		p=mod(p-1.0,2.0)-1.0;
		float r=1.53/dot(p,p);
		p*=r;
		s*=r;
	}
	scale=s;
	return dot(abs(p),normalize(vec3(22222222.0,2.0,1.0)))/s;
}

vec3 GetNormal(vec3 p){
	float d=map(p);
	vec2 e=vec2(EPS,0.0);

	vec3 n=d-vec3(
		map(p-e.xyy),
		map(p-e.yxy),
		map(p-e.yyx));
	return normalize(n);
}



void mainImage(out vec4 fragColor,in vec2 fragCoord){
	vec2 uv=(2.0*fragCoord.xy-iResolution.xy)/iResolution.y;

	vec3 col=vec3(0.0);

	vec3 rd=normalize(vec3(uv,1.0));
	vec3 p=vec3(0.0,0.0,iTime*0.05);
	
	float d;
	
	//vec3 normal;

	float emission=0.0;

	for(int i=0;i<MAX_STEPS;i++){
		d=map(p);
		p+=rd*d;
		//normal=GetNormal(p);
		emission+=exp(d*-0.4);
		if(d<EPS)break;
	}

	vec4 color=0.02*emission*vec4(sin(iTime),1.0,sin(iTime),1.0);
	fragColor=color;
	//fragColor=vec4(normal*0.5+0.5,1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}