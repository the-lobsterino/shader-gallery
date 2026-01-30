#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;
//eat some pi
const float pi   = 3.1415926535897932384626433832795; //pi
const float pisq = 9.8696044010893586188344909998762; //pi squared
const float picu = 31.006276680299820175476315067101; //pi cubed
const float sqpi = 1.7724538509055160272981674833411; //sqrt of pi
const float cupi = 1.4645918875615232630201425272638; //curt of pi
const float twpi = 6.283185307179586476925286766559 ; //2 x pi 
const float hfpi = 1.5707963267948966192313216916398; //0.5 x pi
const float lgpi = 0.4971498726941338543512682882909; //log pi


const int   complexity  =5; 
const float   rez      	= cupi*twpi; 
const float speed  	= 1./twpi;  

vec3 smoot(vec3 xy) 
{
	float t= xy.z+time*speed;
	float tc = (cos(t/pisq))*twpi;	
	
	vec3 p=vec3(cos(xy.x)*sin(tc+t*sqpi),sin(xy.y*cupi)*cos(tc+t),cos(lgpi*xy.x+tc)*sin(lgpi*xy.y+tc));
	vec3 q=normalize(vec3(xy.x+cos(tc*hfpi+cupi)*rez,xy.y+sin(tc*hfpi+cupi)*rez,xy.x+xy.y));
	vec3 r=normalize(vec3(xy.x+cos(tc*hfpi)*rez*lgpi,xy.y+sin(tc*sqpi)*rez*lgpi,sin(tc+twpi)+cos(tc+twpi)));
	p = normalize((p+q+r));
	
  	for(int i=1;i<complexity+1;i++)
  	{
    		vec3 newp=p;
    		newp.x+=cos(p.x*q.z)+sin(p.y)*(cos(float(i)*lgpi));
    		newp.y+=sin(p.y*q.z)+cos(p.x)*(sin(float(i)*lgpi));;
    		newp.z+=sqrt((sin(p.z*p.z)+cos((q.y*q.x)+tc)+sin(p.z+float(i)/pi)));
		p = newp;
		
		q += cos(sqrt(p)*pi)+0.5;
		r += (normalize(q)/pi)+((q*float(i)/(pi*pi))*pi)+0.5;
  	}
	q = normalize((q+r));
	float d = cos((q.x+q.y+q.z)*pi)*0.5+0.5;
	p=(((cos(p))))*pi;
	vec3 col=(vec3((sin(p.x)*0.5+0.5)*d,((sin(p.y)*cos(p.z))*0.5+0.5)*d,(cos(p.z+p.y)*0.5+0.5)*d));

	//col=vec3(d,d,d);
	//if(length(xy)>4.) col=normalize(col*(q*0.5+0.5));
	return col;
	
}
#define MAX_ITERATION 300
#define SCALE .006967816248445938
#define CENTER vec2(-.7439073267881252, .10225932384607081)
#define BAILOUT 3.
#define EXTRA_ITER 4

#define DEFAULT_COLOR vec3(.0, .0, .0)
#define COLOR_WIDTH .04
#define BRIGHTNESS -0.3
#define CONTRAST 1.5

void Z_n(inout vec2 Z, vec2 C) {
	float xtemp = Z.x * Z.x - Z.y * Z.y + C.x;
	Z.y = 2. * Z.x * Z.y + C.y;
	Z.x = xtemp;
}

float colorBand(float x, float start, float width) {
	return (cos(x * width + start) / 2. + 0.5 + BRIGHTNESS) * CONTRAST;
}

vec3 computeColor(float x) {
	float r = colorBand(x, 2.0943951023931953, COLOR_WIDTH); // 2PI/3
	float g = colorBand(x, 3.141592653589793, COLOR_WIDTH); // PI
	float b = colorBand(x, 4.1887902047863905, COLOR_WIDTH); // 4PI/3
	return vec3(r, g, b);
}

void main( void ) {
	vec2 C = SCALE * surfacePosition + CENTER;
	vec2 Z = vec2(0., 0.);
	
	vec3 color = DEFAULT_COLOR;
	
	for (int i = 0; i < MAX_ITERATION; i++) {
		Z_n(Z, C);
		if (length(Z) >= BAILOUT) {
			for (int j = 0; j < EXTRA_ITER; j++) {
				Z_n(Z, C);
			}
			float density = float(i + EXTRA_ITER) - log2(log(length(Z)) / log(BAILOUT));
			color = smoot(computeColor(density));
			break;
		}
	}
	
	gl_FragColor = vec4(color, 1.);
}