/*
 * Original shader from: https://www.shadertoy.com/view/mtSGz3
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
//
// Fruxis, reconstructed - by 42yeah
//

vec3 hash3(float n)
{
    return fract(sin(vec3(n, n + 1.0, n + 2.0)) * vec3(43758.5453123, 22578.1459123, 19642.3490423));
}

float ball(vec3 p, vec3 center, float r)
{
    return length(p - center) - r;
}

float suelo(vec3 p, out vec3 uvw)
{
    uvw = p;
    return p.y;
}

float pared(vec3 p, out vec3 uvw)
{
    uvw = 4.0 * p;
    float d1 = 0.6 + p.z;
    float d2 = 0.6 + p.x;
    return min(d1, d2);
}

float melon(vec3 p, out vec3 uvw)
{
    vec3 c = p - vec3(0.0,0.215,0.0);

    vec3 q = 3.0 * c * vec3(1.0,1.5,1.5);
    uvw = 3.0 * c;

    float r = 1.0 - 0.007 * sin(30.0 * (-c.x + c.y - c.z));
    return 0.65 * (length(q) - r) / 3.0;
}

float manzana(vec3 p, out vec3 uvw)
{
    vec3 q = p - vec3(0.5, 0.1, 0.5);
    float r = length(q.xz);
    q.y += 0.05 * (1.0 - clamp(r / 0.1, 0.0, 1.0));
    q.y -= 0.03 * (1.0 - smoothstep(0.004, 0.005, r));
    uvw = 10.0 * q;
    return 0.4 * (length(10.0 * q) - 1.0) / 10.0;
}

float uvas(vec3 p, out vec3 uvw)
{
    vec3 q = p - vec3(-0.1, 0.1, 0.6);
    uvw = 10.0 * q;
    
    float d1 = length(q - vec3(-0.09, 0.1, -0.07)) - 0.12;
    float d2 = length(q - vec3(0.11, 0.05, 0.0)) - 0.09;
    float d3 = length(q - vec3(-0.07, 0.03, 0.1)) - 0.1;
    
    return min(d1, min(d2, d3));
}

float lemon(vec3 p, out vec3 uvw)
{
    vec3 q = p - vec3(0.7, 0.06, 0.2);
    uvw = 10.0 * q;
    
    float s = 1.35; // ???
    float r = clamp(abs(q.x) / 0.077, 0.0, 1.0);
    s += 2.5 * pow(r, 24.0);
    q *= vec3(1.0, s, s);
    return 0.5 * (length(12.0 * q) - 1.0) / (12.0 * s);
}

float jarron(vec3 p, out vec3 uvw)
{
    vec3 q = p - vec3(-0.1, 0.28, 0.6);
    uvw = q;
    
    float d1 = length(q) - 1.0 / 3.5;
    d1 = abs(d1 + 0.025 / 3.5) - 0.025 / 3.5;
    
    float d2 = q.y + 0.1;
    return max(d1, d2);
}

float mantelito(vec3 p, out vec3 uvw)
{
    vec3 q = p - vec3(-0.1, 0.001, 0.65);
    q.xz += 0.1 * vec2(
        0.7 * sin(6.0 * q.z + 2.0) + 0.3 * sin(12.0 * q.x + 5.0),
        0.7 * sin(6.0 * q.x + 0.7) + 0.3 * sin(12.0 * q.z + 3.0));
    
    const mat2 m2 = mat2(0.8, -0.6, 0.6, 0.8);
    q.xz = m2 * q.xz;
    uvw = q;
    
    q.y -= 0.008 * (0.5 - 0.5 * sin(40.0 * q.x) * sin(5.0 * q.z));
    
    return length(max(abs(q) - vec3(0.3, 0.001, 0.3), 0.0)) - 0.0005;
}

float botella(vec3 p, out vec3 uvw)
{
    vec3 q = p - vec3(-0.35, 0.0, 0.3);
    vec2 w = vec2(length(q.xz), q.y);

    uvw = q;
    
    float r = 1.0 - 0.8 * pow(smoothstep(0.5, 0.6, q.y), 4.0);
    r += 0.1 * smoothstep(0.65, 0.66, q.y);
    r *= 1.0 - smoothstep(0.675, 0.68, q.y);
    
    r -= clamp(q.y - 0.67, 0.0, 1.0) * 1.9;

    return (w.x - 0.11 * r) * 0.5;
}

// Maps to the closest point in scene.
// The whole scene is defined in map() function.
// Components: x: closest distance to surface
//             y: closest surface ID (so that we can shade it)
vec2 map(vec3 p, out vec3 uvw)
{
    // suelo
    float id = 0.5;
    float closest = suelo(p, uvw);
    vec3 mapped_uvw = vec3(0.0);
    
    float dist = pared(p, mapped_uvw);
    if (dist < closest) { closest = dist; id = 1.5; uvw = mapped_uvw; }
    
    dist = melon(p, mapped_uvw);
    if (dist < closest) { closest = dist; id = 2.5; uvw = mapped_uvw; }
    
    dist = manzana(p, mapped_uvw);
    if (dist < closest) { closest = dist; id = 3.5; uvw = mapped_uvw; }
    
    dist = uvas(p, mapped_uvw);
    if (dist < closest) { closest = dist; id = 4.5; uvw = mapped_uvw; }
    
    dist = lemon(p, mapped_uvw);
    if (dist < closest) { closest = dist; id = 5.5; uvw = mapped_uvw; }
    
    dist = jarron(p, mapped_uvw);
    if (dist < closest) { closest = dist; id = 6.5; uvw = mapped_uvw; }
    
    dist = mantelito(p, mapped_uvw);
    if (dist < closest) { closest = dist; id = 7.5; uvw = mapped_uvw; }
    
    dist = botella(p, mapped_uvw);
    if (dist < closest) { closest = dist; id = 8.5; uvw = mapped_uvw; }

    return vec2(closest, id);
}

vec3 getNormal(vec3 p)
{
    vec3 uvw;
    vec2 del = vec2(0.01, 0.0);
    float val = map(p, uvw).x;

    return normalize(vec3(val - map(p - del.xyy, uvw).x,
        val - map(p - del.yxy, uvw).x,
        val - map(p - del.yyx, uvw).x));
}

vec2 march(vec3 ro, vec3 rd, out vec3 uvw)
{
    const int steps = 150;
    float dist = 0.01;
    
    for (int i = 0; i < steps; i++)
    {
        vec2 info = map(ro + dist * rd, uvw);
        if (info.x < 0.001)
        {
            return vec2(dist, info.y);
        }
        dist += info.x;
    }
    return vec2(1.0, -1.0);
}



// Shade the particular point of the scene, according to shading informations
// given in the function parameters.
vec3 getColor(vec2 info, vec3 uvw, vec3 nor, out vec3 bnor)
{
    float id = info.y;
    if (id < 0.0)
    {
        // Shade sky
        return vec3(0.7, 0.9, 1.0);
    }
    else if (id > 0.0 && id < 1.0)
    {
        // Floor (suelo)
        return vec3(0.5, 0.25, 0.0);
    }
    else if (id > 1.0 && id < 2.0)
    {
        // Wall (pared)
        return vec3(0.2, 0.1, 0.0);
    }
    else if (id > 2.0 && id < 3.0)
    {
        // Melon
        return vec3(0.3, 0.8, 0.3);
    }
    else if (id > 3.0 && id < 4.0)
    {
        // Apple (manzana)
        return vec3(0.9, 0.3, 0.2);
    }
    else if (id > 4.0 && id < 5.0)
    {
        // Oranges (uvas)
        return vec3(1.0, 0.5, 0.0);
    }
    else if (id > 5.0 && id < 6.0)
    {
        // Lemon
        return vec3(1.0, 0.9, 0.0);
    }
    else if (id > 6.0 && id < 7.0)
    {
        // Bowl (jarron)
        return vec3(0.3, 0.2, 0.1);
    }
    else if (id > 7.0 && id < 8.0)
    {
        // Doily (mantelito)
        return vec3(0.3, 0.4, 0.7);
    }
    else if (id > 8.0 && id < 9.0)
    {
        // Bottle (botella)
        return vec3(0.6, 0.5, 0.1);
    }
    // Unknown
    return vec3(1.0, 0.0, 1.0);
}

const vec3 rlight = vec3(3.62, 2.99, 0.71);
vec3 lig = normalize(rlight);

// Shadow marching
float softShadow(vec3 ro, vec3 rd, float k)
{
    float res = 1.0;
    float t = 0.001;
    vec3 trash;
    for (int i = 0; i < 64; i++)
    {
        vec2 info = map(ro + rd * t, trash);
        res = min(res, smoothstep(0.0, 1.0, k * info.x / t));
        if (res < 0.001)
        {
            break;
        }
        t += clamp(info.x, 0.01, 1.0);
    }
    return clamp(res, 0.0, 1.0);
}

float directLighting(vec3 pos, vec3 nor)
{
    vec3 front = lig;
    vec3 right = normalize(cross(front, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, front);
    
    float shadowIntensity = softShadow(pos + 0.001 * nor, lig, 10.0);
    
    vec3 toLight = rlight - pos;
    float att = smoothstep(0.985, 0.997, dot(normalize(toLight), lig));

    vec3 pp = pos - front * dot(pos, front);
    vec2 uv = vec2(dot(pp, right), dot(pp, up));
    float pat = smoothstep(-0.5, 0.5, sin(10.0 * uv.y));
    
    return pat * att * shadowIntensity;
}

float calcAO(vec3 p, vec3 nor, vec2 px)
{
    float off = 0.1 * dot(px, vec2(1.2, 5.3));
    float ao = 0.0;
    
    vec3 trash;
    for (int i = 0; i < 20; i++)
    {
        // Generate a random sample point (0 to 1)
        vec3 aoPos = 2.0 * hash3(float(i) * 213.47 + off) - 1.0;
        // Moves closer to center of the sphere
        aoPos = aoPos * aoPos * aoPos;
        // Flip points so we are now only sampling in the hemisphere
        aoPos *= sign(dot(aoPos, nor));
        // Sample those points and magnify them by 48 times
        ao += clamp(map(p + nor * 0.015 + 0.015 * aoPos, trash).x * 48.0, 0.0, 1.0);
    }
    // Calculate the average ambient occlusion value
    ao /= 20.0;
    return clamp(ao * ao, 0.0, 1.0); 
}


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    
    vec3 ro = vec3(1.0, 0.5, 1.0);
    vec3 center = vec3(0.0, 0.2, 0.2);
    vec3 front = normalize(center - ro);
    vec3 right = normalize(cross(front, vec3(0.0, 1.0, 0.0)));
    vec3 up = normalize(cross(right, front));
    mat3 lookAt = mat3(right, up, front);
    vec3 rd = lookAt * normalize(vec3(uv, 1.8));
    vec3 uvw = vec3(0.0);
    
    vec2 info = march(ro, rd, uvw);
    vec3 p = ro + info.x * rd;
    vec3 nor = getNormal(p);
    vec3 bnor = vec3(0.0);
    vec3 obj = getColor(info, uvw, nor, bnor);
    
    // Postprocess normal...
    
    vec3 ref = reflect(rd, nor);
    
    // Lighting components
    vec3 lightDir = normalize(vec3(1.0, 1.0, 0.0));
    float occ = calcAO(p, nor, uv * 0.5 + 0.5);
    float ambient = 1.0;
    float sha = directLighting(p, nor);
    float bfl = clamp(-nor.y * 0.8 + 0.2, 0.0, 1.0) * pow(clamp(1.0 - p.y, 0.0, 1.0), 2.0); // Bottom
    float bce = clamp(nor.y * 0.8 + 0.2, 0.0, 1.0); // Dome
    float dif = max(dot(nor, lig), 0.0); // Diffuse
    float bac = max(dot(nor, normalize(-vec3(-lig.x, 0.0, -lig.z))), 0.0); // Back
    float fre = pow(clamp(1.0 + dot(nor, rd), 0.0, 1.0), 3.0); // Fringe
    float spe = 0.04 + 0.96 * pow(clamp(dot(ref, lig), 0.0, 1.0), 5.0);
    
    float att = 0.1 + 0.9 * smoothstep(0.975, 0.997, dot(normalize(rlight - p), lig));
    
    // Lights
    vec3 lin = vec3(0.0);
    lin += ambient * vec3(0.08, 0.1, 0.12) * att * occ;
    lin += bfl * vec3(0.5 + att * 0.5, 0.3, 0.1) * att * occ;
    lin += bce * vec3(0.3, 0.2, 0.2) * att * occ;
    lin += bac * vec3(0.4, 0.35, 0.3) * att * occ;
    lin += dif * vec3(2.5, 1.8, 1.3) * pow(vec3(sha), vec3(1.0, 1.3, 1.6));
    lin += fre * vec3(3.0, 3.0, 3.0) * occ * att * (0.25 + 0.75 * dif * sha);
    lin += spe * vec3(3.0, 3.0, 3.0) * occ * att * dif * sha * info.x;

    vec3 color = vec3(0.0);
    color += lin * obj;

    color = pow(clamp(color, 0.0, 1.0), vec3(0.4545));
    
    // Postprocessing
    // Contrast
    color = color * 0.6 + 0.4 * color * color * (3.0 - 2.0 * color);
    // Saturation
    color = mix(color, vec3(dot(color, vec3(0.33))), 0.2);
    // Curves
    color = pow(color, vec3(0.85, 0.95, 1.0));
    // Vignetting
    vec2 q = fragCoord.xy / iResolution.xy;
    color *= 0.7 + 0.3 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.15);

    fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}