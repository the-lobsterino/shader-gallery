#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

int obj;

float distFunc(vec3 p,vec3 r){
	float b=length(max(abs(p)-vec3(min(.2-r.y,.1),1,min(.2-r.y,.1)),0.));
	float y=dot(p+vec3(0.,.4,0.),vec3(0,1,0));
	if(b>y){
		obj=0;
		return y;
	}else{
		obj=1;
		return b;
	}
}
vec3 getNormal(vec3 p,vec3 r){
	float d=0.0001;
	return normalize(vec3(
		distFunc(p+vec3(d,0.,0.),r)-distFunc(p+vec3(-d,0.,0.),r),
		distFunc(p+vec3(0.,d,0.),r)-distFunc(p+vec3(0.,-d,0.),r),
		distFunc(p+vec3(0.,0.,d),r)-distFunc(p+vec3(0.,0.,-d),r)
	));
}

void main(){
	vec2 p=(gl_FragCoord.xy*2.-resolution)/resolution.x;
	float time = time + p.x*16. + p.y*2.;
	vec3 camP=vec3(3.*sin(time),0.,3.*cos(time));
	vec3 camC=vec3(0.,0.,0.);
	vec3 camU=normalize(vec3(0.,1.,0.));
	vec3 camS=cross(normalize(camC-camP),camU);
	vec3 ray=normalize(camS*p.x+camU*p.y+(camC-camP));
	
	float dist=0.;
	float rayL=0.;
	vec3  rayP=camP;
	for(int i=0;i<99;i++){
		dist=distFunc(rayP,ray);
		rayL+=dist;
		rayP=camP+ray*rayL;
	}
	
	if(abs(dist)<0.001){
		if(obj==0){
			float frag=dot(-ray,getNormal(rayP,ray));
			gl_FragColor=vec4(vec3(frag)*vec3(.8,.8,1.)*5./rayL,1.);
		}else{
			float frag=dot(-ray,getNormal(rayP,ray));
			gl_FragColor=vec4(vec3(frag)*9./pow(rayL,2.),1.);
		}
	}else{
		gl_FragColor=vec4(.2,.2,.3,1.);
	}
}