precision mediump float;

uniform vec2 resolution;
uniform float time; // For animation

vec3 barycentricCoordinates(vec2 p, vec2 a, vec2 b, vec2 c) {
    vec2 v0 = b - a, v1 = c - a, v2 = p - a;
    float den = v0.x * v1.y - v1.x * v0.y;
    vec3 bary;
    bary.x = (v2.x * v1.y - v1.x * v2.y) / den;
    bary.y = (v0.x * v2.y - v2.x * v0.y) / den;
    bary.z = 1.0 - bary.x - bary.y;
    return bary;
}

bool insideTriangle(vec2 p, vec2 a, vec2 b, vec2 c) {
    vec3 bary = barycentricCoordinates(p, a, b, c);
    return bary.x >= 0.0 && bary.y >= 0.0 && bary.z >= 0.0;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv = 2.0 * uv - 1.0;
    uv.y = -uv.y;

    vec2 a1 = vec2(-0.5, -0.5773); // Adjusted coordinates for better overlap
    vec2 b1 = vec2(0.5, -0.5773);
    vec2 c1 = vec2(0.0, 1.1547);

    vec2 a2 = vec2(-0.5, 0.5773);
    vec2 b2 = vec2(0.5, 0.5773);
    vec2 c2 = vec2(0.0, -1.1547);

    bool inTri1 = insideTriangle(uv, a1, b1, c1);
    bool inTri2 = insideTriangle(uv, a2, b2, c2);

    float dist = distance(uv, vec2(0.0, 0.0));
    vec3 color = mix(vec3(0.5*sin(time)+0.5, 0.5*cos(time)+0.5, 0.2), vec3(0.2, 0.5*sin(time*1.5)+0.5, 1.0), dist);

    if (inTri1 || inTri2) {
        gl_FragColor = vec4(color, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
