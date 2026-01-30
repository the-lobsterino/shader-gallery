#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// constant
const float PI = radians(180.0);
const float INF = 1e9;
const int MAX_SHAPE_NUM = 10;

struct Ray{
    vec3 origin;
    vec3 direction;
};
	
struct Sphere{
    float radius;
    vec3 position;
    vec3 color;
};

struct Plane{
    vec3 position;
    vec3 norm;
    vec3 color;
};

struct Triangle{
    vec3 a, b, c;
    vec3 color;
};

struct Circle{
    float radius;
    vec3 position;
    vec3 norm;
    vec3 color;
};

struct Cylinder{
    float radius;
    float height;
    vec3 position;
    vec3 norm;
    vec3 color;
};

struct Cone{
    float radius;
    float height;
    vec3 position;
    vec3 norm;
    vec3 color;
};

// 0:sphere, 1:plane, 2:triangle, 3:circle, 4:cylinder, 5:cone
struct Shape{
    int flag;
    Sphere sphere;
    Plane plane;
    Triangle traingle;
    Circle circle;
    Cylinder cylinder;
    Cone cone;
};

struct Light{
    float phi;
    vec3 position;
    vec3 color;
};

struct Intersection{
    bool hit;
    float t;
    vec3 position;
    vec3 color;
    vec3 norm;
};

// objects
Shape shapes[MAX_SHAPE_NUM];

Ray generate_camera_ray(vec2 pixel){
    float theta = (2.0*mouse.x - 1.0)* PI;
    float phi = (mouse.y-0.5)*PI;
    // camera coordinate system
    // vec3 c_from = vec3(0.0, 0.0, 5.0);
    // vec3 c_from = vec3(5.0*sin(time), 0.0, 5.0*cos(time));
    // vec3 c_from = vec3(5.0*sin(time), 5.0*sin(time), 5.0*cos(time));
    vec3 c_from = vec3(5.0*sin(theta), 5.0*sin(phi), 5.0*cos(theta));
    vec3 c_to = vec3(0.0, 0.0, 0.0);
    vec3 c_up = vec3(0.0, -1.0, 0.0);

    // axes and origin
    vec3 w = normalize(c_from - c_to);
    vec3 u = normalize(cross(c_up, w));
    vec3 v = cross(w, u);
    vec3 e = c_from;

    // film parameters
    float film_w = 4.0;
    float film_h = film_w * resolution.y / resolution.x;
    float distance_to_film = 2.0;

    // pixel location in the camera coordinates
    float x = film_w * (pixel.x + 0.5) / resolution.x;
    float y = film_h * (pixel.y + 0.5) / resolution.y;
    float z = distance_to_film;

    Ray ray;
    ray.origin = e;
    ray.direction = normalize(ray.origin - (x*u + y*v + z*w + e));
    return ray;
}

Shape createSphere(float radius, vec3 position, vec3 color){
    Shape shape;
    Sphere sphere;
    sphere.radius = radius;
    sphere.position = position;
    sphere.color = color;
    shape.flag = 0;
    shape.sphere = sphere;
    return shape;
}

Shape createPlane(vec3 position, vec3 norm, vec3 color){
    Shape shape;
    Plane plane;
    plane.position = position;
    plane.norm = normalize(norm);
    plane.color = color;
    shape.flag = 1;
    shape.plane = plane;
    return shape;
}

Shape createTriangle(vec3 a, vec3 b, vec3 c, vec3 color){
    Shape shape;
    Triangle traingle;
    traingle.a = a;
    traingle.b = b;
    traingle.c = c;
    traingle.color = color;
    shape.flag = 2;
    shape.traingle = traingle;
    return shape;
}

Shape createCircle(float radius, vec3 position, vec3 norm, vec3 color){
    Shape shape;
    Circle circle;
    circle.radius = radius;
    circle.position = position;
    circle.norm = normalize(norm);
    circle.color = color;
    shape.flag = 3;
    shape.circle = circle;
    return shape;
}

Shape createCylinder(float radius, float height, vec3 position, vec3 norm, vec3 color){
    Shape shape;
    Cylinder cylinder;
    cylinder.radius = radius;
    cylinder.height = height;
    cylinder.position = position;
    cylinder.norm = normalize(norm);
    cylinder.color = color;
    shape.flag = 4;
    shape.cylinder = cylinder;
    return shape;
}

Shape createCone(float radius, float height, vec3 position, vec3 norm, vec3 color){
    Shape shape;
    Cone cone;
    cone.radius = radius;
    cone.height = height;
    cone.position = position;
    cone.norm = normalize(norm);
    cone.color = color;
    shape.flag = 5;
    shape.cone = cone;
    return shape;
}

