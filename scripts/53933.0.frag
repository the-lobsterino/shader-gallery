precision mediump float;

uniform float iGlobalTime;
uniform vec3  iResolution;

#define PRECISION .001
#define MAX_ITERATIONS 500
#define POV_DISTANCE 500.0

struct sphere{
	vec3 center;
   	float radius;
    vec3 color;
};
struct merge{
	sphere s1;
    sphere s2;
};
struct torus{
	vec3 center;
    float radius;
    float sec_radius;
    vec3 color;
};
struct interpolated{
    sphere obj1;
    merge obj2;
};
struct plane{
	vec3 norm;
    float offset;
    vec3 color;
};
struct dist_color{
    float dist;
    vec3 color;
};
dist_color min_dist(dist_color distances[2]){
    dist_color minimum = distances[0];
    for (int i =0; i<2; i++){
        if(distances[i].dist < minimum.dist){
            minimum = distances[i];
        }
    }
    return minimum;
}

dist_color dist(vec3 point, sphere obj){
	return dist_color(distance(point, obj.center) - obj.radius, obj.color);
}
dist_color dist(vec3 point, merge obj){
    dist_color distances[2];
    distances[0] = dist(point, obj.s1);
    distances[1] = dist(point, obj.s2);
    return min_dist(distances);
}
dist_color dist(vec3 point, torus obj){
    point = point - obj.center;
	//vec2 q = vec2(length(point.xz)-obj.radius,point.y);
	vec2 q = vec2(length(point.xy)-obj.radius,point.z);
    float d = length(q) - obj.sec_radius;
	return dist_color(d, obj.color);
}
dist_color dist(vec3 point, interpolated obj){
 	dist_color d1 = dist(point, obj.obj1);
    dist_color d2 = dist(point, obj.obj2);
    float dist = mix(d1.dist, d2.dist, clamp(iGlobalTime/3.0, .0, 1.0));
    vec3 color = mix(d1.color, d2.color, clamp(iGlobalTime/3.0, .0, 1.0));
    
    return dist_color(dist, color);
}
dist_color dist(vec3 point, plane obj){
    return dist_color(abs(dot(obj.norm, point) + obj.offset), obj.color);
}


dist_color min_dist(vec3 point){
    sphere s0 = sphere(vec3(iResolution.xy/2.0, -100.0),50.0,vec3(1.0,.0,.0));
    sphere s1 = sphere(vec3(iResolution.x/2.0 - 40.0, iResolution.y/2.0, -100.0),25.0, vec3(1.0,.0,.0));
    sphere s2 = sphere(vec3(iResolution.x/2.0 + 40.0, iResolution.y/2.0, -100.0),25.0, vec3(1.0,.0,.0));
    plane p1 = plane(normalize(vec3(0.0,1.0,0.0)), 0.0, vec3(.3,.3,.3));
    
    torus t1 =torus(vec3(iResolution.xy/2.0, -100.0), 50.0, 20.0, vec3(1.0,.0,.0));
    merge u1 = merge(s1,s2);
    interpolated i = interpolated(s0,u1);
    
    dist_color distances[2];
    distances[0] = dist(point, p1);
    distances[1] = dist(point, i);
    
    return min_dist(distances);
}

vec3 normal(vec3 point){
	float p_dist = min_dist(point).dist;
    float x = min_dist(vec3(point.x+PRECISION, point.y, point.z)).dist - p_dist;
    float y = min_dist(vec3(point.x, point.y+PRECISION, point.z)).dist - p_dist;
    float z = min_dist(vec3(point.x, point.y, point.z+PRECISION)).dist - p_dist;
    
    return normalize(vec3(x,y,z));
}

vec4 color(vec3 point){
	vec3 norm = normal(point);
    vec3 color = min_dist(point).color;
    // vec3 light_dir = normalize(vec3(normalize(vec2(iMouse.xy) - vec2(iResolution.xy/2.0)), -0.6));
    vec3 light_dir = normalize(vec3(1.0,1.0,-0.6));
    float intensity = max(dot(norm, light_dir),0.15);
    
    return vec4(color * intensity,1.0);
}

void main( void ){
    vec2 fragCoord = gl_FragCoord.xy;
    vec3 pov = vec3(iResolution.xy/2.0,-POV_DISTANCE);
    vec3 ray_direction = normalize(vec3(fragCoord, 0.0) - pov);
    vec3 position = vec3(pov); // clone pov vector
    
    bool hit = false;
    
    for(int i=0; i<MAX_ITERATIONS;i++){
    	float d = min_dist(position).dist;
        
        if (d < PRECISION){
            hit = true;
            break;
        }else{
        	position = position + d * ray_direction;
        }
    }
    
    
    if (hit){
    	gl_FragColor = color(position);
    }
	else{
    	gl_FragColor = vec4(0,0,0,1.0);
    }
}