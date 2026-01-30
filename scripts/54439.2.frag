precision mediump float;
uniform float time;
uniform vec2 resolution;

const int maxSteps = 128;

struct Obj {
    int index;
    float d;
};

Obj opU(Obj sdf1, Obj sdf2) {
    if (sdf1.d < sdf2.d) {
        return sdf1;
    }
    return sdf2;
}

Obj SDF(vec3 p) {
    vec3 q = p + time;
    return opU(
        Obj(1, length(p) - 1.0 + sin(q.x)*sin(q.y)*sin(q.z)),
        Obj(2, dot(p, vec3(0, 1, 0)) + 1.52)
    );
}

vec3 calcNormal(vec3 p) {
    float eps = 0.1;
    return normalize(vec3(
        SDF(p + vec3(eps, 0.0, 0.0)).d - SDF(p + vec3(-eps, 0.0, 0.0)).d,
        SDF(p + vec3(0.0, eps, 0.0)).d - SDF(p + vec3(0.0, -eps, 0.0)).d,
        SDF(p + vec3(0.0, 0.0, eps)).d - SDF(p + vec3(0.0, 0.0, -eps)).d
    ));
}

struct Ray {
    bool hit;
    vec3 hitPos;
    vec3 hitNormal;
    int steps;
    float t;
    int objIndex;
};

Ray trace(vec3 from, vec3 rayDir) {
    bool hit = false;
    vec3 hitPos = vec3(0);
    vec3 hitNormal = vec3(0);
    int steps = 0;
    float t = 0.1;
    int objIndex = 0;
    for (int i = 0; i < maxSteps; i++) {
        vec3 p = from + t*rayDir;
        Obj obj = SDF(p);
        if (obj.d < 0.001) {
            hit = true;
            hitPos = p;
            hitNormal = calcNormal(p);
            steps = i;
            objIndex = obj.index;
            break;
        }
        t += obj.d;
    }
    return Ray(hit, hitPos, hitNormal, steps, t, objIndex);
}

float detailedAO(vec3 hitPos, vec3 hitNormal, float k) {
    float ao = 0.0;
    for (int i = 1; i <= 5; i++) {
        float d1 = k*float(i)/float(5);
        vec3 p = hitPos + d1*hitNormal;
        ao += 1.0/pow(2.0, float(i)) * abs(d1 - SDF(p).d);
    }
    return 1.0 - clamp(ao, 0.0, 1.0);
}

void main( void ) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 camPos = vec3(0, 0, 4);
    vec3 camFront = vec3(0, 0, -1);
    vec3 camUp = vec3(0, 1, 0);
    vec3 camRight = cross(camFront, camUp);

    vec3 rayDir = normalize(camFront + uv.x*camRight + uv.y*camUp);

    Ray tr = trace(camPos, rayDir);

    vec3 color = vec3(0);
    if (tr.hit) {
        if (tr.objIndex == 2) {
            color = detailedAO(tr.hitPos, tr.hitNormal, 1.2) * vec3(1);
        } else {
            color = (tr.hitNormal+1.0)/2.0 * (1.0 - float(tr.steps)/float(maxSteps));
        }
    }

    gl_FragColor = vec4(color, 1.0);
}
