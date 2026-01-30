#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

const float pi = 3.1415926535;

// of equation x^3+c1*x+c2=0
/* Stolen from http://perso.ens-lyon.fr/christophe.winisdoerffer/INTRO_NUM/NumericalRecipesinF77.pdf,
   page 179 */
float cubicRoot(float c1, float c2) {
	float q = -c1/3.;
	float r = c2/2.;
	float q3_r2 = q*q*q - r*r;
	if(q3_r2 < 0.) {
		float a = -sign(r)*pow(abs(r)+sqrt(-q3_r2),.333333);
		float b = a == 0. ? 0. : q/a;
		float x1 = a+b;
		return x1;
	}
	return 0.;
	/*float theta = acos(r/pow(q,1.5));
	float sqr_q = pow(q,.5);
	vec3(-2.*sqr_q*cos(theta/3.),
		 -2.*sqr_q*cos((theta+2.*pi)/3.),
		 -2.*sqr_q*cos((theta-2.*pi)/3.));*/
}

float arcLength(float a, float b, float x) {
	float f = .25/a;
	float h = x/2.;
	float q = length(vec2(f,h));
	return h*q/f+f*log((h+q)/f);
}

vec2 parabolaCoords(float a,float b,vec2 co) {
	float x = cubicRoot((1./a-2.*co.y+2.*b)/(2.*a),(-co.x)/(2.*a*a));
	return vec2(length(co-vec2(x,a*x*x+b)),arcLength(a,b,x));
}

float noise3(vec3 co){
  return fract(sin(dot(co ,vec3(12.9898,78.233,125.198))) * 43758.5453);
}

float smooth(float v) {
	return 3.*pow(v,2.)-2.*pow(v,3.);
}

float perlin3(vec3 p) {
	float val = 0.;
	for(float i=0.;i<3.;i += 1.){
		p *= pow(2.,i);
		vec3 c = floor(p);
		float u = smooth(fract(p.x));
		float v = smooth(fract(p.y));
		val = 1.-((1.-val)*(1.-pow(.5,i)*
			mix(mix(mix(noise3(c),noise3(c+vec3(1.,0.,0.)),u),
					mix(noise3(c+vec3(0.,1.,0.)),noise3(c+vec3(1.,1.,0)),u),v),
			    mix(mix(noise3(c+vec3(0.,0.,1.)),noise3(c+vec3(1.,0.,1.)),u),
					mix(noise3(c+vec3(0.,1.,1.)),noise3(c+vec3(1.,1.,1.)),u),v),fract(p.z))));
	}
	return val;
}

float makePoint(float x,float y,float fx,float fy,float sx,float sy,float t){
   float xx=x+sin(t*fx)*sx;
   float yy=y+cos(t*fy)*sy;
   return 1.0/sqrt(xx*xx+yy*yy);
}

vec3 gu(vec4 a,vec4 b,float f){
  return mix(a.xyz,b.xyz,(f-a.w)*(1.0/(b.w-a.w)));
}

vec3 grad(float f){
	vec4 c01=vec4(0.0,0.0,0.0,0.2);
	vec4 c02=vec4(0.15,0.0,0.0,0.45);
	vec4 c03=vec4(0.6,0.0,0.0,0.55);
	vec4 c04=vec4(0.75,0.6,0.0,0.65);
	vec4 c05=vec4(1.0,0.25,0.0,0.85);
	return (f<c02.w)?gu(c01,c02,f):
	(f<c03.w)?gu(c02,c03,f):
	(f<c04.w)?gu(c03,c04,f):
	gu(c04,c05,f);
}

void main( void ) {

   vec2 p=(gl_FragCoord.xy/resolution.x)*2.0-vec2(1.0,resolution.y/resolution.x);

   p=p*0.9;
   
   float x=p.x;
   float y=p.y;

   float a=0.0; // fix glitch noise
   a=a+makePoint(x,y,3.3,2.9,0.3,0.3,time);
   a=a+makePoint(x,y,1.9,2.0,0.4,0.4,time);
   a=a+makePoint(x,y,0.8,0.7,0.4,0.5,time);
   a=a+makePoint(x,y,2.3,0.1,0.6,0.3,time);
   a=a+makePoint(x,y,0.8,1.7,0.5,0.4,time);
   a=a+makePoint(x,y,0.3,1.0,0.4,0.4,time);
   a=a+makePoint(x,y,1.4,1.7,0.4,0.5,time);
   a=a+makePoint(x,y,1.3,2.1,0.6,0.3,time);
   a=a+makePoint(x,y,1.8,1.7,0.5,0.4,time);   
   a=a+makePoint(x,y,1.2,1.9,0.3,0.3,time);
   a=a+makePoint(x,y,0.7,2.7,0.4,0.4,time);
   a=a+makePoint(x,y,1.4,0.6,0.4,0.5,time);
   a=a+makePoint(x,y,2.6,0.4,0.6,0.3,time);
   a=a+makePoint(x,y,0.7,1.4,0.5,0.4,time);
   a=a+makePoint(x,y,0.7,1.7,0.4,0.4,time);
   a=a+makePoint(x,y,0.8,0.5,0.4,0.5,time);
   a=a+makePoint(x,y,1.4,0.9,0.6,0.3,time);
   a=a+makePoint(x,y,0.7,1.3,0.5,0.4,time);
   a=a+makePoint(x,y,3.7,0.3,0.3,0.3,time);
   a=a+makePoint(x,y,1.9,1.3,0.4,0.4,time);
   a=a+makePoint(x,y,0.8,0.9,0.4,0.5,time);
   a=a+makePoint(x,y,1.2,1.7,0.6,0.3,time);
   a=a+makePoint(x,y,0.3,0.6,0.5,0.4,time);
   a=a+makePoint(x,y,0.3,0.3,0.4,0.4,time);
   a=a+makePoint(x,y,1.4,0.8,0.4,0.5,time);
   a=a+makePoint(x,y,0.2,0.6,0.6,0.3,time);
   a=a+makePoint(x,y,1.3,0.5,0.5,0.4,time);
   
   vec3 a1=grad(a/128.0);
   float v = perlin3(vec3(a1.r,a1.g,a1.b) * (30.0 * (sin(time))));
   
   gl_FragColor = vec4(v * a1.r,v * a1.g, a1.b * v,1.0);
}