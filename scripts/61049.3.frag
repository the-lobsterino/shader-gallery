// GLSL Raytracer by Vincent Knauss
// WIP

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PLANE_DEPTH 2.0
#define N_SPHERES 12
#define N_POINT_LIGHTS 5
#define SHADOW_CORR 0.05
#define CAMERA_POS vec3(0, 0, 0)
#define AMBIENT 0.3
#define MAX_BOUNCE 5
#define BG_COLOR vec3(0.2, 0.2, 0.2)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Material {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float specular_power;
	float reflection;
};

struct RayCastData {
	bool hit;
	float dist;
	vec3 point;
	vec3 normal;
	Material material;
};
	
struct Sphere {
	vec3 center;
	float radius;
	Material material;
};
	
struct PointLight {
	vec3 point;
	vec3 color;
	float intensity;
};
	
struct Scene {
	Sphere spheres[N_SPHERES];
	PointLight pointLights[N_POINT_LIGHTS];
};
	
struct Ray {
	vec3 origin;
	vec3 direction;
};

float distSqr(vec3 p1, vec3 p2) {
	return dot(p1-p2, p1-p2);
}

// From The Book of Shaders
// https://thebookofshaders.com/10/
float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rand(float x) {
	return fract(sin(x) * 456567.8);
}

float prand = 0.1823456;
void srand(float x) {
	prand = x;
}

float nextRand(void) {
	prand = random(vec2(prand, rand(prand)));
	return prand;
}
	
RayCastData rayCastSphere(Ray ray, Sphere sphere) {
	RayCastData data;
	data.hit = false;
	
	vec3 o = ray.origin-sphere.center;
	
	float b = 2.*dot(o, ray.direction), c = dot(o, o) - sphere.radius*sphere.radius;
	
	float t;
	if(4.*c <= b*b) {
		data.hit = true;
		float disc = sqrt(b*b - 4.*c);
		float t1 = (-b + disc)/2., t2 = (-b - disc)/2.;
		if(t1 >= 0.) {
			if(t2 >= 0.) t = min(t1, t2);
			else t = t1;
		} else {
			if(t2 >= 0.) t = t2;
			else data.hit = false;
		}
	}
	
	if(data.hit) {
		data.dist = t;
		data.point = ray.origin + t*ray.direction;
		data.normal = normalize(data.point - sphere.center);
		data.material = sphere.material;
	}
	
	return data;
}

vec3 rayCastScene(Ray ray, Scene scene) {
	
	vec3 out_color = vec3(1, 1, 1);
	float contribution = 1.0;
	
	for(int bounce = 0; bounce < MAX_BOUNCE; bounce++) {
		RayCastData bestHit, castData, occlusionHit;
		bestHit.hit = false;
		
		for(int i = 0; i < N_SPHERES; i++) {
			castData = rayCastSphere(ray, scene.spheres[i]);
			if(castData.hit && (!bestHit.hit || castData.dist < bestHit.dist)) bestHit = castData;
		}
		
		if(!bestHit.hit) {
			out_color = (1.0-contribution) * out_color + contribution * out_color * BG_COLOR;
		} else {
			vec3 color = AMBIENT * bestHit.material.ambient;
			for(int i = 0; i < N_POINT_LIGHTS; i++) {
				occlusionHit.hit = false;
				Ray occlusionRay;
				occlusionRay.direction = scene.pointLights[i].point - bestHit.point;
				float maxDist = length(occlusionRay.direction);
				occlusionRay.direction /= maxDist;
				occlusionRay.origin = bestHit.point + SHADOW_CORR * occlusionRay.direction;
				for(int j = 0; j < N_SPHERES; j++) {
					castData = rayCastSphere(occlusionRay, scene.spheres[j]);
					if(castData.hit && castData.dist < maxDist && (!occlusionHit.hit || castData.dist < occlusionHit.dist))
						occlusionHit = castData;
				}
				if(!occlusionHit.hit) {
					float attenuation = maxDist*maxDist;
					float f_diffuse = clamp(dot(bestHit.normal, occlusionRay.direction), 0.0, 1.0);
					float f_specular = pow(clamp(-dot(reflect(occlusionRay.direction, bestHit.normal), ray.direction), 0.0, 1.0), bestHit.material.specular_power);
					vec3 lightColor = scene.pointLights[i].color * scene.pointLights[i].intensity / attenuation;
					color += f_diffuse * lightColor * bestHit.material.diffuse + f_specular * lightColor * bestHit.material.specular;
				}
			}
			out_color = (1.0-contribution) * out_color + contribution * out_color * color;
			if(bestHit.material.reflection > 0.) {
				ray.direction = reflect(ray.direction, bestHit.normal);
				ray.origin = bestHit.point + ray.direction * SHADOW_CORR;
				contribution = 0.0;
				continue;
			}
			
		}
		break;
	}
	
	
	return out_color;
}




void main( void ) {
	
	vec2 screenCoord = (gl_FragCoord.xy - 0.5 * resolution.xy) / (0.5 * min(resolution.x, resolution.y));
	
	vec2 mouseCoord = (mouse.xy - vec2(0.5, 0.5));
	
	Ray ray;
	ray.direction = normalize(vec3(screenCoord, -PLANE_DEPTH));
	ray.origin = CAMERA_POS;
	ray.origin.z += 50. * log(200. * max(dot(mouseCoord.xy, mouseCoord.xy), 0.003));
	
	// initialize scene
	Scene scene;
	
	for(int i = 0; i < N_SPHERES; i++) {
		scene.spheres[i].center = vec3(30. * (nextRand() - 0.5) + 20. * cos(time * nextRand()), 30. * (nextRand() - 0.5), 30. * (nextRand() - 0.5));
		scene.spheres[i].radius = 0.5 + 5.0 * nextRand();
		scene.spheres[i].material.ambient = vec3(nextRand(), nextRand(), nextRand());
		scene.spheres[i].material.diffuse = vec3(nextRand(), nextRand(), nextRand());
		scene.spheres[i].material.specular = vec3(0.8, 0.8, 0.8);
		scene.spheres[i].material.specular_power = 10. + 100. * nextRand();
	}
	
	for(int i = 0; i < N_POINT_LIGHTS; i++) {
		scene.pointLights[i].point = vec3(50. * (nextRand() - 0.5), 50. * (nextRand() - 0.5), 50. * (nextRand() - 0.5));
		scene.pointLights[i].color = vec3(0.5, 0.5, 0.5) + 0.5 * vec3(nextRand(), nextRand(), nextRand());
		scene.pointLights[i].intensity = 25.0 + 45.0 * nextRand();
	}
	
	for(int i = 0; i < N_POINT_LIGHTS; i++) {
		
	}
	
	gl_FragColor = vec4(rayCastScene(ray, scene), 1.0);

}