/*
 * Original shader from: https://www.shadertoy.com/view/tsXfR8
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
float smin(float a, float b, float k) {
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float snowhead(vec3 p, vec3 off) {
    float body = length(p - off) - 1.0;
    float head = length(p - vec3(0.0, 1.4, 0.0) - off) - 0.6;
    return smin(body, head, 0.2);
}

float carrot(vec3 p, vec3 off) {
    p = p - off;
    if (length(p) > 1.0) {
        return 1.0;
    }
    float rad = radians(75.0);
    float q = length(p.xy);
    return dot(vec2(sin(rad), cos(rad)), vec2(q, p.z));
}

float snoweye(vec3 p, vec3 off) {
    float left = length(p - vec3(-0.25, 0.0, 0.0) - off) - 0.1;
    float right = length(p - vec3(0.25, 0.0, 0.0) - off) - 0.1;
    return min(left, right);
}

float sol(vec3 p) {
    return p.y;
}

float rect(vec3 p, vec3 b, vec3 off) {
    vec3 q = abs(p - off) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - 0.1;
}

float window(vec3 p, vec3 off) {
    return max(rect(p, vec3(2.0, 2.0, 0.1), off),
        -rect(p, vec3(1.8, 1.7, 1.0), off + vec3(0.0, 0.0, 0.1)));
}

float wall(vec3 p, vec3 windowOff) {
    if (p.z < -3.0) {
        return 1.0;
    }
    float x = abs(p.x + 3.0) - 0.001;
    float z = abs(p.z + 3.0) - 0.001;
    return max(min(x, z),
        -rect(p, vec3(2.0, 2.0, 1.0), windowOff));
}

float cubic(vec3 p, vec3 off) {
    float sol = rect(p, vec3(3.0, 0.01, 3.0), off);
    float plafond = smin(sol, rect(p, vec3(3.0, 0.01, 3.0), off + vec3(0.0, 6.0, 0.0)), 0.1);
    float wall = smin(plafond, rect(p, vec3(3.0, 6.0, 0.01), off + vec3(0.0, 0.0, -3.0)), 0.1);
    wall = smin(wall, rect(p, vec3(0.01, 6.0, 3.0), off + vec3(-3.0, 0.0, 0.0)), 0.1);
    wall = smin(wall, rect(p, vec3(0.01, 6.0, 3.0), off + vec3(3.0, 0.0, 0.0)), 0.1);
    return wall;
}

float lamp(vec3 p, vec3 off) {
    return rect(p, vec3(0.5, 0.1, 0.4), off);
}

vec2 map(vec3 p) {
    float closest = 1000.0;
    float id = -1.0;
    
    float dist = sol(p);
    if (dist < closest) { closest = dist; id = 0.5; }
    
    dist = snowhead(p, vec3(0.0, 0.5, 0.0));
    if (dist < closest) { closest = dist; id = 1.5; }
    
    dist = snoweye(p, vec3(0.0, 2.2, 0.5));
    if (dist < closest) { closest = dist; id = 2.5; }
    
    dist = carrot(p, vec3(0.0, 1.9, 1.0));
    if (dist < closest) { closest = dist; id = 3.5; }
    
    dist = wall(p, vec3(0.0, 3.8, -4.0));
    if (dist < closest) { closest = dist; id = 4.5; }
    
    dist = window(p, vec3(0.0, 3.8, -3.1));
    if (dist < closest) { closest = dist; id = 5.5; }
    
    dist = cubic(p, vec3(1.0, 0.0, -6.15));
    if (dist < closest) { closest = dist; id = 6.5; }
    
    dist = lamp(p, vec3(1.0, 6.0, -6.15));
    if (dist < closest) { closest = dist; id = 7.5; }
    
    return vec2(closest, id);
}

vec3 calcNormal(vec3 p) {
    const float epsilon = 0.001;
    return normalize(vec3(
        map(p).x - map(vec3(p.x - epsilon, p.yz)).x,
        map(p).x - map(vec3(p.x, p.y - epsilon, p.z)).x,
        map(p).x - map(vec3(p.xy, p.z - epsilon)).x
    ));
}

vec2 intersect(vec3 ro, vec3 rd) {
    vec2 dv = vec2(0.0, -1.0);
    
    for (int i = 0; i < 300; i++) {
        vec2 distId = map(ro + rd * dv.x);
        if (distId.x <= 0.001) {
            dv.y = distId.y;
            break;
        }
        dv.x += distId.x;
    }
    return dv;
}

vec3 wallColor(vec3 p) {
    const vec3 base = vec3(0.8, 0.6, 0.7);
    vec3 f = fract(p);
    float clamped = length(clamp(p, 0.0, 1.0));
    return base * (f.y + 0.4);
}

vec3 carrotColor(vec3 p) {
    const vec3 base = vec3(1.5, 0.3, 0.0);
    vec3 f = fract(p * 10.0);
    vec3 color = base * (1.0 - pow(f.z, 12.0) * 0.3);
    return color;
}

vec3 getColor(vec3 p, float id) {
    if (id <= -0.5) { return vec3(0.0, 0.0, 0.0); }
    if (id <= 1.0) { return vec3(1.0, 1.0, 1.0); }
    if (id <= 2.0) { return vec3(1.0, 1.0, 1.0); }
    if (id <= 3.0) { return vec3(0.1, 0.1, 0.1); }
    if (id <= 4.0) { return carrotColor(p); } // carrot
    if (id <= 5.0) { return wallColor(p); } // wall
    if (id <= 6.0) { return vec3(0.5, 0.2, 0.1); }
    if (id <= 7.0) { return vec3(2.2, 2.2, 2.2); }
    if (id <= 8.0) { return vec3(100.0, 100.0, 100.0); }
    return vec3(1.0, 0.0, 0.0);
}

float softShadow(vec3 ro, vec3 rd, float k) {
    float res = 1.0;
    float depth = 0.0001;
    vec2 dv = vec2(1.0, -1.0);

    for (int i = 0; i < 50; i++) {
        dv = map(ro + rd * depth);
        res = min(res, smoothstep(0.0, 1.0, k * dv.x / depth));
        if (res < 0.0001) { break; }
        depth += clamp(dv.x, 0.01, 0.06);
    }
    return clamp(res, 0.0, 1.0);
}

float directLighting(vec3 p, vec3 n, vec3 lightPos, vec3 lightDir) {
    vec3 u = normalize(cross(lightDir, vec3(0.0, 1.0, 0.0)));
    vec3 v = cross(u, lightDir);
    float shadowIntensity = softShadow(p + 0.001 * n, lightDir, 10.0);
    
    vec3 toLight = lightPos - p;
    float attenuation = smoothstep(0.9, 1.0, dot(normalize(toLight), lightDir));
    
    return attenuation * shadowIntensity;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord.xy / iResolution.xy * 2.0 - 1.0;
    float aspect = iResolution.x / iResolution.y;
    uv.x *= aspect;

    const float r = 2.0;
    vec3 ro = vec3(r * (sin(iTime * 0.3) * 0.5 + 0.5) * 0.9 + r, 3.0 * (sin(iTime * 0.5) * 0.1 + 0.9), r * (cos(iTime * 0.3) * 0.5 + 0.5) + r);
    vec3 center = vec3(0.0, 2.0 + sin(iTime * 0.2) * 0.8 + 0.2, 0.0);
    vec3 front = normalize(vec3(center - ro));
    vec3 right = normalize(cross(front, vec3(0.0, 1.0, 0.0)));
    vec3 up = normalize(cross(right, front));
    mat4 lookAt = mat4(
        vec4(right, 0.0),
        vec4(up, 0.0),
        vec4(front, 0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );
    vec3 rd = normalize(vec3(lookAt * vec4(uv, 2.0, 1.0)));
    
    vec2 result = intersect(ro, rd);
    vec3 pos = ro + rd * result.x;
    vec3 n = calcNormal(pos);
    
    vec3 lightPos = vec3(-1.5, 5.5, -4.65);
    vec3 lightDir = normalize(lightPos);
    vec3 hal = normalize(lightDir - rd); // WHAT?

    float ambient = 1.0;
    float diffuse = max(dot(lightDir, n), 0.0);
    float attenuation = 0.1 + 0.9 * smoothstep(0.9, 1.0, dot(normalize(lightPos - pos), lightDir));
    float back = max(dot(n, normalize(vec3(-lightDir.x, 0.0, -lightDir.z))), 0.0);
    float fr = pow(clamp(1.0 + dot(n , rd), 0.0, 1.0), 3.0);
    float dome = clamp(n.y * 0.8 + 0.2, 0.0, 1.0);
    float sol = clamp(-n.y * 0.8 + 0.2, 0.0, 0.0) * pow(clamp(1.0 - pos.y, 0.0, 1.0), 2.0);
    float specular = pow(clamp(dot(n, hal), 0.0, 1.0), 8.0);
    float shadow = directLighting(pos, n, lightPos, lightDir);
    
    vec3 light = vec3(0.0, 0.0, 0.0);
    light += ambient * vec3(0.03, 0.02, 0.01) * attenuation;
    light += diffuse * vec3(1.01, 1.0, 1.0) * pow(vec3(shadow), vec3(1.0, 1.0, 1.0)) * attenuation;
    light += back * vec3(0.42, 0.20, 0.1) * attenuation;
    light += fr * vec3(3.0, 3.0, 3.0) * attenuation * (0.25 + 0.25 * diffuse);
    light += dome * vec3(0.15, 0.1, 0.1) * attenuation;
    light += sol * vec3(0.2, 0.2, 0.2) * attenuation;
    light += specular * vec3(0.5, 0.5, 0.5) * attenuation;
    
    vec3 color = getColor(pos, result.y) * light;
    color = pow(color, vec3(0.4545));

    fragColor = vec4(color, 1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}