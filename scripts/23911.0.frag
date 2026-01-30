#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotate(vec2 v, float a) {
    	return vec2(cos(a)*v.x + sin(a)*v.y, -sin(a)*v.x + cos(a)*v.y);
}

float toRad(float v){
   	return v*0.017453925;
   //return v*pi/180;
}

vec3 rotateX(vec3 inp,float angle)
{
    	float xT=inp.x,yT=inp.y,zT=inp.z;
    	float an=radians(angle);
    	return vec3(xT,yT*cos(an)-zT*sin(an),yT*sin(an)+zT*cos(an));
}

vec3 rotateY(vec3 inp,float angle){
    	float xT=inp.x,yT=inp.y,zT=inp.z;
    	float an=radians(angle);
    	return vec3(xT*cos(an)+zT*sin(an),yT,-xT*sin(an)+zT*cos(an));
}

vec3 rotateZ(vec3 inp,float angle){
    	float xT=inp.x,yT=inp.y,zT=inp.z;
    	float an=radians(angle);
    	return vec3(xT*cos(an)-yT*sin(an),xT*sin(an)+yT*cos(an),zT);
}
void main( void ) {

	vec2 quv = (2.*gl_FragCoord.xy - resolution)/max(resolution.x, resolution.y);
	
	vec2 q = ( gl_FragCoord.xy / resolution.xy );
	q.x *= resolution.x/resolution.y;
	vec2 uv = 2.0*q-1.0;
	
	uv *= 5.0;
	
	float x=uv.x,y=uv.y;
	float r = dot(uv,uv),a = atan(x,y);
	
	float t = time*10.1;
	
	float m = 19.,n1=9.0,n2=14.0,n3=11.0;
	
	float phi = a;
	float theta = a*0.5;
    	float aC = 30.,bC = 45.;
    	float aR,bR;
    	float r1,r2;
    	float t1,t2;
    	vec3 res;
   
    	t1 = abs(cos(m*phi*0.25));
    	t1 = pow(t1,n2);
    	t2 = abs(sin(m*phi*0.25));
    	t2 = pow(t2,n3);
    	r2 = pow(t1+t2,1.0/n1);
    		
    	t1 = abs(cos(m*theta*0.25));
    	t1 = pow(t1,n2);
    	t2 = abs(sin(m*theta*0.25));
    	t2 = pow(t2,n3);
    	r1 = pow(t1+t2,1.0/n1);
    		
    	if(abs(r2)==0.){
    	    	res = vec3(0,0,0);
    	}
    	else{
    	    	r1 = 1./r1;
        	r2 = 1./r2;
    		res = vec3(r1*cos(theta)*r2*cos(phi),r1*sin(theta)*r2*cos(phi),r2*sin(phi));
    	}
	
	res = rotateX(res,t);
    	res = rotateY(res,t);
    	res = rotateZ(res,t);
	vec3 f1 = vec3(cos(t),0.,-sin(t));
	vec3 f2 = vec3(sin(t),0.,cos(t));
	vec3 f3 = vec3(1.,0.,0.);
	mat3 rot = mat3(f3,f1,f2);
	res *= rot;
	
	bR = radians(bC);
    	aR = asin(tan(radians(aC)));
    	vec3 res2D;
    	res2D.x = cos(bR)*res.x-sin(bR)*res.z;
    	res2D.y = sin(aR)*sin(bR)*res.x+cos(aR)*res.y+sin(aR)*cos(bR)*res.z;
    	res2D.z = cos(aR)*sin(bR)*res.x-sin(aR)*res.y+cos(aR)*cos(bR)*res.z;
	
	//Hi can someone pls draw the res2D 3d vector. I cant find an variable to multiply with k
	//in order to show the shape rotating in 3d . Thx in advance ! :|
	
	
	//res2D *= rot;
	
	vec3 col = vec3(0.3,0.4,0.5);
	float g = 1.;
	float k = (g)*distance(res2D,vec3(0.)); 
  
    	col += abs(log(k/length(uv)));
    	col = 1.1-pow(col,.6-col);
	
		

	gl_FragColor = vec4( col, 1.0 );

}