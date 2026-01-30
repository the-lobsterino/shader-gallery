#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// optical illusion

uniform float time;
uniform vec2 resolution;

vec3 light_dir = normalize(vec3(0.5, 0.8, 0.7));

struct Intersect {
    bool is_hit;
    vec3 position;
    vec3 normal;
    float dist;
    int material;
    vec3 color;
    int object_code;
};

const int object_num = 10;

vec3 box1_size = vec3(0.2, 1.6, 0.2);
vec3 box1_offset = vec3(1.0, 0.0, 1.0);

vec3 box2_size = vec3(0.2, 1.6, 0.2);
vec3 box2_offset = vec3(-1.0, 0.0, 1.0);

vec3 box3_size = vec3(0.2, 1.6, 0.2);
vec3 box3_offset = vec3(1.0, 0.0, -1.0);

vec3 box4_size = vec3(0.2, 1.6, 0.2);
vec3 box4_offset = vec3(-1.0, 0.0, -1.0);

vec3 box5_size = vec3(1.6, 0.1, 1.6);
vec3 box5_offset = vec3(0.0, -1.5, 0.0);

vec3 box6_size = vec3(0.1, 0.1, 1.0);
vec3 box6_offset = vec3(-1.0, -1.0, 0.0);

vec3 box7_size = vec3(0.1, 0.1, 1.0);
vec3 box7_offset = vec3(1.0, -1.0, 0.0);

vec3 box8_size = vec3(1.0, 0.1, 0.1);
vec3 box8_offset = vec3(0.0, -1.0, 1.0);

vec3 box9_size = vec3(1.0, 0.1, 0.1);
vec3 box9_offset = vec3(0.0, -1.0, -1.0);

vec3 cylinder1_size = vec3(0.2, 0.2, 0.2);

float distCylinder(vec3 p, vec3 c) {
    p = p - vec3(0.0, 0.3 * sin(time), 0.0);
    return length(p.yz - c.xy) - c.z;
}

float distSphere(vec3 p) {
    return length(p - vec3(1.0, -2.0, 0.0)) - 0.4;
}

float distBox(vec3 p, vec3 size, vec3 offset) {
    vec3 q = abs(p - offset);
    return length(max(q - size, 0.0)) - 0.0;
}

float distPlane(vec3 p, vec3 normal, float offset) {
    return dot(p, normal) + offset;
}

float sceneDist(vec3 p) {
    float box1 = distBox(p, box1_size, box1_offset);
    float box2 = distBox(p, box2_size, box2_offset);
    float box3 = distBox(p, box3_size, box3_offset);
    float box4 = distBox(p, box4_size, box4_offset);
    float box5 = distBox(p, box5_size, box5_offset);
    float box6 = distBox(p, box6_size, box6_offset);
    float box7 = distBox(p, box7_size, box7_offset);
    float box8 = distBox(p, box8_size, box8_offset);
    float box9 = distBox(p, box9_size, box9_offset);
    return min(box1, min(box2, min(box3, min(box4, min(box5, min(box6, min(box7, min(box8, box9))))))));
}

float sceneDist2(vec3 p) {
    float cylinder1 = distCylinder(p, cylinder1_size);
    return cylinder1;
}

Intersect minIntersect(vec3 p) {
    Intersect box1, box2, box3, box4, box5, box6, box7, box8, box9;

    box1.dist = distBox(p, box1_size, box1_offset);
    box1.material = 2;
    box2.dist = distBox(p, box2_size, box2_offset);
    box2.material = 2;
    box3.dist = distBox(p, box3_size, box3_offset);
    box3.material = 2;
    box4.dist = distBox(p, box4_size, box4_offset);
    box4.material = 2;
    box5.dist = distBox(p, box5_size, box5_offset);
    box5.material = 2;
    box6.dist = distBox(p, box6_size, box6_offset);
    box6.material = 2;
    box7.dist = distBox(p, box7_size, box7_offset);
    box7.material = 2;
    box8.dist = distBox(p, box8_size, box8_offset);
    box8.material = 2;
    box9.dist = distBox(p, box9_size, box9_offset);
    box9.material = 2;
	
    Intersect a;
    float scene_dist = sceneDist(p);
	if (scene_dist == box1.dist) {
		a = box1;
	} else if (scene_dist == box2.dist) {
		a = box2;
	} else if (scene_dist == box3.dist) {
		a = box3;
	} else if (scene_dist == box4.dist) {
		a = box4;
	} else if (scene_dist == box5.dist) {
		a = box5;
	} else if (scene_dist == box6.dist) {
		a = box6;
	} else if (scene_dist == box7.dist) {
		a = box7;
	} else if (scene_dist == box8.dist) {
		a = box8;
	} else if (scene_dist == box9.dist) {
		a = box9;
	}
    return a;
}

vec3 getNormal(vec3 p) {
    const float ep = 0.001;
    return normalize(vec3(
        sceneDist(p + vec3(ep, 0.0, 0.0)) - sceneDist(p + vec3(-ep, 0.0, 0.0)),
        sceneDist(p + vec3(0.0, ep, 0.0)) - sceneDist(p + vec3(0.0, -ep, 0.0)),
        sceneDist(p + vec3(0.0, 0.0, ep)) - sceneDist(p + vec3(0.0, 0.0, -ep))
    ));
}

