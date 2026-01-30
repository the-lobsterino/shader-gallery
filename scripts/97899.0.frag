
precision highp float;
 
 
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;
 
 
#define iResolution resol()
#define res resolution
#define iTime time
#define iMouse mouse
 
 
vec2 resol() {
    return resolution/1.55;
}
 
 
 
 
mat2 roti(float a) {
    float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}
 
//---------------------------------------------------------------
 
// This content is under the MIT License.

float hash(float p)
{
    p*=1234.5678;
    p = fract(p * .1031);
    p *= p + 33.33;
    return fract(2.*p*p);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


#define tim iTime*.02
#define fxrand floor(time*.2)
#define hash1 hash(fxrand)
#define hash2 hash(fxrand+.1)
#define hash3 hash(fxrand+.2)
#define hash4 hash(fxrand+.3)

#define width .005
float zoom = .18;

float shape=0.;
vec3 color=vec3(0.),randcol;

mat2 rot(float a){
    float c=cos(a);
    float s=sin(a);
    return mat2(c,s,-s,c);
}


void formula(vec2 z) {
	float minit=0.;
	float o,ot2,ot=ot2=1000.;
	for (int i=0; i<10; i++) {
		z=abs(z)/clamp(dot(z,z),hash2*.25,.5)-vec2(2.+hash2*2.,2.+hash3*2.);
		float l=length(z);
		o=min(max(abs(min(z.x,z.y)),-l+.25),abs(l-.25));
		ot=min(ot,o);
		ot2=min(l*.1,ot2);
		minit=max(minit,float(i)*(1.-abs(sign(ot-o))));
	}
	minit+=1.;
	float w=width*minit*2.;
	float circ=pow(max(0.,w-ot2)/w,8.);
	shape+=max(pow(max(0.,w-ot)/w,.25),circ);
	vec3 col=hsv2rgb(vec3(hash3,.3,.7));
	color+=col*(.4+mod(minit/9.-tim*10.+ot2*2.,1.)*1.6);
	color+=vec3(1.,.7,.3)*circ*(10.-minit)*3.;
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 pos = fragCoord.xy / iResolution.xy - .5;
	pos.x*=iResolution.x/iResolution.y;
	vec2 uv=pos;
	float sph = length(uv); sph = sqrt(1. - sph*sph)*1.5; 
	uv=normalize(vec3(uv,sph)).xy;
	float a=tim;
	vec2 luv=uv;
	float b=a*5.48535;
	uv*=mat2(cos(b),sin(b),-sin(b),cos(b));
	uv+=vec2(sin(a),cos(a*.5))*8.;
	uv+=1.5;
	uv*=zoom;
	float pix=.5/iResolution.x*zoom/sph;
	//float c=1.5+hash1*2.;
	for (int aa=0; aa<4; aa++) {
		vec2 aauv=floor(vec2(float(aa)/6.,mod(float(aa),6.)));
		formula(uv+aauv*pix);
	}
	shape/=4.; color/=4.;
	vec3 colo=mix(vec3(.15),color,shape)*(1.-length(pos));	
	colo*=vec3(1.2,1.1,1.0)*1.3;
	fragColor = vec4(colo,1.0);
}

//---------------------------------------------------------------
 
 
 
void main(void)
{
    vec2 uv = gl_FragCoord.xy/resolution.xy-.5;
    float ap=resolution.x/resolution.y;
    ap=1.;
    uv.x*=ap;
    uv*=1.55;
    uv+=vec2(-.07,.17);
    vec3 col=vec3(0.);
    vec4 fragColor=vec4(0);
    if ((uv.x<.5*ap&&uv.x>-.5*ap&&uv.y<.5&&uv.y>-.5)) {
        mainImage(fragColor,(uv+=.5)*iResolution);       
        col = fragColor.rgb;
    } else {
        uv*=.02;
        mainImage(fragColor,(uv+=.5)*iResolution);       
        col = fragColor.rgb;
        
    }
    gl_FragColor = vec4(col,1);
}

