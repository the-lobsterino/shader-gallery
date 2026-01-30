#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dBox(vec3 p,vec3 s){
	return length(max(abs(p)-s,0.));
}

float smin(float a,float b,float k){
	float h = clamp(0.5+0.5*(b-a)/k,0.,1.);
	return mix(b,a,h)-k*h*(1.0-h);
}

float getDist(vec3 p){
	float d = 0.;
	float sphere = length(p-vec3(0.5,.5,-.1))-.25;
	d = dBox(p-vec3(0.,0.4,0.),vec3(.4,.2,.2));
	float d2 = dBox(p-vec3(0.,0.4,0.),vec3(.2,.4,.2));
	float planeDist = p.y;
	float res = min(d,planeDist);
	res = min(res,d2);
	res = smin(res,res,0.1);
	res = mix(res,sphere,sin(time)*.5+.5);
	res = min(res,planeDist);
	return res;
}

float rayMarch(vec3 ro,vec3 rd){
	float dO,ds;
	for(int i = 0;i<100;i++){
		vec3 p = ro+rd*dO;
		ds = getDist(p);
		dO+=ds;
		if(dO<0.001||dO>100.){
			break;
		} 
	}
	return dO;
}

vec3 getNormal(vec3 p){
	vec3 n;
	vec2 e = vec2(0.01,0.);
	float d = getDist(p);
	n = d - vec3(getDist(p-e.xyy),getDist(p-e.yxy),getDist(p-e.yyx));
	return normalize(n);
}

float light(vec3 p){
	vec3 lightPos = vec3(0.,1.,-1.2);
	//lightPos.xz+=vec2(sin(time),cos(time))*1.5;
	vec3 l = normalize(lightPos-p);
	vec3 n = getNormal(p);
	float dif = dot(l,n);
	float d = rayMarch(p+n*.1,l);
	if(d<length(lightPos-p)){
		dif*=0.2;
	}
	return dif;
	
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) -.5;
	uv.x*=resolution.x/resolution.y;
	vec3 col = vec3(0.);
	
	vec3 ro = vec3(-.0,1.0,-2.);
	//ro.xz+=vec2(cos(time),sin(time));
	vec3 lookat = vec3(0.1,0.4,0.);
	float zoom = 1.;
	vec3 f = normalize(lookat-ro);
	vec3 r = normalize(cross(vec3(0,1,0),f));
	vec3 u = cross(f,r);
	vec3 c = ro+f*zoom;
	vec3 i = c+uv.x*r+uv.y*u;
	vec3 rd = normalize(i-ro);
	float d = rayMarch(ro,rd);
	
	vec3 p = ro+rd*d;
	float dif = light(p);
	
	col += dif*vec3(.9,.5,.1);
	
	gl_FragColor = vec4(col, 1.0 );

}