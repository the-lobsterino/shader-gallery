#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


struct Ray {
    vec3 origin;
    vec3 direction;
};

struct Light {
    vec3 color;
    vec3 direction;
};

struct Material {
    vec3 color;
    float diffuse;
    float specular;
};

// To render the scene, I need to know where
struct Intersect {
    float len;
    vec3 normal;
    Material material;
};

// The last data structures I create are for objects used
struct Sphere {
    float radius;
    vec3 position;
    Material material;
};

struct Plane {
    vec3 normal;
    Material material;
};

// Magic numbers ... everybody hates them! First up, I define an epsilon 
const float epsilon = 1e-3;

// T
const int iterations = 5;

const float exposure = 1e-2;
const float gamma = 2.2;

const float intensity = 50.0;
const vec3 ambient = vec3(0.6, 0.8, 1.0) * intensity / gamma;
 Light light = Light(vec3(1.0) * intensity, normalize(
                vec3(-1.0 + 4.0 * cos(time), 4.75,
                      1.0 + 4.0 * sin(time))));

const Intersect miss = Intersect(0.0, vec3(0.0), Material(vec3(0.0), 0.0, 0.0));

Intersect intersect(Ray ray, Sphere sphere) {
    // Check for a Negative Square Root
    vec3 oc = sphere.position - ray.origin;
    float l = dot(ray.direction, oc);
    float det = pow(l, 2.0) - dot(oc, oc) + pow(sphere.radius, 2.0);
    if (det <= 0.00001) return miss;

    // Find the Closer of Two Solutions
             float len = l - sqrt(det);
    if (len < 0.0) len = l + sqrt(det);
    if (len < 0.0) return miss;
    return Intersect(len, (ray.origin + len*ray.direction - sphere.position) / sphere.radius, sphere.material);
}

Intersect intersect(Ray ray, Plane plane) {
    float len = -dot(ray.origin, plane.normal) / ( dot(ray.direction, plane.normal) + 0.0001 );
	if (len < 0.0) return miss;
	else return Intersect(len, plane.normal, plane.material); 
}

Intersect trace(Ray ray) {
    const int num_spheres = 3;
    Sphere spheres[num_spheres];

    spheres[0] = Sphere(2.0, vec3(-4.0, 3.0 + sin(time), 0), Material(vec3(1.0, 0.0, 0.0), 1.0, 0.001));
    spheres[1] = Sphere(3.0, vec3( 4.0 + cos(time), 3.0, 0), Material(vec3(0.0, 1.0, 0.0), 1.0, 0.001));
    spheres[2] = Sphere(1.0, vec3( 0.5, 1.0, 6.0),           Material(vec3(0.0, 0.0, 1.0), 0.5, 0.25));


    Intersect intersection = miss;
    Intersect plane = intersect(ray, Plane(vec3(0, 1, 0), Material(vec3(1.0, 0.0, 1.0), 1.0, 0.0)));
    if (plane.material.diffuse > 0.0 || plane.material.specular > 0.0) { intersection = plane; }
    for (int i = 0; i < num_spheres; i++) {
        Intersect sphere = intersect(ray, spheres[i]);
        if (sphere.material.diffuse > 0.0 || sphere.material.specular > 0.0)
            intersection = sphere;
    }
    return intersection;
}

vec3 radiance(Ray ray) {
    vec3 color = vec3(0.0), fresnel = vec3(0.0);
    vec3 mask = vec3(1.0);
    for (int i = 0; i <= iterations; ++i) {
        Intersect hit = trace(ray);


        if (hit.material.diffuse >= 0.01 || hit.material.specular > 0.001) {

            vec3 r0 = hit.material.color.rgb * hit.material.specular;
            float hv = clamp(dot(hit.normal, -ray.direction), 0.0, 1.0);
            fresnel = r0 + (1.0 - r0) * pow(1.0 - hv, 5.0); 
		mask *= fresnel;
	    if (trace(Ray(ray.origin + hit.len * ray.direction + epsilon * light.direction, light.direction)) == miss) 

            Intersect isec = trace(Ray(ray.origin + hit.len * ray.direction + epsilon * light.direction, light.direction));
//	    if (isec == miss)  // !!! this condition statement is the malefactor !!!
	    {
                color += clamp(dot(hit.normal, light.direction), 0.0, 1.0) * light.color
                       * hit.material.color.rgb * hit.material.diffuse  // Add Diffuse
                       * (1.0 - fresnel) * mask / fresnel;         // Subtract Specular
            }


            vec3 reflection = reflect(ray.direction, hit.normal);
            ray = Ray(ray.origin + hit.len * ray.direction + epsilon * reflection, reflection);

        } else {

            vec3 spotlight = vec3(1e8
				 ) * pow(abs(dot(ray.direction, light.direction)), 250.0);
            color += mask * (ambient + spotlight); break;
        }
    }
    return color;
}


void main() {
    vec2 uv    = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    uv.x *= resolution.x / resolution.y;


    Ray ray = Ray(vec3(0.0, 2.5, 12.0), normalize(vec3(uv.x, uv.y, -1.0)));
    gl_FragColor = vec4(pow(radiance(ray) * exposure, vec3(1.0 / gamma)), 1.0);
}