Intersection initIntersection(){
    Intersection intersect;
    intersect.hit = false;
    intersect.t = INF;
    intersect.position = vec3(0.0);
    intersect.color = vec3(0.0);
    intersect.norm = vec3(0.0);
    return intersect;
}

Intersection intersectSphere(Ray ray, Sphere sphere){
    Intersection intersect = initIntersection();
    vec3 o_sub_s = ray.origin - sphere.position;
    float a = dot(ray.direction, ray.direction);
    float b = dot(ray.direction, o_sub_s);
    float c = dot(o_sub_s, o_sub_s) - (sphere.radius * sphere.radius);
    float D = b*b - a*c;
    if(D >= 0.0){
        float t = 0.0;
        if(-b - sqrt(D) > 0.0){
            t = (-b - sqrt(D))/a;
        }else if(-b + sqrt(D) > 0.0){
            t = (-b + sqrt(D))/a;
        }

        if(t > 0.0){
            intersect.hit = true;
            intersect.t = t;
            intersect.position = ray.origin + t * ray.direction;
            intersect.color = sphere.color;
            intersect.norm = (intersect.position - sphere.position) / sphere.radius;
        }
    }
    return intersect;
}

Intersection intersectPlane(Ray ray, Plane plane){
    Intersection intersect = initIntersection();
    float t = 0.0;
    // find intersection
    if(dot(ray.direction, plane.norm) != 0.0){ // not orthonal
        t = dot(plane.position - ray.origin, plane.norm) / dot(ray.direction, plane.norm);
    }
    if(t > 0.0){
        intersect.hit = true;
        intersect.t = t;
        intersect.position = ray.origin + t * ray.direction;
        intersect.color = plane.color;
        intersect.norm = plane.norm;
    }
    return intersect;
}

Intersection intersectTriangle(Ray ray, Triangle triangle){
    Intersection intersect = initIntersection();

    // cramer`s rule
    vec3 a_sub_b = triangle.a - triangle.b;
    vec3 a_sub_c = triangle.a - triangle.c;
    vec3 a_sub_o = triangle.a - ray.origin;
    float det = dot(cross(a_sub_b, a_sub_c), ray.direction);
    float beta = dot(cross(a_sub_o, a_sub_c), ray.direction) / det;
    float gamma = dot(cross(a_sub_b, a_sub_o), ray.direction) / det;
    float t = dot(cross(a_sub_b, a_sub_c), a_sub_o) / det;

    if(t > 0.0 && 0.0 < beta && 0.0 < gamma && beta + gamma < 1.0){
        intersect.hit = true;
        intersect.t = t;
        intersect.position = ray.origin + t * ray.direction;
        intersect.color = triangle.color;
        intersect.norm = normalize(cross(triangle.b - triangle.a, triangle.c - triangle.a));
    }
    return intersect;
}

Intersection intersectCircle(Ray ray, Circle circle){
    Intersection intersect = initIntersection();
    float t = 0.0;
    // find intersection
    if(dot(ray.direction, circle.norm) != 0.0){ // not orthonal
        t = dot(circle.position - ray.origin, circle.norm) / dot(ray.direction, circle.norm);
    }
    if(t > 0.0 && distance(ray.origin + t * ray.direction, circle.position) < circle.radius){
        intersect.hit = true;
        intersect.t = t;
        intersect.position = ray.origin + t * ray.direction;
        intersect.color = circle.color;
        intersect.norm = circle.norm;
    }
    return intersect;
}

Intersection intersectCylinder(Ray ray, Cylinder cylinder){
    Intersection intersect = initIntersection();
    vec3 dp = ray.origin - cylinder.position;
    vec3 temp1 = ray.direction - dot(ray.direction, cylinder.norm) * cylinder.norm;
    vec3 temp2 = dp - dot(dp, cylinder.norm) * cylinder.norm;
    float a = dot(temp1, temp1);
    float b = dot(temp1, temp2);
    float c = dot(temp2, temp2) - cylinder.radius * cylinder.radius;
    float D = b*b - a*c;

    if(D >= 0.0){
        float t = 0.0;
        if(-b - sqrt(D) > 0.0){
            t = (-b - sqrt(D))/a;
        }else if(-b + sqrt(D) > 0.0){
            t = (-b + sqrt(D))/a;
        }

        vec3 p = ray.origin + t * ray.direction - cylinder.position;
        bool bottom_check = (dot(cylinder.norm, p) > 0.0);
        bool top_check =  (dot(cylinder.norm, p - cylinder.height * cylinder.norm) < 0.0);

        if(t > 0.0 && bottom_check && top_check){
            intersect.hit = true;
            intersect.t = t;
            intersect.position = ray.origin + t * ray.direction;
            intersect.color = cylinder.color;
            intersect.norm = normalize(p - dot(p, cylinder.norm) * cylinder.norm);
        }
    }

    // bottom surface
    Intersection temp_intersection;
    Shape circle_top = createCircle(cylinder.radius, cylinder.position+cylinder.height*cylinder.norm, cylinder.norm, cylinder.color);
    Shape circle_bottom = createCircle(cylinder.radius, cylinder.position, cylinder.norm, cylinder.color);
    temp_intersection = intersectCircle(ray, circle_top.circle);
    if(temp_intersection.t < intersect.t){
        intersect = temp_intersection;
    }
    temp_intersection = intersectCircle(ray, circle_bottom.circle);
    if(temp_intersection.t < intersect.t){
        intersect = temp_intersection;
    }

    return intersect;
}

