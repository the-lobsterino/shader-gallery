precision highp float;
uniform vec2 mouse,resolution;
#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))
#define D(u,v,w) k=length(p.xy);p.x=k*abs(sin(1.86*atan(p.y/1.02,max(0.,p.x+v)))-u);p.y=k-w		
#define E(u,v,w) k=length(u);u.x=k*(mod(sin(1./(.1+u.y*8.)),6./v)-3./v);u.y=k-w	
#define F(u,v,w) k=length(u);u.x=k*(mod(atan(u.y,u.x),6.4/v)-3.2/v);u.y=k-w
#define LY(u,v) ((u.y<0.&&v.y<u.y)||(v.y>=0.&&v.y>=u.y)) 

void main( void ) {
	vec3 rd=normalize(vec3((gl_FragCoord.xy-.5*resolution)/resolution.y,1)),q0=vec3(0,0,-44),p,p0=q0,q,r;
	float dp=1.,dq=1.,k,mx=mouse.x*3.+3.6,my=mouse.y+2.2;
	for (float i=1.; i<60.; i++) {
		p=p0; q=q0;
		if(dp>=.001) { //head
			p.xz*=rot(mx); p.xy*=rot(my); p.xy+=vec2(0,8); r=p;
			for (int i = 0; i < 2; i++) {
				D(.75,12.,7.);
				E(p.xz,4.,3.2);	
				E(p.xy,24.,4.2);		
			}
			dp = dot(abs(p), normalize(vec3(-4,3,2.6))) - 1.; 
			if (dp < .1 && LY(p0,q0)) { 
				float h=sin(i/4.); 
				if(distance(p.xy,vec2(-4,6.3))>7.1) {
					gl_FragColor=vec4(.65+.25*h,.5+.25*h,.1+.35*h,1.);
					if(length(r.xy)<2.7) gl_FragColor*=2.;
				}
				else gl_FragColor=vec4(.2+4./i,6./i,22./i,1);
			}
		}
		if(dq>=.001) { //beak
			q.xz*=rot(mx); q.xy*=rot(my); q.xy+=vec2(10,6);
			q.x=length(q); if(q.y>0.) {q.y-=2.+2.*sin(my*13.); q.x=length(q)+2.;}
			dq = (abs(q.x)+abs(q.y)+abs(q.z))/1.73 - 8.5; 
			if (dq < .1 && LY(q0,p0)) { float h=-.27+.5+.5*sin(log(i*4.)*3.); gl_FragColor=vec4(h);}
		}
 
		if(dp<.001 && dq<.001) break;	
		if(dp>=.001) p0 += rd * dp/2.;	
		if(dq>=.001) q0 += rd * dq/2.;	
	}
}