#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define EPS 0.0001

vec2 m=(mouse-vec2(0.5))*4.;

float checker(vec2 p, float s){
	return mod(floor(s*p.x) + floor(s*p.y), 2.0)*0.5+0.5;
}

bool approx(in float a, in float b){
	return (abs(a-b)<EPS);
}

float iSphere(in vec3 ro, in vec3 rd, in vec3 pos, in float rad){
	float r=rad;
	vec3 offset=ro - pos;
	float b = 2.*dot(offset, rd);
	float c = dot(offset, offset) - r*r;
	float h = b*b-4.0*c;
	
	if(h<0.){
		return -1.;
	}
	
	float t = (-b - sqrt(h))/2.;
	
	return t;
}

vec3 nSphere(in vec3 iPos, in vec3 sPos, in float r){
	return (iPos-sPos)/r;
}

float iPlane(in vec3 ro, in vec3 rd){
	return -ro.y/rd.y;
}



float intersect(in vec3 ro, in vec3 rd, out vec3 pos, out vec3 norm){
	pos = vec3(0.);
	float dis = 99999.;
	norm = vec3(-1);
	float id = -1.;
	float sph = iSphere(ro,rd, vec3(0.,1.,0.), 0.5);
	float pla = iPlane(ro,rd);
	
	if(sph>0.){
		id=1.;
		dis=sph;
		norm=nSphere(ro+dis*rd, vec3(0.,1.,0.), 0.5);
	}
	if(pla>0. && pla<dis){
		id=2.;
		dis=pla;
		norm=vec3(0.,1.,0.);
	}
	pos = ro+dis*rd;
	return id;
	
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / (0.5*resolution.xy) );
	uv-=vec2(1.);
	
	vec3 color=vec3(0.);
	
	vec3 rayOrigin = vec3(0.,1.,4.);
	vec3 rayDirection = normalize(vec3(uv,-1.));
	
	vec3 pos = vec3(0.);
	vec3 normal = vec3(-1.);
	//position is hit position and normal is hit normal
	float id=intersect(rayOrigin, rayDirection, pos, normal);
	
	if(approx(id,1.)){
		color = vec3(0.,1.,0.);
	}
	else if(approx(id,2.)){
		color = vec3(checker(pos.xz, 2.));
	}
	
	//vec3 lightPos = vec3(cos(time), 1., sin(time));	
	vec3 lightPos = vec3(m, -0.);
	vec3 lightDir = normalize(lightPos-pos);
	
	float nDotL = dot(normal, lightDir);
	
	if(nDotL>0.){
		float spec = max(dot(normalize(reflect(lightDir,normal)),rayDirection),0.);
		spec=pow(spec,1000.);

		color*=(nDotL*(4./pow(distance(pos, lightPos),2.)));
		color+=32.*spec;
		
	}
	else{
		color*=0.001;
	}
	
	vec3 shaDir = normalize(lightPos - pos);
	vec3 foo;
	
	float shadow = intersect(pos+EPS*shaDir, shaDir , foo, foo);
	if(shadow>0.){
		if(dot(normal,shaDir)<0.){
			color*=0.;
		}
	}
	
	//color=pos;
	//color*=dot(normal, normalize(vec3(m,0.)));
	
	//color*=1./distance;

		
	gl_FragColor = vec4(color , 1.0 );

}