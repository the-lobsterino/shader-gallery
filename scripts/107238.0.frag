/*
 * Original shader from: https://www.shadertoy.com/view/3ds3R2
 */

// SEX ROOM

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy globals
float iTime = 0.0;
vec3  iResolution = vec3(0.0);
const vec4  iMouse = vec4(0.0);

// --------[ Original ShaderToy begins here ]---------- //
//Ethan Alexander Shulman 2019

float orgy(vec2 p) {
	float pl=0., expsmo=0.;
	float t=sin(time*20.);
	float a=-.35+t*.02;
	p*=mat2(cos(a),sin(a),-sin(a),cos(a));
	p=p*.07+vec2(.728,-.565)+t*.017+vec2(0.,t*.014);
	for (int i=0; i<13; i++) {
		p.x=abs(p.x);
		p=p*2.+vec2(-2.,.85)-t*.04;
		p/=min(dot(p,p),1.06);  
		float l=length(p*p);
		expsmo+=exp(-1.2/abs(l-pl));
		pl=l;
	}
	return expsmo;
}

#define point vec3(sin(iTime*.6)*3.,cos(iTime*.7)*2.+2.,0.)
vec3 dogpoo(vec3 pos,vec2 off,float zm)
{
	vec2 p = pos.zx*0.5;
	p+=off;
	p = clamp(p*zm,-1.0,1.0);
	float o=clamp(orgy(p)*.07,.3,1.); o=pow(o,1.8);
	vec3 col=vec3(o*.8,o*o*.87,o*o*o*.9);
	float hole=length(p+vec2(.1,0.05))-.25;
	col*=clamp(pow(abs(1.-max(0.,hole)),80.),0.0,1.0);
	return col;
}

vec3 rotateY(vec3 p, float a)
{
  float sa = sin(a);
  float ca = cos(a);
  return vec3(ca * p.x + sa * p.z, p.y, -sa * p.x + ca * p.z);
}

void mainImage(out vec4 o, in vec2 u)
{
    //ray position & direction
    vec3 rp = vec3(0.,0.,-10.),
        rd = normalize(vec3((u*2.-iResolution.xy)/iResolution.x,1.)),
        l = vec3(0.);
    
    //planar reflections on x and y plane
    vec3 reflPos, nrm;
    float reflDst = (rp.y-.5)/rd.y,
        reflDst2 = (rp.x+3.*sign(rd.x))/rd.x;
    if (reflDst < 0.) reflDst = 1e8;
    if (reflDst2 < 0.) reflDst2 = 1e8;
    
    float gash = 0.0;
    if (reflDst < reflDst2) {
        nrm = vec3(0,-1,0);
    }
    if (reflDst2 < reflDst) {
     	reflDst = reflDst2;
        nrm = vec3(sign(-rd.x),0.,0.);
	    gash = 1.0;
    }
    reflPos = rp+rd*reflDst;
    vec3 col = vec3(0.0);
	if (gash>0.0)
	{
		col = dogpoo(reflPos.yzz,vec2(2.0+sin(iTime*0.8)*0.5,-0.6),0.4);
	}
	else
	{
		vec3 pp = rotateY(reflPos,radians(90.0)+sin(time)*0.05);
	    col = dogpoo(pp,vec2(0.0,4.2),1.0);
	}
  
    if (reflDst < 1e8) {
        //realistic reflection vs phong
        vec3 reflDir = reflect(rd,nrm),
                lightDiff = point-reflPos,
                lightDir = normalize(lightDiff);
        if (iMouse.w > 0. && iMouse.x < u.x) {
            l += pow(max(0.,dot(lightDir,reflDir)),16.);//phong
        } else {
			//goal is cheap realistic reflection that properly handles roughness and scattering, this is just a test
            l += pow(max(0.,1.-length(lightDir-reflDir*(1.-abs(nrm)))),4.);
        }
    }
    
    l += max(0.,dot(normalize(point-rp),rd)-.999)*3e3;//point light
    o = vec4(col+l,1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iTime = time;
    iResolution = vec3(resolution, 11.0);
	
	float ss = 8.0*sin(time);
	vec2 gg = gl_FragCoord.xy;
	gg = ceil(gg / ss) * ss;
	

    mainImage(gl_FragColor, gg.xy);
}

