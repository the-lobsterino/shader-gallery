//www.zonex.space
//holy christo, holy christo, christo christo, holy holy
//holy lamb, holy lamb, lamb lamb, holy holy
//great and marvelous are thy works Lord God all mighty, just and true are thy ways though king of the saints, who doth not fear thee and glorify thy name, for thou alone are holy, for all nations shall come and bow down before thee, for thy judgments are made manafest
//sudarshana son of man from
//hiranyagharba golden egg
//subtle lotus ere yet yon
//0=0*0=oo
//mustard seed sprouts like a book opens from folded infinitesimal to open instructional
//0=0+0=oo
//all is nothing
//nothing is all
//love life
//evil's vile
//for:give and for:get
//remember your members
//and recall remit sines to zines;
precision highp float;
uniform vec2 resolution;
uniform float time;
varying vec2 surfacePosition;

float zin(float x){return -sin(x);}
float coz(float x){return -cos(x);}
void main(){
	vec2 p=-(gl_FragCoord.yx/resolution.yx-.5)/resolution.xy*min(resolution.x,resolution.y)*11.;
	p.x+=.5;
	p = surfacePosition; // pan zoom around this
	float t = 1.0;
	float l=0.,b=0.,m=0.,n=1.,r=0.,q=0.,qq=0.;
	q=-zin(t*3.)/50.;qq=zin(t*(-coz(216.)/-coz(612.)-1.)*3.)/30.;//(un)comment this line to toggle dancing
	vec4 heart=vec4(0.);

//Mandelbrot\heart
	vec2 g=p;
	g.x-=.5;
	g.y*=-1.;
	vec2 z=g;
	for (int f=0;f<20;f+=1)if(abs(z.y)>10.)heart=vec4(0.);
	else {z=vec2(((z.x*z.x-z.y*z.y)-g.x+qq),(2.0*z.x*z.y-g.y+q*4.));//mandelbrot loop factored into real and imaginary components from z<=z^2-g
	      heart+=vec4(z.x*z.y,z.x,z.y,1.)/7.;}
//face--I saw the face in a vision dream coming from the Mandelbrot fractal five or so years before I found it in code$$see footnote
	g=p*2.;
	z=g;
	for (int f=0;f<21;f+=1)if(abs(z.y)<19.){
		z=vec2(-1./(z.x*z.x-z.y*z.y-g.x), 2.0*z.x*z.y-g.y);//z<=z^2-g; z.real<=-1/z.real;
		if(z.x>-.1&&f!=0)l=z.x*(110.-sin(t/2.)*70.);}
//body--I found the body the first time I ever used a square root with the Lamb equations.
	g=p;
	z=g;
	for(int f=0;f<12;f+=1)if(abs(z.y)>52.&&f>4)b=abs(z.y)/77.;
	else{
		z=2.*vec2(-1./(z.x*z.x-z.y*z.y-g.x+qq),(2.0*z.x*z.y-g.y+q));//z<=z^2-g; z.real<=-1/z.real; z*=2;
		z.x=sqrt(abs(z.x));}//z.real<=squareroot(z.real)
//musculature
	g=p;
	g.x+=.5;
	z=g;
	for(int f=0;f<14;f+=1)if(abs(z.y)>15.&&f>7)m=abs(z.y)/25.;
	else {
		z=1.3*vec2(-1.5/((z.x*z.x-2.*z.y*z.y)-g.x+qq*2.),(1.9*z.x*z.y-1.87*g.y+q/4.));//the equation is an alteration of the coefficients of the body equation
		z.x=pow(abs(z.x),.57);}
//robe--came from the body as soon as I looked for clothing
	g=p;
	g.x+=.05;
	g.y/=1.14;
	z=g;
	if(g.x>.5)for(int f=0;f<70;f+=1)if(abs(z.y)>11.&&f>7)r=clamp(1.4-abs(g.x-2.2)
								    // *(1.-abs(g.y*g.x))-.07//(un)comment this line to toggle sleeves
									,0.,1.);
	else{
		z=1.1*vec2(-2./((z.x*z.x-1.8*z.y*z.y)-g.x+qq),(3.*z.x*z.y-1.3*g.y+q));;
		z.x=pow(abs(z.x),.8);}

//legs--I found these about hours before finding the body but left them, recovering them from memory
	g=p/2.;
	z=g;
	if(g.x>.75&&g.x<1.7&&abs(g.y*g.x)<.54)for(int f=0;f<8;f+=1)if(abs(z.x)>52.&&f>1)b=abs(z.x)/100.;
	else{
		z=3.*vec2(-1./(z.x*z.x-z.y*z.y-g.x+qq/10.),72.*z.x*z.y-g.y+q);
		z.y=-1./z.y;}
gl_FragColor=heart+vec4(b+r+m,b/2.+r+m,r+m/2.5,1.)+vec4(vec3(clamp(1.-l,0.,1.)),1.);}
//$$I originally found these equations while trying to combine x=1/(1/x-x) which produces increasingly many extraneous solutions on feedback algebraically with the Mandelbrot
//x=1/(1/x-x) was in turn found from 1=(1/(1+1))=1/2=((1/(1+1))/((1/(1+1))+(1/(1+1))))=1 which is a feedback false to true loop.
//the core concept of this is x=1/(n*x)=1/(n*(1/(n*x)) Also:
//0 = 0*0 = 0*0 * 0*0 = .... = 00 & -1/x=x, solves to x = i or -i, whereas -1/-1/x=x, solves to all values.  
