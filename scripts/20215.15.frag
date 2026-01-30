precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define EPS 0.001
#define EPS2 vec2(EPS, 0.)
#define MAXD 32.
#define MAXITER 96
#define STEPM 1.

vec3 dummy;

//hack to keep it simple
//xyz is color and w is distance
vec4 opMin(float d1, float d2, vec3 c1, vec3 c2){
	if(d1<d2){
		return vec4(c1, d1);
	}
	else{
		return vec4(c2, d2);
	}
}

//max(d1, -d2)
vec4 opMax(float d1, float d2, vec3 c1, vec3 c2){
	if(d1 > d2){
		return vec4(c1, d1);
	}
	else{
		return vec4(c2, d2);
	}
}

vec4 opMix(float d1, float d2, vec3 c1, vec3 c2, float t){
	return vec4(mix(c1, c2, t), mix(d1, d2, t));
}
//thanks iq
float sphere(vec3 p, float r){
	return length(p) - r;
}

float box(vec3 p, vec3 b){
	vec3 d = abs(p) - b;
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float planeY(vec3 p, float r){
	return (p.y-r) + 0.1*sin(8.*p.x) * sin(8.*p.z);
}

float scene(vec3 p, out vec3 c){
	vec4 obj = vec4(0.,0.,0.,9999999.);
	obj = vec4(0.2, 0.6, 0.8, planeY(p, -1.2));
	obj = opMin(obj.w, box(p + vec3(-0.8, .8 + 0.5*sin(time),-2.), vec3(0.5)), obj.xyz, vec3(1.,0.,0.));
	
	
	//2 cubes that morph into a sphere
	vec4 twoCubes = opMin(box(p + vec3(1., 1., -1.), vec3(0.2)),
			      box(p + vec3(2., 1., -1), vec3(0.2)),
			      vec3(0.,0.,1.),
			      vec3(1.,0.,0.));
		 
	vec4 cSphere = opMix(sphere(p + vec3(1.5 , 1., -1), 0.5),
	      			twoCubes.w,
	      			vec3(1.,0.,1.), 
	      			twoCubes.xyz, 
			        0.5*sin(time) + 0.5);
	obj = opMin(obj.w, cSphere.w, obj.xyz, cSphere.xyz);
	
	obj = opMax(obj.w, -sphere(p + vec3(2. - 4. * mouse.x, 1.,-0. - 4.*mouse.y), 0.7), obj.xyz, vec3(0.,1.,0.));
	
	c = obj.xyz;
	return obj.w;
}

vec3 calcN(vec3 p){
    return normalize(vec3( scene(p+EPS2.xyy, dummy) - scene(p-EPS2.xyy, dummy),
                           scene(p+EPS2.yxy, dummy) - scene(p-EPS2.yxy, dummy),
                           scene(p+EPS2.xyx, dummy) - scene(p-EPS2.xyx, dummy)));
}

bool rayMarch(in vec3 rayOrigin, in vec3 rayDirection, out vec3 hitPos, out vec3 hitNormal, out vec3 hitColor){
	
	vec3 rayPos = rayOrigin;
	for(int i = 0; i < MAXITER; i++){
		float distanceToScene = STEPM*scene(rayPos, hitColor);
		rayPos += rayDirection * distanceToScene;
		
		if(distanceToScene < EPS){
			hitPos = rayPos;
			hitNormal = calcN(rayPos);
			return true;
		}
		if(distanceToScene > MAXD){		
			return false;
		}
	}
	return false;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy / resolution.xy);
	uv-=0.5;
	uv*=2.;
	uv.x*=resolution.x/resolution.y;
	
	vec3 rayOrigin = vec3(uv, 0.);
	vec3 rayDirection = normalize(vec3(uv, 1.));
	
	vec3 hitPos;
	vec3 hitNormal;
	vec3 hitColor;
	
	vec3 color = vec3(0.);
	
	if(rayMarch(rayOrigin, rayDirection, hitPos, hitNormal, hitColor)){
		vec3 lightDir = normalize(vec3(cos(time*0.2),1.,sin(time*0.2)));
		vec3 halfV = normalize(lightDir - rayDirection);
		float spec = pow(max(dot(hitNormal, halfV), 0.), 500.);
		color = hitColor * max(dot(hitNormal, lightDir), 0.1) + vec3(2.)*spec;
		
		//shadows
		if(rayMarch(hitPos + 4.*EPS*hitNormal, lightDir, dummy, dummy, dummy)){
			color*=0.5;
		}
	}
	else{
		color = vec3(0.);
	}

	gl_FragColor = vec4(color, 1.0 );
}