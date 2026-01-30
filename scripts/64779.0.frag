/*
 * Original shader from: https://www.shadertoy.com/view/WstSW7
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
float sdBox( in vec2 p, in vec2 b ) {
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}

float sdRoundedBox(vec2 p, vec2 b, float r) {
    return sdBox(p, b) - r;
}

float sdLine( in vec2 p, in vec2 a, in vec2 b ) {
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

float sdEqTriangle( in vec2 p ) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y);
}

float sdCircle( vec2 p, float r ){
    return length(p) - r;
}

float getDist(vec2 uv) {
    float finalD, d;

    d = sdEqTriangle(uv * vec2(1.0, 0.9) - vec2(0.0, -0.1)) - length(uv) * 0.1 + 0.37;
    finalD = d;

    d = sdCircle(uv - vec2(0.0, -1.15), 0.9);
    finalD = -min(d, -finalD);
    
    d = sdCircle(uv * vec2(0.9, 0.5) - vec2(0.0, -0.1), 0.1);
    finalD = -min(d, -finalD);

    float angle = -2.8;
    mat2 rot = mat2(cos(angle), sin(angle),
                   -sin(angle), cos(angle));
    vec2 rotUv = uv * rot;
    d = sdEqTriangle(rotUv * vec2(2.0, 0.5) - vec2(sin(-rotUv.y * 4.) * 0.5 - 0.25, -0.13)) + 0.53;
    finalD = -min(d, -finalD);

    angle = 1.015;
    rot = mat2(cos(angle), sin(angle),
              -sin(angle), cos(angle));
    rotUv = uv * rot;
    d = sdEqTriangle(rotUv * vec2(3.0, 0.5) - vec2(sin(-rotUv.y * 4.) * 0.5 - 0.50, -0.22)) + 0.53;
    finalD = -min(d, -finalD);

    return finalD;
}

vec3 getColor(vec2 uv) {
    float d = sign(getDist(uv)) * 0.5 + 0.5;
    vec3 col = mix(vec3(0.2), vec3(0.09, 0.57, 0.81), 1.0 - d);

    float dt = 0.01;
    float shadow = sign(getDist(uv + vec2(-dt, dt))) * 0.5 + 0.5;
    col *= 1.0 - (d - shadow) * 0.3;
    return col;
}

vec3 aa(vec2 uv, float d) {
    vec3 e = vec3(d, -d, 0.0);
    vec3 total = vec3(0.);
    total += getColor(uv+e.yx) + getColor(uv+e.zx) + getColor(uv+e.xx);
    total += getColor(uv+e.yz) + getColor(uv+e.zz) + getColor(uv+e.xz);
    total += getColor(uv+e.yy) + getColor(uv+e.zy) + getColor(uv+e.xy);
    
    return total / 9.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    vec3 col = aa(uv, 0.001);

    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}