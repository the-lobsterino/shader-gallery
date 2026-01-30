/*
 * Original shader from: https://www.shadertoy.com/view/fsBGRG
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
#define ITR 100
#define PI 3.1415926

mat2 rot(float a){
	float c=cos(a);
	float s=sin(a);
	return mat2(c,-s,s,c);
}

vec2 pmod(vec2 p,float n){
	float np=PI/n;
	float r=atan(p.x,p.y)-np;
	r=mod(r,np)-np;
	return length(p)*vec2(cos(r),sin(r));
}

float julia(vec2 uv){
	int j=0;
	for(int i=0;i<ITR;i++){
		j++;
		vec2 c=vec2(-0.345,0.654);
		vec2 d=vec2(iTime*0.005,0.0);
		uv=vec2(uv.x*uv.x-uv.y*uv.y,2.0*uv.x*uv.y)+c+d;
		if(length(uv)>float(ITR)){
			break;
		}
	}
	return float(j)/float(ITR);
}



void mainImage(out vec4 fragColor,in vec2 fragCoord){
	fragColor=vec4(fragCoord.xy, fragColor.xy);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}