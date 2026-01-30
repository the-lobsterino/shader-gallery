/*
 * Original shader from: https://www.shadertoy.com/view/XsS3RV
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
const vec4 iMouse = vec4(0.0);

// --------[ Original ShaderToy begins here ]---------- //
#define NB_ITER 36
#define TAO 6.28
#define MAX_DIST 50.
#define PRECISION .03
#define PI 3.14159265359

//#define ANAGLYPH

#ifdef ANAGLYPH
   #define KALEIDO 4
#else
   #define KALEIDO 5
   #define ANTIALIASING
#endif

const float AA = 3.; // Anti-Aliasing Level

const vec2 V01 = vec2(0,1);
const vec2 Ve = V01.yx*.001;
vec3 L = normalize(vec3(10.25,.33,-.7));
float CA = 0., SA = 0., CB = 0., SB = 0., CA3 = 0., CA4 = 0.;
	
float Kaleido(inout vec2 v){
	float id = floor(.5+atan(v.x,-v.y)*24./TAO);
	float a = id*TAO/24.;
//	float ca = cos(a), sa = sin(a);
//	v *= mat2(ca,sa,-sa,ca);
    v = cos(a)*v + sin(a)*vec2(v.y, -v.x);
	return id;
}

vec2 Kaleido2(inout vec3 p, in float d) {
	p.z+=d;	
	return vec2(Kaleido(p.yx), Kaleido(p.xz));
}

vec4 DE(vec3 z) {
	float d = min(-z.z+1.+CA3, -z.x+1.+CA3);
	float k=1., scale = 2.+ .8*CA4;
	mat2 m2 = mat2(CB,SB,-SB,CB);
	vec2 id;
	float dd = 2.; //1.+.5*CA4;
	z.z-=dd*scale;
	for(int i=0;i<KALEIDO;i++) {
		id = Kaleido2(z,dd*scale);
		z*=scale;
		z.xy*=m2;
		k*=scale;
	}
	id/=10.;
	return vec4(max(-d,(length(z)-1.)/k),id.x, id.y,0);
}

vec3 N(vec3 p) {
	return normalize(vec3(DE(p+Ve.xyy).x-DE(p-Ve.xyy).x,DE(p+Ve.yxy).x-DE(p-Ve.yxy).x,DE(p+Ve.yyx).x-DE(p-Ve.yyx).x));
}

float calcAO(in vec3 pos, in vec3 nor) {
    float hr=.01, ao=.0, sca=1.;
    for(int aoi=0; aoi<5; aoi++) {
        ao += -(DE(nor * hr + pos).x-hr)*sca;
        sca *= 2.7;
        hr += 5.;
    }
    return clamp(1.-4.*ao, 0., 1.);
}

vec3 Render(in vec3 p, in vec3 rd, in float t, in vec3 c) {
	vec3 col = mix(vec3(1.,1.,1.),vec3(0,.8,1), c.x) * 
			   mix(vec3(1.,1.,1.),vec3(0,.8,1), c.y);
	col*=col;
	vec3 nor = N(p);
	vec3 sunLight = L;
	float   ao = calcAO(p, nor ),
		    amb = clamp(.5+.5*nor.y, .0, 1.),
            dif = clamp(dot( nor, sunLight ), 0., 1.),
            bac = clamp(dot( nor, normalize(vec3(-sunLight.x,0.,-sunLight.z))), 0., 1.)*clamp( 1.0-p.y,0.0,1.0);

	vec3 brdf = ao*ao*.5*(amb*vec3(.10,.11,.13) + bac*.15) + 1.2*dif*vec3(1.,.9,.7);

	col = col*(.1+brdf );
	return sqrt(col);
}


mat3 lookat(in vec3 ro, in vec3 up){
	vec3 fw=normalize(ro);
	vec3 rt=normalize(cross(fw,up));
	return mat3(rt, cross(rt,fw),fw);
}

vec2 fCoord = vec2(0.);
vec3 RD(in vec3 ro, in vec3 cp) {
	return lookat(cp-ro, V01.yxx)*normalize(vec3((2.*fCoord-iResolution.xy)/iResolution.y, 12.0));
}

vec3 RD_Anaglyph(inout vec3 ro, in vec3 cp, in int i) {
    mat3 basis = lookat(cp-ro, V01.yxx);
    ro += .5*basis[0]*(2.*float(i)-1.);
	return RD(ro,cp); //basis*normalize(vec3((2.*fragCoord-iResolution.xy)/iResolution.y, 12.0));;
}
	
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	float time = 10.+iTime*.3;
	CA = cos(time);
	SA = sin(time);
	CB = cos(time*3.);
	SB = sin(time*3.);
	
	//vec2 m = clamp(iMouse.xy/iResolution.xy,0.,1.);
    vec2 m = vec2(.65,.6); //5);
	if( iMouse.z>0.0 ) m = iMouse.xy/iResolution.xy;
    
	vec3 ro = 30.*vec3((CA)*(.5+.8*cos(10.*m.x)), -1.5*sin(10.*m.x), (SA)*(.5+.8*cos(10.*m.x)));
	vec3 cp = V01.xxx;
	vec3 ctot = vec3(.1,.1,.1);

	CA3 = cos(2.*time);
	CA4 = cos(1.35*time);
	
#ifdef ANTIALIASING 
	for (float i=0.;i<AA;i++) {
		fCoord = fragCoord.xy+.4*vec2(cos(6.28*i/AA),sin(6.28*i/AA));	
#else 
	#ifdef ANAGLYPH
	for (int i=0;i<2;i++) {
    #endif
	fCoord = fragCoord.xy;	
#endif
        
#ifdef ANAGLYPH        
	vec3 rd = RD_Anaglyph(ro, cp, i);
#else
	vec3 rd = RD(ro, cp);
#endif        
	// Ray marching
	vec4 res = vec4(1);
	float t=16.0;
	for(int k=0;k<NB_ITER;k++){
		if(res.x<PRECISION|| t>MAX_DIST)continue;
		res=DE(ro+rd*t);
		t += res.x;
	}

	// Render colors
	vec3 col = vec3(.22,.26,.28);
	if(t<MAX_DIST){// if we hit a surface color it
		col = Render(ro + rd*t, rd,t, DE(ro+rd*t).yzw);
	}
#ifdef ANAGLYPH
    float ccc = (col.r+col.g+col.b)*.25;    
	ctot += (i==0)? vec3(ccc*1.2,0,0):vec3(0,ccc,ccc);
#else
	ctot += col;
#endif
	
#ifdef ANTIALIASING 		
    }
	ctot /=AA;
#else 
	#ifdef ANAGLYPH
    }
    #endif        
#endif 		
    vec2 q = fragCoord.xy/iResolution.xy;
	ctot *= pow(16.0*q.x*q.y*(1.-q.x)*(1.-q.y),.3);
	fragColor = vec4(ctot,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}