Intersection intersectCone(Ray ray, Cone cone){
    Intersection intersect = initIntersection();
    float theta = atan(cone.radius, cone.height);
    vec3 pa = cone.position + cone.height * cone.norm; // top
    vec3 dp = ray.origin - pa;
    vec3 temp1 = ray.direction - dot(ray.direction, cone.norm) * cone.norm;
    vec3 temp2 = dp - dot(dp, cone.norm) * cone.norm;
    float a = cos(theta) * cos(theta) * dot(temp1, temp1) - sin(theta) * sin(theta) * dot(ray.direction, cone.norm) * dot(ray.direction, cone.norm);
    float b = cos(theta) * cos(theta) * dot(temp1, temp2) - sin(theta) * sin(theta) * dot(ray.direction, cone.norm) * dot(dp, cone.norm);
    float c = cos(theta) * cos(theta) * dot(temp2, temp2) - sin(theta) * sin(theta) * dot(dp, cone.norm) * dot(dp, cone.norm);
    float D = b*b - a*c;

    if(D >= 0.0){
        float t = 0.0;
        if(-b - sqrt(D) > 0.0){
            t = (-b - sqrt(D))/a;
        }
        
        vec3 p = ray.origin + t * ray.direction - pa;
        float dh = -dot(p, cone.norm); 

        if(t > 0.0 && 0.0 < dh && dh < cone.height){
            intersect.hit = true;
            intersect.t = t;
            intersect.position = ray.origin + t * ray.direction;
            intersect.color = cone.color;

            vec3 l = -cone.norm * cone.height;
            intersect.norm = l - dot(l, p) / dot(p, p) * p;
        }

        if(-b + sqrt(D) > 0.0 && !intersect.hit){
            t = (-b + sqrt(D))/a;
        }
        
        p = ray.origin + t * ray.direction - pa;
        dh = -dot(p, cone.norm); 

        if(t > 0.0 && 0.0 < dh && dh < cone.height){
            intersect.hit = true;
            intersect.t = t;
            intersect.position = ray.origin + t * ray.direction;
            intersect.color = cone.color;

            vec3 l = -cone.norm * cone.height;
            intersect.norm = l - dot(l, p) / dot(p, p) * p;
        }
    }
    if(!intersect.hit){
        a = dot(ray.direction, -cone.norm) * dot(ray.direction, -cone.norm) - cos(theta) * cos(theta);
        b = dot(ray.direction, -cone.norm) * dot(dp, -cone.norm) - dot(ray.direction, dp) * cos(theta) * cos(theta);
        c = dot(dp, -cone.norm) * dot(dp, -cone.norm) - dot(dp, dp) * cos(theta) * cos(theta);
        D = b*b - a*c;

        if(D >= 0.0){
            float t = 0.0;
            if(-b - sqrt(D) > 0.0){
                t = (-b - sqrt(D))/a;
            }
            
            vec3 p = ray.origin + t * ray.direction - pa;
            float dh = -dot(p, cone.norm); 

            if(t > 0.0 && 0.0 < dh && dh < cone.height){
                intersect.hit = true;
                intersect.t = t;
                intersect.position = ray.origin + t * ray.direction;
                intersect.color = cone.color;

                vec3 l = -cone.norm * cone.height;
                intersect.norm = l - dot(l, p) / dot(p, p) * p;
            }

            if(-b + sqrt(D) > 0.0 && !intersect.hit){
                t = (-b + sqrt(D))/a;
            }
            
            p = ray.origin + t * ray.direction - pa;
            dh = -dot(p, cone.norm); 

            if(t > 0.0 && 0.0 < dh && dh < cone.height){
                intersect.hit = true;
                intersect.t = t;
                intersect.position = ray.origin + t * ray.direction;
                intersect.color = cone.color;

                vec3 l = -cone.norm * cone.height;
                intersect.norm = l - dot(l, p) / dot(p, p) * p;
            }
        }
    }

    // bottom surface
    Intersection temp_intersection;
    Shape circle_bottom = createCircle(cone.radius, cone.position, cone.norm, cone.color);
    temp_intersection = intersectCircle(ray, circle_bottom.circle);
    if(temp_intersection.t < intersect.t){
        intersect = temp_intersection;
    }
    return intersect;
}

