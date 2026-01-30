//--- putFloat ---
// by Catzpaw 2016

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//print digits
#define TEXTLINES   8.	
#define FONTHEIGHT  8.	
#define DIGITS      6.	//not a number of significant figures
float digit(vec2 p,float n){if(abs(p.x-.5)>.5||abs(p.y-.5)>.5)return 0.;float d=0.;
	if(n<0.)d=1792.;else if(n<1.)d=480599.;else if(n<2.)d=139810.;else if(n<3.)d=476951.;
	else if(n<4.)d=476999.;else if(n<5.)d=349556.;else if(n<6.)d=464711.;else if(n<7.)d=464727.;
	else if(n<8.)d=476228.;else if(n<9.)d=481111.;else if(n<10.)d=481095.;else d=2.;
	p=floor(p*vec2(4.,FONTHEIGHT));return mod(floor(d/pow(2.,p.x+(p.y*4.))),2.);}

float putInt(vec2 uv,vec2 p,float n){uv*=TEXTLINES;p+=uv;
	float c=0.,m=abs(n)<1.?2.:1.+ceil(log2(abs(n))/log2(10.)+1e-6),d=floor(p.x+m);
	if(d>0.&&d<m){float v=mod(floor(abs(n)/pow(10.,m-1.-d)),10.);c=digit(vec2(fract(p.x),p.y),v);}
	if(n<0.&&d==0.)c=digit(vec2(fract(p.x),p.y),-1.);
	return c;}

float putFract(vec2 uv,vec2 p,float n){uv*=TEXTLINES;p+=uv;n=fract(n)*pow(10.,DIGITS);n+=fract(n);
	float c=0.,m=1.+DIGITS,d=floor(p.x);
	if(d>0.&&d<=DIGITS){float v=mod(floor(n/pow(10.,m-1.-d)),10.);c=digit(vec2(fract(p.x),p.y),v);}
	if(d==0.)c=digit(vec2(fract(p.x),p.y),10.);
	return c;}

float putFloat(vec2 uv,vec2 p,float n){uv*=TEXTLINES;p+=uv;
	float c=0.,m=abs(n)<1.?2.:1.+ceil(log2(abs(n))/log2(10.)+1e-6),d=floor(p.x);
	if(d>0.&&d<m){float v=mod(floor(abs(n)/pow(10.,m-1.-d)),10.);c=digit(vec2(fract(p.x),p.y),v);}
	if(n<0.&&d==0.)c=digit(vec2(fract(p.x),p.y),-1.);if(c>0.)return c;
	float s=DIGITS-m+1.;d=floor(p.x-m);c=0.;m=1.+s;n=fract(abs(n))*pow(10.,s);n+=fract(n);
	if(d>0.&&d<=s){float v=mod(floor(n/pow(10.,m-1.-d)),10.);c=digit(vec2(fract(p.x),p.y),v);}
	if(d==0.)c=digit(vec2(fract(p.x),p.y),10.);
	return c;}

void main( void ) {
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y); 
	vec2 m=(mouse.xy*2.-1.0);
	m.x *= resolution.x/resolution.y;
	vec3 finalColor=vec3(step(abs(uv.x-m.x),0.005),0,step(abs(uv.y-m.y),0.005));

	finalColor+=vec3(putFloat(uv,vec2(5,-6),-1.234567890));
	finalColor+=vec3(putFloat(uv,vec2(5,-5),-0.1234567890));
	finalColor+=vec3(putFloat(uv,vec2(5,-4),0.1234567890));
	finalColor+=vec3(putFloat(uv,vec2(5,-3),1.234567890));
	finalColor+=vec3(putFloat(uv,vec2(5,-2),12.34567890));
	finalColor+=vec3(putFloat(uv,vec2(5,-1),123.4567890));
	finalColor+=vec3(putFloat(uv,vec2(5,0),1234.567890));
	finalColor+=vec3(putFloat(uv,vec2(5,1),12345.67890));
	finalColor+=vec3(putFloat(uv,vec2(5,2),123456.7890));
	finalColor+=vec3(putFloat(uv,vec2(5,3),1234567.890));
	finalColor+=vec3(putFloat(uv,vec2(5,4),12345678.90));
	finalColor+=vec3(putFloat(uv,vec2(5,5),123456789.0));

	finalColor+=vec3(putInt(uv,vec2(1,6),m.x*1000.))*vec3(1,1,0);
	finalColor+=vec3(putFract(uv,vec2(1,6),abs(m.y)))*vec3(0,1,1);
	finalColor+=vec3(putFloat(uv,vec2(9,7),m.x));
	finalColor+=vec3(putFloat(uv,vec2(-1,7),m.y));

	gl_FragColor = vec4(finalColor,1);
}
