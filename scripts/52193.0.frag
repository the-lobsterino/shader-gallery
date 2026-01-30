#ifdef GL_ES
precision highp float;
#endif

#define EPS 0.0001

uniform float time;
uniform vec2 resolution;

struct Camera {
	vec3 position;
    vec3 direction;
    vec3 top;
    vec3 side;
    float depth;
};

struct Ray {
	vec3 origin;
    vec3 direction;
};

Camera createCamera(vec3 pos, vec3 dir, float depth) {
	Camera cam;
    cam.position = pos;
    cam.direction = dir;
    cam.top = vec3(0.0, 1.0, 0.0);
    cam.side = cross(cam.direction, cam.top);
    cam.depth = depth;
    
    return cam;
}

Ray createRay(vec2 uv, Camera cam) {
    vec3 dir = normalize(
    	uv.x * cam.side
        + uv.y * cam.top
        + cam.direction * cam.depth
    );
    
    Ray ray;
    ray.origin = cam.position;
    ray.direction = dir;
    
    return ray;
}

float distBox(vec3 p, vec3 width) {
	vec3 d = abs(p) - width;
	return length(max(d, 0.0)) + min(max(d.x,max(d.y, d.z)), 0.0);
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float distFunc(vec3 p) {
	vec3 p1 = mod(p, 2.0) - 1.0;
    vec3 p2 = mod(p, 4.0) - 2.0;
    
	float box1 = distBox(p1, vec3(0.6));
    float box2 = sdTorus(p2, vec2(clamp(abs(sin(time)), 0.5, 1.0)));
    
    float dist = mix(box1, box2, 0.5);
    
	return dist;
}

vec3 getNormal(vec3 pos) {
	return normalize(vec3(
    	distFunc(pos + vec3(EPS, 0.0, 0.0)) - distFunc(pos + vec3(-EPS, 0.0, 0.0)),
        distFunc(pos + vec3(0.0, EPS, 0.0)) - distFunc(pos + vec3(0.0, -EPS, 0.0)),
        distFunc(pos + vec3(0.0, 0.0, EPS)) - distFunc(pos + vec3(0.0, 0.0, -EPS))
    ));
}

vec3 getRayPosition(Ray ray, float rayLen) {
	return ray.origin + ray.direction * rayLen;
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
  	Camera cam = createCamera(
    	vec3(0.5, 0.0, -time),
        vec3(0.0, 0.0, -1.0),
        1.0
    );
    
    Ray ray = createRay(uv, cam);
    
    float dist;
    float rayLen;
    vec3 rayPosition = getRayPosition(ray, rayLen);
    bool hit = false;
    
    for (int i = 0; i < 64; i++) {
    	dist = distFunc(rayPosition);
        rayLen += dist;
        rayPosition = getRayPosition(ray, rayLen);
        
        if (abs(dist) < EPS) {
        	hit = true;
        	break;
        }
    }
    
    vec3 color = vec3(dist);
    vec3 lightDir = normalize(vec3(0.0, 0.5, 1.0));
    
    if (hit) {
    	vec3 normal = getNormal(rayPosition);
        float diff = clamp(dot(normal, lightDir), 0.1, 1.0);
        color = vec3(1.0, 0.0, 0.0) * diff;
    }
    
    vec3 backgroundColor = vec3(0.0, 0.5, 1.0);
    
    color = mix(backgroundColor, color, exp(-0.1 * rayLen));

	gl_FragColor = vec4(color, 1.0);
}