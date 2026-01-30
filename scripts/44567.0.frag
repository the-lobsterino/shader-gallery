//
precision highp float;
uniform float time;
uniform vec2 resolution;
vec3 lightPos=vec3(-0.0,0.5,10),cres,rs,rd,rdold,normold,sp;
float wasserhoehe=0.980,screenYszf=resolution.y,screenXszf=resolution.x,cellsize,amp,h1,h2,h3,h4,t0,cellx,cellz;
int level,rlevel=0,htest=1,godown=0,iters=0;
bool wentup=false;

void init(){
	cellsize=2.0;level=0; amp=1.0; h1=1.0; h2=1.0; h3=1.0; h4=1.0;  cellx=.0; cellz=.0;t0=.0;wentup=false;
}

vec3 sco,betaR=vec3(6.95e-6, 1.18e-5, 2.44e-5)*20000.0,betaMie=vec3(4e-7, 6e-7, 2.4e-6  )*20000.0,reflectance=vec3(0.04,0.1,0.9);
vec4 sunColor=vec4(.5,.5,.5,1);

vec3 shade( vec3 pos ,out vec3 ex)
{
	vec3 g=vec3(((1.0-abs(sin(time/4000.0)))  )*5000.0 );
	vec3 wDir = normalize(rd);
	vec3 posViewSpace=vec3(gl_FragCoord/999.0);
	float dist=length(rs-pos);
	ex=exp(-dist*(betaR+betaMie))*reflectance*vec3(sunColor);
	return ((1.0-betaR)*(1.0+pow(dot(normalize(lightPos-pos),wDir),2.0))+(1.0-betaMie)*g.x*pow(1.0/sqrt(g.y-g.z*dot(normalize(lightPos-pos),wDir)),3.0))*sunColor.xyz*(1.0-ex)/(betaR+betaMie)*sunColor.w*.9;
}

float coolRand(float seedx,float seedy,int level){
	if (level<6) return 0.01;                     
	float seed=float(level)+seedx+seedy+time/20000.0;
	float aa=-abs(sin(seed *sqrt(seed )));
	return aa;
}

int getQuadrant(float cellx,float cellz,float cellsize,int level){
	float c=-0.0000;
	return int(floor(mod((cellx-c)/cellsize,2.0))+floor(mod((cellz-c)/cellsize,2.0))*2.0);
}

void goUp(){
	int quadrant=getQuadrant(cellx,cellz,cellsize,level);
	float nh[4];
	float r1,r2,r3;
	bool q1=quadrant==1;
	bool q2=quadrant==2;
	bool q3=quadrant==3;
	bool q0=quadrant==0;
	cellx-=(float(q1||q3)*cellsize)*float(1-godown);
	cellz-=(float(q2||q3)*cellsize)*float(1-godown);
	r1=coolRand(cellx+cellsize*float(quadrant!=2),cellz+cellsize*float(quadrant>1),level)/amp;
	r2=coolRand(cellx+cellsize*float(quadrant>0)+cellsize*float(quadrant>2),cellz+cellsize,level)/amp;
	r3=coolRand(cellx+cellsize+cellsize*float(q1),cellz+cellsize+cellsize*float(quadrant>1),level)/amp;
	nh[0]=h2*float(q0)+h1*float(quadrant>0);
	nh[1]=h3*float(q0)+h2*float(q2)+h1*float(q3);
	nh[2]=h4*float(q0)+h3*float(q1)+h2*float(q3);
	nh[3]=h4*float(quadrant<3)+h3*float(q3);
	h1=h1*float(godown)+float(1-godown)*((nh[0]*float(quadrant<3 && quadrant>0)+nh[1]*float(q3)-r1*float(quadrant>0))*2.0+h1*float(q0)-h2*float(q1)-h3*float(q2)-h4*float(q3));
	h4=h4*float(godown)+float(1-godown)*((nh[2]*float(q0)+nh[3]*float(q1 || q2)-r3*float(quadrant<3))*2.0+h4*float(q3)-h1*float(q0)-h2*float(q1)-h3*float(q2));
	h2=h2*float(godown)+float(1-godown)*((nh[0]*float(q0)+nh[1]*float(q2)+nh[2]*float(q3)-r1*float(q0)-r2*float(quadrant>1))*(2.0+3.0*float(q2))-h1*float(q0)+h2*float(q1)-(2.0*h1+2.0*h4)*float(q2)-h4*float(q3));
	h3=h3*float(godown)+float(1-godown)*((nh[1]*float(q0)+nh[2]*float(q1)+nh[3]*float(q3)-r2*float(quadrant<2)-r3*float(q3))*(2.0+3.0*float(q1))-h1*float(q0)-(2.0*h1+2.0*h4)*float(q1)+h3*float(q2)-h4*float(q3));
	cellsize*=(                             2.0)*float(1-godown)+float(godown);
	level-=1-godown;
	amp/=2.0*float(1-godown)+float(godown);
	wentup=bool(1-godown);
}

