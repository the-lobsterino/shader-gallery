#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 reyboard;

mat2 rotate2D(float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}
//_________________________
float snow(vec2 uv,float scale){	
	uv+=time/scale;uv.x-=time*4./scale;
	vec2 s=floor(uv),f=fract(uv),p;
	float k=3.,d;
	p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*2.))-f;d=length(p);k=min(d,k);
	p=.1-f;
	d=length(p);
	k=min(d,k);
	k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
    	return k;
}
vec3 f_make_snow(vec2 uv){
	uv.x+=sin(time*0.05);
	vec3 finalColor=vec3(1.);
	float c=smoothstep(1.,0.3,clamp(uv.y*.03+.9,0.,.90));	
	c+=snow(uv,2.);
	c+=snow(uv,2.3);
	c+=snow(uv,2.4);
	c+=snow(uv,2.5);
	finalColor=(vec3(c, 1.*c, 4.*c));
return  finalColor;
}
//usage:
//vec2 uv=4.*(gl_FragCoord.xy/resolution.xy)*vec2(-2.,1.);
//gl_FragColor = vec4(f_make_snow(uv),1);
//_________________________

mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float hash(float n){return fract(sin(n)*43758.5453);}

float noise( in vec2 x )
{
	vec2 p = floor(x);
	vec2 f = fract(x);
    //	f = f*f*(3.0-2.0*f);
    	float n = p.x + p.y*57.0;
    	float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
    	return res;
}

float fbm( vec2 p )
{
    	float f = 0.0;
    	f += 0.50000*noise( p ); p = m*p*2.02;
    	//f += 0.25000*noise( p ); p = m*p*2.03;
    	//f += 0.12500*noise( p ); p = m*p*2.01;
    	//f += 0.06250*noise( p ); p = m*p*2.04;
    	f += 0.03125*noise( p );
    	return f/0.984375;
}

vec3 thing(vec2 pos) 
{
	float offset = 0.;
	float row = floor((pos.y)/1.0);
	if (mod(row, 2.0) < 1.0)
		offset = 0.5;
	
	vec2 p = pos;
	p.x += offset;
	float n1 = fbm(pos * 5.0);
	pos.x=fract(pos.x + offset +.5)-0.5;
	pos.y=fract(pos.y+.5)-0.5;
	pos = abs(pos);
	float r = length(pos );
   	float a = atan(pos.y, pos.x);
	float b = atan(pos.x, pos.y);
	float n2 = fbm(pos) * (a * b);
	float n3 = n1 * 0.25 / n2 * 0.75;
	float s = (min(pos.x,pos.y)-0.25) / length(pos) / sqrt(pos.x * pos.y) * 0.0125 - n3;
	vec3 color = vec3(mix(s, 1.-n1, 0.5));
	color = mix(color, fbm(p*0.024) * vec3(0.5487,.3,.24781), 0.35);
	color -= vec3(0.687,.743,.645781) * fbm(p * 25.) * 0.3;
	return color;
}

const float NUM_SIDES = 7.0; // set your favorite mirror factor here
const float PI = 3.14159265359;
const float KA = PI / NUM_SIDES;


//_______________________PUT HERE MAGIC NUMBERS______________________
float magicnumber1=0.29;
float magicnumber2=0.38;
//__________________________________________________________________

void smallKoleidoscope(inout vec2 uv)
{
  float angle = abs (mod (atan (uv.y, uv.x), 2.0 * KA) - KA) + 0.1*time;
  uv = length(uv) * vec2(cos(angle), sin(angle));
}
void main(void) 
{
	vec2 p=16.* ( gl_FragCoord.xy / resolution );
	p.x *= resolution.x / resolution.y;
	p.x+=time;
	vec3 dist = thing(p)+0.75;
	vec3 col=vec3(0.5,0.5,1.0);
	gl_FragColor += vec4(dist*col, 1.0 );
	
smallKoleidoscope(p);
vec3 p2 = vec3 (p, magicnumber1);
  for (int i = 0; i < 44; i++)
    p2.xzy = vec3(1.3,0.999,0.678)*(abs((abs(p2)/dot(p2,p2)-vec3(1.0,1.02,magicnumber2*0.4))));
  
vec2 uv=4.*(gl_FragCoord.xy/resolution.xy)*vec2(-2.,1.);
mat2 m = rotate2D(length(uv*1.)*.005);
if(time>6.)uv*=m;
gl_FragColor += vec4(f_make_snow(uv),-1.+time);
gl_FragColor += vec4(0.1*p2,1.0);
}