Intersection intersectShape(Ray ray, Shape shape){
    Intersection intersect = initIntersection();
    if(shape.flag == 0){
        intersect = intersectSphere(ray, shape.sphere);
    }else if(shape.flag == 1){
        intersect = intersectPlane(ray, shape.plane);
    }else if(shape.flag == 2){
        intersect = intersectTriangle(ray, shape.traingle);
    }else if(shape.flag == 3){
        intersect = intersectCircle(ray, shape.circle);
    }else if(shape.flag == 4){
        intersect = intersectCylinder(ray, shape.cylinder);
    }else if(shape.flag == 5){
        intersect = intersectCone(ray, shape.cone);
    }
    return intersect;
}

vec3 shade(Intersection intersect, Light light, Ray ray){
    vec3 color = vec3(0.0);
    
    if(intersect.hit){

        float r = distance(intersect.position, light.position);
        vec3 l = normalize(light.position - intersect.position);
        float E = light.phi * dot(intersect.norm, l) / (4.0 * PI * r * r);
        if(dot(ray.direction, intersect.norm) > 0.0){
            E *= -1.0;
        }

        // shadow
        Ray light_ray;
        light_ray.origin = intersect.position;
        light_ray.direction = l;
        Intersection light_intersect = initIntersection(), temp_intersect = initIntersection();
        light_intersect.t = r;
        for(int i=0; i<MAX_SHAPE_NUM; i++){
            temp_intersect = intersectShape(light_ray, shapes[i]);
            if(0.001 < temp_intersect.t && temp_intersect.t < light_intersect.t){
                light_intersect = temp_intersect;
            }
        }
        if(light_intersect.hit){
            E = 0.0;
        }

        color = light.color * intersect.color * E;
    }

    return color;
}

void main(void){
    // initialize ray
    Ray ray;
    ray = generate_camera_ray(gl_FragCoord.xy*2.0 - resolution);
    for(int i=0; i<MAX_SHAPE_NUM; i++){
        Shape shape;
        shape.flag = -1;
        shapes[i] = shape;
    }
    // initialize shapes
    shapes[0] = createSphere(1.0, vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)); // color, position, color
    shapes[1] = createSphere(10.0, vec3(0.0, 0.0, 0.0), vec3(0.5, 1.0, 1.0));
    shapes[2] = createPlane(vec3(0.0, -1.0, 0.0), vec3(0.0, 1.0, 0.0), vec3(0.0, 0.2, 0.5)); // position, norm, color
    shapes[3] = createTriangle(vec3(2.0, -2.0, 2.0), vec3(0.0, 2.0, -2.0), vec3(-2.0, -2.0, 2.0), vec3(1.0, 1.0, 0.5)); // 3 points, color
    shapes[4] = createCircle(1.5, vec3(2.0, 1.0, -1.0), vec3(0.0, 1.0, -1.0), vec3(0.8, 0.2, 0.2)); // radius, position, norm, color
    shapes[5] = createCylinder(1.0, 2.0, vec3(1.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), vec3(1.0, 0.0, 1.0)); // radius, height, position, norm, color
    shapes[6] = createCone(1.0, 2.0, vec3(-3.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), vec3(0.0, 1.0, 0.0)); // radius, height, position, norm, color

    // initialize lighting
    Light light;
    light.phi = 1000.0;
    light.position = vec3(0.0, 5.0, 0.0);
    light.color = vec3(1.0, 1.0, 1.0);

    // find the nearest intersection
    Intersection first_hit = initIntersection();
    Intersection intersect;

    for(int i=0; i<MAX_SHAPE_NUM; i++){
        intersect = intersectShape(ray, shapes[i]);
        if(intersect.t < first_hit.t){
            first_hit = intersect;
        }
    }

    // shade
    vec3 color;
    color = shade(first_hit, light, ray); 
    // color = first_hit.color; // shade without shadows etc.
    gl_FragColor = vec4(color, 1.0);
}