void doCand(){
	float nh[4];
	int quadrant=getQuadrant(rs[0]+t0*rd[0],rs[2]+t0*rd[2],cellsize,level);
	float r1,r2,r3;
	bool q1=quadrant==1;
	bool q2=quadrant==2;
	bool q3=quadrant==3;
	bool q0=quadrant==0;
	r1=coolRand(cellx+cellsize*float(quadrant!=2),cellz+cellsize*float(quadrant>1),level)/amp;
	r2=coolRand(cellx+cellsize*float(quadrant>0)+cellsize*float(quadrant>2),cellz+cellsize,level)/amp;
	r3=coolRand(cellx+cellsize+cellsize*float(q1),cellz+cellsize+cellsize*float(quadrant>1),level)/amp;
	cellx+=(float(q1||q3)*cellsize)*float(godown);
	cellz+=(float(q2||q3)*cellsize)*float(godown);
	nh[0]=(h1+h2*float(quadrant<2)+h3*float(q2))/2.0+r1;
	nh[1]=(h1+(h1+h2+h4*2.0)*float(q2)+h3*float(q0)+h4*float(q3))/(2.0+3.0*float(q2))+r2*float(quadrant<3)+r1*float(q3);
	nh[2]=((h1+h4)/2.0+r3)*float(q0)+((h1*2.0+h3+h4*2.0)/5.0+r2)*float(q1)+((h2+h4)/2.0+r2)*float(q3);
	nh[3]=(h2*float(q1)+h3*float(quadrant>1)+h4)/2.0+r3;
	h1=h1*float(q0||bool(1-godown))+(nh[0]*float(q1||q2)+nh[1]*float(q3))*float(godown);
	h2=h2*float(q1||bool(1-godown))+(nh[0]*float(q0)+nh[1]*float(q2)+nh[2]*float(q3))*float(godown);
	h3=h3*float(q2||bool(1-godown))+(nh[1]*float(q0)+nh[2]*float(q1)+nh[3]*float(q3))*float(godown);
	h4=h4*float(q3||bool(1-godown))+(nh[2]*float(q0)+nh[3]*float(q1)+nh[3]*float(q2))*float(godown);
}

void castLand(){
	for(int iters=0;iters<200;iters++){
		if (level<0 || rlevel>1) break;
		float hmax=max(h1,h2);
		hmax=max(hmax,h3);
		hmax=max(hmax,h4);
		hmax=rlevel==0?max(hmax,wasserhoehe):hmax;
		float tsp=(hmax-rs[1])/rd[1];
		sp=rs+tsp*rd;
		float rheight=rs[1]+t0*rd[1];
		htest=1;
		int test=int(!(((rheight<=hmax))||((tsp>=.0)&&(sp.x>=cellx)&&(sp.z>=cellz)&&(sp.x<(cellx+cellsize))&&(sp.z<(cellz+cellsize)))));
		htest=1-test;
		godown=htest;
		float cdist=abs(length((rs-vec3(cellx,hmax,cellz))));

		if (bool(htest)&&screenXszf*cellsize/cdist<2.0||(rheight<wasserhoehe&&rlevel==0)){
			vec3 pos,norm,color;

			color=vec3(9.0,5.0,0.0)*fract(sin(dot(vec2(cellz,cellx*.9),vec2(999.0,.001)))*9.0)/9.0+.1;
			norm=cross(vec3(cellsize,h2,0)-vec3(.0,h1,.0),(vec3(.0,h3,cellsize)-vec3(.0,h1,.0)));
			pos=vec3(cellx,h1,cellz);
			norm=normalize(norm);
			cres+=(shade(norm,sp)*sp*abs(dot(norm,normalize(pos-lightPos)))*((float(-rlevel)*2.0+1.0)*2.0)+0.2)*color;
 
			return;

		}
		
		float t1,t2;
		t1=(cellx+cellsize/2.0-rs[0])/rd[0];
		t2=(cellz+cellsize/2.0-rs[2])/rd[2];
		godown=0;
		godown=int(bool(htest) && bool(1-int(wentup)));
		sp.z=rs[2]+t1*rd[2];
		sp.x=rs[0]+t2*rd[0];
		int cond=int(bool(htest) && t1<t2 && godown==0 && t0<t1 && sp.z>cellz && sp.z<cellz+cellsize );
  		t0=(t1)*float(cond)+t0*float(1-cond);
		godown=cond+godown*(1-cond);
		cond=int(bool(htest) && t1<t2 && godown==0 && t0<t2 && sp.x>cellx && sp.x<cellx+cellsize );
  		t0=(t2)*float(cond)+t0*float(1-cond);
		godown=cond+godown*(1-cond);
		cond=int(bool(htest) && t1>t2 && godown==0 && t0<t2 && sp.x>cellx && sp.x<cellx+cellsize );
  		t0=(t2)*float(cond)+t0*float(1-cond);
		godown=cond+godown*(1-cond);
		cond=int(bool(htest) && t1>t2 && godown==0 && t0<t1 && sp.z>cellz && sp.z<cellz+cellsize );
  		t0=(t1)*float(cond)+t0*float(1-cond);
		godown=cond+godown*(1-cond);
		cellsize/=(2.0)*float(godown)+float(1-godown);amp*=2.0*float(godown)+float(1-godown);level+=godown;
		wentup=bool(1-godown);
		doCand();
		goUp();
	}
	
	cres+=shade(rd,sp)*sp;
	return;
}

void main(void)
{
	init();
	sco.x=gl_FragCoord.x/screenXszf-.5;
	sco.y=gl_FragCoord.y/screenYszf-.5;
	rd=normalize(vec3(0.0,-.2,.8) + sco.y*vec3(00,1,0)+sco.x*vec3(1,0.,0));                
	rs=vec3(.3,1,.05125)+vec3(.3,0,0)*time/1000.                                       ;
	cres=vec3(0);
	castLand();
	gl_FragColor  = vec4(cres,1)/.5;
}
