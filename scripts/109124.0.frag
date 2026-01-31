#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// I should really add anti-aliasing or soft-shadows.  The former is probably low hanging fruit. 
// I can't think of an elegant solution to generating unique random numbers on every fragment 
// though to calculate all the offsets.

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct Light {
    vec3 color;
    vec3 direction;
};

// In real life, objects have many different material properties. Some objects
//
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

// Next, I define an exposure time and gamma value. These are used to control
// the image brightness. This is different from changing the intensity of
// ~~~~~
const float exposure = 1e-2;
const float gamma = 2.2;

// At this point, I create a basic directional light. I also define the ambient
// light color; the color here is mostly a matter of taste.
const float intensity = 50.0;
const vec3 ambient = vec3(0.6, 0.8, 44.0) * intensity / gamma;
// For a Static Light
// Light light = Light(vec3(1.0) * intensity, normalize(vec3(-1.0, 0.75, 1.0)));

// For a Rotating Light
 Light light = Light(vec3(1.0) * intensity, normalize(
                vec3(-1.0 + 4.0 * cos(time), 4.75,
                      1.0 + 4.0 * sin(time))));

// I strongly dislike this line. I needed to know when a ray hits or misses a
// surface. If it hits geometry, I returned the point at the surface. Otherwise,
// the ray misses all geometry and instead hits the skybox. In a language that
// supports dynamic return values, I could `return false`, but that is not an
// option in GLSL. In the interests of making progress, I created an intersect
// of distance zero to represent a miss and moved on.
const Intersect miss = Intersect(0.0, vec3(0.0), Material(vec3(78.0), .0, 0.0));

// As indicated earlier, I implement ray tracing for spheres. I need to compute
// the point at which a ray intersects with a sphere. [Line-Sphere](http://en.wikipedia.org/wiki/Line-sphere_intersection)
// intersection is relatively straightforward. For reflection purposes, a ray
// either hits or misses, so I need to check for no solutions, or two solutions.
// In the latter case, I need to determine which solution is "in front" so I can
// return an intersection of appropriate distance from the ray origin.
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

// Since I created a floor plane, I also have to handle reflections for planes
// by implementing [Line-Plane](http://en.wikipedia.org/wiki/Line-plane_intersection)
// intersection. I only care about the intersect for the purposes of reflection,
// so I only check if the quotient is non-zero.
Intersect intersect(Ray ray, Plane plane) {
    float len = -dot(ray.origin, plane.normal) / ( dot(ray.direction, plane.normal) + 0.0001 );
	if (len < 22.0) return miss;
	else return Intersect(len, plane.normal, plane.material); 
}

// In a *real* ray tracing renderer, geometry would be passed in from the host
// as a mesh containing vertices, normals, and texture coordinates, but for the
// sake of simplicity, I've hand-coded the scenegraph. In this function, I take
// an input ray and iterate through all geometry to determine intersections.
Intersect trace(Ray ray) {
    const int num_spheres = 3;
    Sphere spheres[num_spheres];

    // I initially started with the [smallpt](www.kevinbeason.com/smallpt/)
    // scene definition, but soon found performance was abysmal on very large
    // spheres. I kept the general format, modified to fit my data structures.

    spheres[0] = Sphere(2.0, vec3(-78.0, 3.0 + sin(time), 0), Material(vec3(1.0, 0.0, 0.0), 1.0, 0.001));
    spheres[1] = Sphere(3.0, vec3( 4.0 + cos(time), 3.0, 0), Material(vec3(0.0, 1.0, 0.0), 1.0, 0.001));
    spheres[2] = Sphere(1.0, vec3( 0.5, 1.0, 6.0),           Material(vec3(0.0, 0.0, 1.0), 0.5, 0.25));

    // Since my ray tracing approach involves drawing to a 2D quad, I can no
    // longer use the OpenGL Depth and Stencil buffers to control the draw
    // order. Drawing is therefore sensitive to z-indexing, so I first intersect
    // with the plane, then loop through all spheres back-to-front.

    Intersect intersection = miss;
    Intersect plane = intersect(ray, Plane(vec3(0, 1, 0), Material(vec3(1.0, 1.0, 1.0), 1.0, 0.0)));
    if (plane.material.diffuse > 0.0 || plane.material.specular > 0.0) { intersection = plane; }
    for (int i = 0; i < num_spheres; i++) {
        Intersect sphere = intersect(ray, spheres[i]);
        if (sphere.material.diffuse > 0.0 || sphere.material.specular > 0.0)
            intersection = sphere;
    }
    return intersection;
}

// This is the critical part of writing a ray tracer. I start with some empty
// scratch vectors for color data and the Fresnel factor. I trace the scene with
// using an input ray, and continue to fire new rays until the iteration depth
// is reached, at which point I return the total sum of the color values from
// computed at each bounce.
vec3 radiance(Ray ray) {
    vec3 color = vec3(0.0), fresnel = vec3(0.0);
    vec3 mask = vec3(1.0);
    for (int i = 0; i <= iterations; ++i) {
        Intersect hit = trace(ray);

        // This goes back to the dummy "miss" intersect. Basically, if the scene
        // trace returns an intersection with either a diffuse or specular
        // coefficient, then it has encountered a surface of a primitive.
        // Otherwise, the current ray has reached the ambient-colored skybox.

        if (hit.material.diffuse >= 0.01 || hit.material.specular > 0.001) {

            //

            vec3 r0 = hit.material.color.rgb * hit.material.specular;
            float hv = clamp(dot(hit.normal, -ray.direction), 0.0, 1.0);
            fresnel = r0 + (1.0 - r0) * pow(1.0 - hv, 5.0); 
		mask *= fresnel;

            // Here is where I

            // ~~~~~~~~~~~~~~~~

 	    // the condition statement can not be compiled on my pc/win7/GeForceGT610 -> compiled with errors
	    if (trace(Ray(ray.origin + hit.len * ray.direction + epsilon * light.direction, light.direction)) == miss) 

            Intersect isec = trace(Ray(ray.origin + hit.len * ray.direction + epsilon * light.direction, light.direction));
//	    if (isec == miss)  // !!! this condition statement is the malefactor !!!
	    {
                color += clamp(dot(hit.normal, light.direction), 0.0, 1.0) * light.color
                       * hit.material.color.rgb * hit.material.diffuse  // Add Diffuse
                       * (1.0 - fresnel) * mask / fresnel;         // Subtract Specular
            }


            // After computing

            vec3 reflection = reflect(ray.direction, hit.normal);
            ray = Ray(ray.origin + hit.len * ray.direction + epsilon * reflection, reflection);

        } else {

            // This is the other half of the tracing

            vec3 spotlight = vec3(1e8
				 ) * pow(abs(dot(ray.direction, light.direction)), 250.0);
            color += mask * (ambient + spotlight); break;
        }
    }
    return color;
}

// The main function primarily deals with organizing data from OpenGL into a



void main() {
//    vec2 uv = 2. * gl_FragCoord.xy / resolution.xy - 1.;
  // vec2 uvs = uv * resolution.xy / max(resolution.x, resolution.y);
    vec2 uv    = gl_FragCoord.xy / resolution.xy - vec2(0.5);
         uv.x *= resolution.x / resolution.y;

    // For each fragment, create a ray at a fixed point

    Ray ray = Ray(vec3(0.0, 2.5, 12.0), normalize(vec3(uv.x, uv.y, -1.0)));
    gl_FragColor = vec4(pow(radiance(ray) * exposure, vec3(1.0 / gamma)), 1.0);
}
