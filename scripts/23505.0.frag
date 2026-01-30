#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D tex;

//more splats will give better coverage near intersections
#define SPLATS 8.0
//more "gradient decent" steps fill in the surfaces
#define DESCENT 8

//total map calls = SPLATS x DESCENT x 3

bool zLess(vec2 a, vec2 b){return (a.y+a.x*20.0<b.y+b.x*20.0);}
vec2 zsort(vec2 a, vec2 b){return zLess(a.xy,b.xy)?a:b;}
vec4 zsort(vec4 a, vec4 b){return (zLess(a.xy,b.xy)?a:b);}

vec2 SphereD(vec3 po, vec3 rd){
	float b=dot(po,rd);
	if(b<0.0)return vec2(10000.0);
	float h=sqrt(abs(dot(po,po)-b*b));
	return vec2(h,b);
}

//mat2 rm=mat2(cos(0.6),sin(0.6),-sin(0.6),cos(0.6));
vec3 apple( in vec2 t )
{
     vec2 q = vec2( t.x*3.1416, acos(t.y) );
     vec3 p=vec3( cos(q.x)*sin(q.y), t.y, sin(q.x)*sin(q.y) );
	
	//if(p.y<0.0)p.y+=0.2*pow(abs(p.y),10.0)*(1.0-dot(p.xz,p.xz));
	//p.zy=p.zy*rm;
	return 0.75*p-vec3(0.0,0.125,0.0);
}
vec3 vase( in vec2 t )
{
    float q = t.x*3.1416;
	float r=0.5+0.25*sin(t.y*3.3+3.3);
    return vec3( r*cos(q), t.y*1.5+0.5, r*sin(q) );
}
vec3 quad( in vec2 t )
{
    return vec3( t.x, 0.0, t.y );
}
vec3 F(in vec2 t, in vec3 ro, in vec3 rd){
	vec3 s=apple(t),c=vase(t)+vec3(2.0,0.0,0.0),q=2.0*quad(t)+vec3(0.75,-1.0,0.0);
	vec2 sh=SphereD(s-ro,rd),ch=SphereD(c-ro,rd),qh=SphereD(q-ro,rd);
	if(zLess(sh,ch) && zLess(sh,qh))return s;
	if(zLess(ch,qh))return c;
	return q;
}

vec2 DE(in vec2 t, in vec3 ro, in vec3 rd){
	vec3 s=apple(t),c=vase(t)+vec3(2.0,0.0,0.0),q=2.0*quad(t)+vec3(0.75,-1.0,0.0);
	return zsort(SphereD(s-ro,rd),zsort(SphereD(c-ro,rd),SphereD(q-ro,rd)));
}

vec2 rnd2(vec2 c){
	return vec2(fract(sin(c.x+c.y+c.x*c.y)*415.231),fract(sin(c.x-c.y-c.x*c.x+c.y*c.y)*113.2537))*2.0-1.0;
}

mat3 lookat(vec3 fw){
	fw=normalize(fw);vec3 rt=normalize(cross(fw,vec3(0.0,1.0,0.0)));return mat3(rt,cross(rt,fw),fw);
}
void main() {
	vec3 col=texture2D(tex,gl_FragCoord.xy/resolution.xy).rgb*0.95;
	float tim=time*0.2;
	bool WATCH=false;
	if(mod(time,10.0)>5.0)WATCH=true;
	
	vec3 ro=vec3(sin(tim)*5.0,1.0+sin(tim*0.7)*0.75,cos(tim)*5.0);
	vec3 rd=lookat(vec3(1.0,0.0,0.0)-ro)*normalize(vec3((2.0*gl_FragCoord.xy-resolution.xy)/resolution.y,2.0));
	//ro=eye;rd=normalize(dir);
	vec4 d0=vec4(10000.0);
  for(float j=0.0;j<SPLATS;j++){
	vec2 t,dt,ff;
	  t=rnd2(gl_FragCoord.xy+vec2(j,j*3.1)+vec2(-time,time*3.3))*0.8;
	  dt=rnd2(gl_FragCoord.yx+vec2(j*1.3,j*5.1)+vec2(-time,time*3.3))*0.05;
	  ff=vec2(0.35,0.45);
    if(WATCH){
	t=rnd2(vec2(j,j*3.1)+vec2(-time,time*3.3))*0.8;dt=rnd2(vec2(j*1.3,j*5.1)+vec2(-time,time*3.3))*0.05;ff=vec2(0.08);
    }
	for(int i=0;i<DESCENT;i++){
		vec4 d1=vec4(DE(t,ro,rd),t);
		d0=zsort(d0,d1);
		vec2 d2=vec2(DE(t+vec2(dt.x,0.0),ro,rd).x,DE(t+vec2(0.0,dt.y),ro,rd).x);
		dt=ff*d2*clamp(dt/(vec2(d1.x)-d2),-1.0,1.0);
		t=clamp(t+dt,-1.0,1.0);
	}
  }
	
	if(d0.x<0.06){
		float dp=clamp(1.5-d0.y/5.0,0.0,1.0);
		if(dp>col.b){
			vec2 v=vec2(0.01,0.0);
			vec3 x=normalize(F(d0.zw+v.xy,ro,rd)-F(d0.zw-v.xy,ro,rd));
			vec3 y=normalize(F(d0.zw+v.yx,ro,rd)-F(d0.zw-v.yx,ro,rd));
			vec3 N=-normalize(cross(x,y));
			//vec3 L=-rd;
			
			vec3 L=normalize(vec3(0.3,0.8,0.5));
			col=vec3(0.5+0.5*dot(N,L));
			ro+=rd*(d0.y-0.1);
			rd=L;
			d0=vec4(10000.0);
  			for(float j=0.0;j<SPLATS;j++){
				vec2 t=rnd2(gl_FragCoord.xy+vec2(j,j*3.1)+vec2(-time,time*3.3))*0.8,dt=rnd2(gl_FragCoord.yx+vec2(j*1.3,j*5.1)+vec2(-time,time*3.3))*0.05,ff=vec2(0.35,0.45);
				for(int i=0;i<DESCENT;i++){
					vec4 d1=vec4(DE(t,ro,rd),t);
					if(d1.x<d0.x)d0=d1;
					//d0=zsort(d0,d1);
					vec2 d2=vec2(DE(t+vec2(dt.x,0.0),ro,rd).x,DE(t+vec2(0.0,dt.y),ro,rd).x);
					dt=ff*d2*clamp(dt/(vec2(d1.x)-d2),-1.0,1.0);
					t=clamp(t+dt,-1.0,1.0);
				}
			}
			float sh=clamp(d0.x*4.0,0.1,1.0);
			col=vec3(sh*sqrt(dp)*vec2(0.5+0.5*dot(N,L)),dp);
		}
	}
	if(col!=col)col=vec3(0.1);
	//float d=smoothstep(0.0,0.1,d0.x);
	//vec3 col=vec3(sqrt(d),d*d,d);
	gl_FragColor = vec4(col,1.0);
}
