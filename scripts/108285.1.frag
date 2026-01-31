#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec4 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
#define iMouse mouse

highp mat4 transpose(in highp mat4 inMatrix) {
    highp vec4 i0 = inMatrix[0];
    highp vec4 i1 = inMatrix[1];
    highp vec4 i2 = inMatrix[2];
    highp vec4 i3 = inMatrix[3];

    highp mat4 outMatrix = mat4(
                 vec4(i0.x, i1.x, i2.x, i3.x),
                 vec4(i0.y, i1.y, i2.y, i3.y),
                 vec4(i0.z, i1.z, i2.z, i3.z),
                 vec4(i0.w, i1.w, i2.w, i3.w)
                 );

    return outMatrix;
}
highp mat4 inverse(in highp mat4 inMatrix) {
	
    highp mat4 outMatrix = 1.0/inMatrix;
    return outMatrix;
}
// --------[ Original ShaderToy begins here ]---------- //
// Mesh resolution
#define RES vec3(0.75)
#define EPSILON 1.

// Inigo Quilez's polynomial smooth minimum from https://iquilezles.org/articles/smin:
float smin(in float a, in float b, in float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}
float opSubstract(float sdf1, float sdf2){
    return max(-sdf1, sdf2);
}
float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float mapScene(in vec3 p) {
    float dist = length(p - vec3(-1.0, -1.0 + sin(iTime), 1.0)) - 1.;
    dist = smin(dist, length(p - vec3(1.0, 1.0 + 0.5 * cos(iTime), -1.0)) - 2.0, 1.5);
    dist = smin(dist, length(p - vec3(-4.0, 1.0, 0.5)) - 2.0, 1.0);
    dist = smin(dist, length(p - vec3(-2.0, 1.0, -3.0)) - 1.0, 2.25);
    dist = smin(dist, length(p - vec3(3.0 + cos(iTime), -1.0, -1.0)) - 1.0, 1.0);
    return dist;
}

// Meshify!
float mapMesh(in vec3 p, out vec3 nor,out bool isDrawn) {
    vec3 pos = floor(p / RES) * RES;
    vec3 uvw = (p - pos) / RES;

    // Determine the vertices of the tetrahedron we're in
    vec3 v0 = dot(uvw, vec3( 1,  1,  1)) > 2.0 ? vec3(1, 1, 1) : vec3(0, 0, 0);
    vec3 v1 = dot(uvw, vec3(-1, -1,  1)) > 0.0 ? vec3(0, 0, 1) : vec3(1, 1, 0);
    vec3 v2 = dot(uvw, vec3(-1,  1, -1)) > 0.0 ? vec3(0, 1, 0) : vec3(1, 0, 1);
    vec3 v3 = dot(uvw, vec3( 1, -1, -1)) > 0.0 ? vec3(1, 0, 0) : vec3(0, 1, 1);

    // Solve for barycentric coordinates
    mat4 map = inverse(transpose(mat4(v0, 1,
                                             v1, 1,
                                             v2, 1,
                                             v3, 1)));
    vec4 bary = vec4(uvw, 1) * map;

    // Calculate isovalues at the tetrahedron vertices
    vec4 isovals = vec4(
        mapScene(pos + v0 * RES),
        mapScene(pos + v1 * RES),
        mapScene(pos + v2 * RES),
        mapScene(pos + v3 * RES)
    );
    int PCount = 0;
    if (bary.x >= -EPSILON && bary.x <= EPSILON){
        PCount++;
    }
    if (bary.y >= -EPSILON && bary.y <= EPSILON){
        PCount++;
    }
    if (bary.z >= -EPSILON && bary.z <= EPSILON){
        PCount++;
    }
    if (bary.w >= -EPSILON && bary.w <= EPSILON){
        PCount++;
    }
    
    nor = normalize((map * isovals).xyz / RES); // Normalized gradient
    
    if (PCount >= 2){
        isDrawn = true;
    } else {isDrawn = false;}
    
    return dot(isovals, bary); // Interpolate isovalues
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 center = 0.5 * iResolution.xy;
    vec2 mouse = (iMouse.xy - center) / iResolution.y * 3.14;
    vec2 uv = (fragCoord - center) / iResolution.y;
    fragColor = vec4(0.33375, 0.36, 0.3, 1.0);

    // Default before interaction
    if (ivec2(iMouse) == ivec2(0)) mouse = vec2(-0.25, -0.5);

    // Calculate ray
    vec3 ro = vec3(0.0, 0.0, 6.0);
    vec3 rd = normalize(vec3(uv, -1.0));

    // Rotate with mouse
    float cy = cos(mouse.x), sy = sin(mouse.x);
    float cp = cos(mouse.y), sp = sin(mouse.y);

    ro.yz *= mat2(cp, -sp, sp, cp);
    ro.xz *= mat2(cy, -sy, sy, cy);
    rd.yz *= mat2(cp, -sp, sp, cp);
    rd.xz *= mat2(cy, -sy, sy, cy);

    // Raymarch
    float t = 0.0;
    vec3 nor;
    bool isDrawn = false;
    for (int i=0; i < 200; i++) {
    
        vec3 p = ro + rd * t;
        
        float dist = mapMesh(p, nor, isDrawn);
        
        if (dist < 0.001) {
            if (isDrawn == true){
                   fragColor.rgb = 0.5 + 0.5 * nor;
            }
            break;
        }

        if (t > 30.0) {
            break;
        }

        t += dist;
    }
}


// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
