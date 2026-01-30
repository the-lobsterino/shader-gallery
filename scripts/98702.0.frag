precision highp float;
uniform vec2 mouse,resolution;
uniform float time;
#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))
#define D(pp,u,v,w) k=length(pp.xy);pp.x=k*abs(sin(1.86*atan(pp.y/1.02,max(0.,pp.x+v)))-u);pp.y=k-w		
#define E(u,v,w) k=length(u);u.x=k*(mod(sin(1./(.1+u.y*8.)),6./v)-3./v);u.y=k-w	
#define LY(u,v) ((u.y<0.&&v.y<u.y)||(v.y>=0.&&v.y>=u.y))
float random(vec2 pos) {  return fract(sin(dot(pos.xy, vec2(1399.9898, 78.233))) * 43758.5453123); }

// SPEED OF EXPLOSION 0.0 - 1.0
float speed=.896; //.05; 

void main( void ) {
	vec3 rd=normalize(vec3((gl_FragCoord.xy-.5*resolution)/resolution.y,1)),q0=vec3(0,0,-60),p,p0=q0,q;
	float tt=mod(time,64.), /*speed=floor(pow(mouse.y,.125)*16.)/16.-.5,*/ dp=1.,dq=1.,k,mx=mouse.x*12.+3.6,my=mouse.y+2.2, h=max(0.,mod(tt*speed*12.,64.) -16.*speed);
	for (float i=1.; i<60.; i++) {
		p=p0; q=q0;
		if(dp>=.001) { //head
			p.xz*=rot(mx); p.xy*=rot(my); p.xy+=vec2(0,8);
			for (int i = 0; i < 2; i++) {
				p -= p *random(floor(p.xy*(p.y)/24.)*24.) *2. /sqrt(dot(p,p))*h; //   crude explosion
				D(p.xy,.75,12.,7.);
				E(p.xz,4.,3.2);	
				E(p.xy,24.,4.2);		
			}
			dp = dot(abs(p), normalize(vec3(-4,3,2.6))) - 1.; 
			if (dp < .1 && LY(p0,q0)) { float x=(1.5+.5*sin(60.-i/4.))/10.; gl_FragColor=1.-vec4(4.*x,4.*x,5.*x,0.);}
		}
		if(dq>=.001) { //beak
			q.xz*=rot(mx); q.xy*=rot(my); q.xy+=vec2(10,6);
			q.x=length(q); if(q.y>0.) {q.y-=2.+2.*sin(my*13.); q.x=length(q)+2.;}
			q.x-=h*10.;
			dq = (abs(q.x)+abs(q.y)+abs(q.z))/1.73*(1.+.4*h) - 8.5; 
			if (dq < .1 && LY(q0,p0)) { float h=-.27+.5+.5*sin(log(i*4.)*3.); gl_FragColor=vec4(h);}
		}
 
		if(dp<.001 && dq<.001) break;	
		if(dp>=.001) p0 += rd * dp/2.;	
		if(dq>=.001) q0 += rd * dq/2.;	
	}
	//if(gl_FragCoord.x<8. && gl_FragCoord.y/resolution.y<speed) gl_FragColor += vec4(.7,0,0,1);
}