// SURFACE TENSION
// by @A10_AtmoSphere

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159;

// smoothing min
float smoothMin(float d1, float d2, float k){
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

// struct for ray marching
struct Ray {
	vec3 pos;
	vec3 dir;
};

// sphere DistanceFunction
float sphereDF(vec3 ray, vec3 pos, float radius) {
	return distance(ray, pos) - radius;
}

// distance function
float distanceFunction(vec3 ray) {
	float modt = mod(time*2.0, 20.0)-10.0;
	vec3 pos1 = vec3(modt, 4.0 - pow(modt+3.0,2.0)/4.0, 0.0);
	float sphere1 = sphereDF(ray, pos1, 1.0);
	vec3 pos2 = vec3(0.0, modt - pow(modt,2.0)/4.0, 0.0);
	float sphere2 = sphereDF(ray, pos2, 1.0);
	return smoothMin(sphere1, sphere2, 1.0);
}

vec3 getNormal(vec3 p) {
  const float d = 0.001;
  return normalize(vec3
		   (distanceFunction(p+vec3(d,0.0,0.0))-distanceFunction(p+vec3(-d,0.0,0.0)),
		    distanceFunction(p+vec3(0.0,d,0.0))-distanceFunction(p+vec3(0.0,-d,0.0)),
		    distanceFunction(p+vec3(0.0,0.0,d))-distanceFunction(p+vec3(0.0,0.0,-d))
		   ));
}

void main( void ) {
	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y; // 2D position on the screen
	vec3 fragcolor; // output pixel color
	vec3 cam = vec3(0.0, 0.0, -5.0); // 3D camera position
	vec3 lightpos = vec3 (-2.0,4.0,-5.0); // 3D light position

	// ray marching
	float d;
	Ray ray;
	ray.pos = cam;
	ray.dir = normalize(vec3(position, 1.0));
	for (float i = 0.0; i < 96.0; i++){
		d = distanceFunction(ray.pos);
		ray.pos += d * ray.dir;
		if(abs(d)<0.00001)break;
	}

	// lighting
	float pattern = ( abs(sin(PI*position.x*5.0)/2.0)+abs(sin(PI*position.y*5.0)/2.0) );
	vec3 color_background = vec3(0.6)+vec3(0.2, 0.3, 1.0)*(0.7+0.3*pattern);
	vec3 color_light = normalize(vec3(0.3,0.6,0.8));
	vec3 color_shadow = vec3(0.4, 0.6, 0.8);

	if(0.00001<=abs(d))
		fragcolor = color_background;
	else {
		vec3 normal = getNormal(ray.pos);
		float brightness = 16.0; // light intencity
		vec3 lightdir = normalize(lightpos - ray.pos);
		float lightdist = distance(ray.pos, lightpos);
		float attenuation = min(1.0/pow(lightdist,2.0), 1.0); // distance attenuation
		float diffuse = dot(normal, lightdir); // angular diffuse
		brightness *= attenuation;
		brightness *= diffuse;

		fragcolor = color_light*brightness + color_shadow;
	}
	gl_FragColor = vec4(fragcolor,1.0);
}