vec3 getNormal2(vec3 p) {
    const float ep = 0.001;
    return normalize(vec3(
        sceneDist2(p + vec3(ep, 0.0, 0.0)) - sceneDist2(p + vec3(-ep, 0.0, 0.0)),
        sceneDist2(p + vec3(0.0, ep, 0.0)) - sceneDist2(p + vec3(0.0, -ep, 0.0)),
        sceneDist2(p + vec3(0.0, 0.0, ep)) - sceneDist2(p + vec3(0.0, 0.0, -ep))
    ));
}

vec4 ambientOcclusion(vec3 ro, vec3 rd) {
    vec4 ao = vec4(0.0);
    float scale = 1.0;

    for (int i=0; i<5; i++) {
        float hr = 0.01 + 0.01 * float(i * i);
        vec3 aopos = ro + rd * hr;
        float dd = sceneDist(aopos);
        float ao_val = clamp((hr-dd), 0.0, 1.0);
        ao += ao_val * scale * vec4(1.0);
        scale *= 0.75;
    }

    const float ao_coef = 0.5;
    ao.w = 1.0 - clamp(ao_coef * ao.w, 0.0, 1.0);
    return ao;
}

float getShadow(vec3 ro, vec3 rd) {
    float h = 0.0;
    float c = 0.001;
    float r = 1.0;
    float shadow_coef = 0.3;

    for (float t = 0.0; t<50.0; t++) {
        h = sceneDist(ro + rd*c);
        if (h < 0.001) return shadow_coef;
        r = min(r, h * 16.0 / c);
        c += h;
    }
    // return 1.0 - shadow_coef + r * shadow_coef;
    return shadow_coef + (1.0 - shadow_coef) * r;
}

Intersect getRayColor(vec3 origin, vec3 ray) {
    float dist1;
    float dist2;
    float depth1 = 0.0;
    float depth2 = 0.0;
    vec3 p = origin;
    vec3 q = origin;
    int count = 0;
    Intersect nearest;

    for (int i=0; i<64; i++) {
        dist1 = sceneDist(p);
        depth1 += dist1;
        p = origin + depth1 * ray;

        count = i;
        if (abs(dist1) < 0.001) {
            break;
        }
    }

    for (int i=0; i<64; i++) {
        dist2 = sceneDist2(q);
        depth2 += dist2;
        q = origin + depth2 * ray;
        if (abs(dist2) < 0.001) {
            break;
        }
    }

    if (abs(dist1) < 0.001) {
        if (depth1 < depth2) {
            if (abs(dist2) < 0.001) {
                nearest.material = 1;
                nearest.position = q;
                nearest.normal = getNormal2(q);
                nearest.dist = distCylinder(q, cylinder1_size);
            } else {
                nearest = minIntersect(p);
                nearest.position = p;
                nearest.normal = getNormal(p);
            }
        } else {
            nearest = minIntersect(p);
            nearest.position = p;
            nearest.normal = getNormal(p);
        }

        float diff = clamp(dot(light_dir, nearest.normal), 0.1, 1.0);
        float specular = pow(clamp(dot(reflect(light_dir, nearest.normal), ray), 0.0, 1.0), 10.0);
        float shadow = getShadow(p + nearest.normal * 0.01, light_dir);
        
        if (nearest.material == 0) {
            nearest.color = vec3(0.2) + vec3(0.1, 0.0, 0.0) * diff;
        } else if (nearest.material == 1) {
            nearest.color = vec3(0.2) + vec3(0.0, 0.0, 0.2) * diff;
        } else if (nearest.material == 2) {
            nearest.color = vec3(0.2) + vec3(0.6, 0.6, 0.6) * diff * shadow;
        } else if (nearest.material == 3) {
            nearest.color = vec3(0.2) + vec3(0.8, 0.0, 0.0) * diff;
        } else if (nearest.material == 4) {
            nearest.color = vec3(0.2) + vec3(0.0, 0.8, 0.0) * diff;
        }
        nearest.is_hit = true;
        vec4 ao = ambientOcclusion(nearest.position, nearest.normal);
        nearest.color -= ao.xyz * ao.w;
    } else if (abs(dist2) < 0.001) {
        nearest.material = 1;
        nearest.position = q;
        nearest.normal = getNormal2(q);
        nearest.dist = distCylinder(q, cylinder1_size);
        float diff = clamp(dot(light_dir, nearest.normal), 0.1, 1.0);
        nearest.color = vec3(0.2) + vec3(0.0, 0.0, 0.2) * diff;
        nearest.is_hit = true;
        vec4 ao = ambientOcclusion(nearest.position, nearest.normal);
        nearest.color -= ao.xyz * ao.w;
    } else {
        nearest.color = vec3(0.4);
        nearest.is_hit = false;
    }

    return nearest;
}

void main() {
    vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 camera_pos = vec3(-2.4, 1.0, 4.2);
    vec3 target = vec3(0.0);
    vec3 camera_dir = normalize(target - camera_pos);
    vec3 camera_up = vec3(0.0, 1.0, 0.0);
    vec3 camera_side = normalize(cross(camera_dir, camera_up));
    vec3 ray_dir = normalize(pos.x * camera_side + pos.y * camera_up + 1.5 * camera_dir);

    vec3 color = vec3(0.0);
    float alpha = 1.0;
    Intersect nearest;

    for (int i=0; i<2; i++) {
        nearest = getRayColor(camera_pos, ray_dir);
        color += alpha * nearest.color;
        alpha *= 0.7;
        ray_dir = normalize(reflect(ray_dir, nearest.normal));
        camera_pos = nearest.position + nearest.normal * 0.1;
        if (!nearest.is_hit || nearest.material > 0) break;
    }

    gl_FragColor = vec4(color, 1.0);
}