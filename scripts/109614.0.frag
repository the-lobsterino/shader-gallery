#ifdef GL_ES
precision mediump float;
#endif
  
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
//#define pi 3.141592653589793


 //eat some pi
const float pi   = 3.141592653589793238462622433832795; //pi
const float pisq = 9.8696044010893586188344909998762; //pi squared
const float picu = 31.006276680299820175476315067101; //pi cubed
const float sqpi = 1.7724538509055160272981674833411; //sqrt of pi
const float cupi = 1.4645918875615232630201425272638; //curt of pi
const float twpi = 6.283185307179586476925286766559 ; //2 x pi 
const float hfpi = 1.5707963267948966192313216916398; //0.5 x pi
const float lgpi = 0.4971498726941338543512682882909; //log pi
const float GEAR_PHASE = 0.0958;
const vec3 GEAR_COLOR = vec3(217.0 / 255.0, 128.0 / 255.0, 48.0 / 255.0);
const int   complexity  =1; 
const float   rez      	= cupi*twpi; 
const float speed  	= 5./twpi;  

// gearified by vahokif

vec2 clog(vec2 v)
{
  return vec2(0.5*log(v.x*v.x+v.y*v.y),atan(-v.y,v.x));
}



vec4 gear(vec2 uv, float dir, float phase) {
	vec2 p = uv - 0.5;
	
	float r = length(p);
	float t = fract(time * 0.2);
	t *= 2.0 * pi / 6.0;
	float a = atan(p.y, p.x) + (phase + t) * dir;
	float e = 0.198 + clamp(sin(a * 6.0) * 0.13, 0.0, 0.1);
	
	if (r < e) {
		return vec4(GEAR_COLOR * (0.6 + e - r), 1.0);
	}
	else {
		return vec4(0.0);
	}
}

vec4 gears(vec2 uv) {
	vec4 c1 = gear(uv, 1.0, 0.0);
	vec4 c2 = gear(vec2(fract(uv.x + 0.5), uv.y), -1.0, GEAR_PHASE);
	vec4 c3 = gear(vec2(uv.x, fract(uv.y + 0.5)), -1.0, GEAR_PHASE);
	
	return c1 * c1.a + c2 * c2.a + c3 * c3.a;
}

varying vec2 surfacePosition;
uniform sampler2D lastFrame;

#define surfacePosition (surfacePosition*3e2)
void main()
{
  vec2 position=2.0*((2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y));
 
  float p1=3.0;
  float p2=4.0;
  //float p2=cos(time);
  float u_corner=2.0*pi*p2;
  float v_corner=log(256.0)*p1;
  float diag=sqrt(u_corner*u_corner+v_corner*v_corner);
  float sin_a=v_corner/diag;
  float cos_a=u_corner/diag;
  float scale=diag/2.0/pi;
 
  float offset=1.0;
 
  vec2 p=clog(position+vec2(offset,0))-clog(position+vec2(-offset,0));
 
  vec2 rotated=vec2(p.x*cos_a-p.y*sin_a,p.x*sin_a+p.y*cos_a);
  vec2 scaled=rotated*scale/vec2(log(2.0),2.0*pi);
  vec2 translated = scaled;
  translated.x -= (time*0.05); // simple fix
 
  vec4 gearCol = gears(fract(translated*2.0)) * mix(0.4, 0.7, length(scaled));
	
  gl_FragColor = gearCol * gearCol.a + vec4((1.0 - gearCol.a) * mix(0.1, 0.2, length(scaled)) * GEAR_COLOR, 0.0);
	#define T2(X,Y) texture2D(lastFrame, fract((gl_FragCoord.xy+vec2(X,Y)-2.*surfacePosition)/resolution))
	gl_FragColor = max(gl_FragColor, (vec4(0)
		+T2(-1,-1)	+T2(-1,0)	+T2(-1,1)
		+T2(0,-1)	-T2(0,0)		+T2(0,1)
		+T2(1,-1)	+T2(1,0)		+T2(1,1)
		)/7. - 3./(256.));
}