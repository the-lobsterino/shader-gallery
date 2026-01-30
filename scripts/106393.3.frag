
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sun(vec2 uv, float battery)
{
    float val = smoothstep(0.3, 0.29, length(uv));
    float bloom = smoothstep(0.7, 0.0, length(uv));
    float cut = 3.0 * sin((uv.y + time * 0.2 * (battery + 0.02)) * 100.0) +
                clamp(uv.y * 14.0 + 1.0, -6.0, 6.0);
    cut = clamp(cut, 0.0, 1.0);
    return clamp(val * cut, 0.0, 1.0) + bloom * 0.6;
}

float grid(vec2 uv, float battery)
{
    vec2 size = vec2(uv.y, uv.y * uv.y * 0.2) * 0.01;
    uv += vec2(0.0, time * 1.0 * (battery + 0.05));
    uv = abs(fract(uv) - 0.5);
    vec2 lines = smoothstep(size, vec2(0.0), uv);
    lines += smoothstep(size * 5.0, vec2(0.0), uv) * 0.4 * battery;
    return clamp(lines.x + lines.y, 0.0, 1.0);
}

float dot2(in vec2 v) { return dot(v, v); }

float sdTrapezoid(in vec2 p, in float r1, float r2, float he)
{
    vec2 k1 = vec2(r2, he);
    vec2 k2 = vec2(r2 - r1, 2.0 * he);
    p.x = abs(p.x);
    vec2 ca = vec2(p.x - min(p.x, (p.y < 0.0) ? r1 : r2), abs(p.y) - he);
    vec2 cb = p - k1 + k2 * clamp(dot(k1 - p, k2) / dot2(k2), 0.0, 1.0);
    float s = (cb.x < 0.0 && ca.y < 0.0) ? -1.0 : 1.0;
    return s * sqrt(min(dot2(ca), dot2(cb)));
}

float sdLine(in vec2 p, in vec2 a, in vec2 b)
{
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

float sdBox(in vec2 p, in vec2 b)
{
    vec2 d = abs(p) - b;
    return length(max(d, vec2(0))) + min(max(d.x, d.y), 0.0);
}

float opSmoothUnion(float d1, float d2, float k)
{
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}

float sdCloud(in vec2 p, in vec2 a1, in vec2 b1, in vec2 a2, in vec2 b2, float w)
{
    float lineVal1 = sdLine(p, a1, b1);
    float lineVal2 = sdLine(p, a2, b2);
    vec2 ww = vec2(0.0, 0.0);
    vec2 left = max(a1 + ww, a2 + ww);
    vec2 right = min(b1 - ww, b2 - ww);
    vec2 boxCenter = (left + right) * 0.5;
    float boxVal = sdBox(p - boxCenter, vec2(0.04, abs(a2.y - a1.y) * 0.5)) + w;
    float uniVal1 = opSmoothUnion(lineVal1, boxVal, 0.05);
    float uniVal2 = opSmoothUnion(lineVal2, boxVal, 0.05);
    return min(uniVal1, uniVal2);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (1.80 * fragCoord.xy - resolution.xy) / resolution.y;
    float battery = 1.0;

    // Grid
    float fog = smoothstep(0.5, -1.02, abs(uv.y + 0.2));
    vec3 col = vec3(1.0, 1.1, 1.1);

    if (uv.y < -0.2)
    {
	    
        uv.y = 1.0 / (abs(uv.y + 0.2) + 0.05);
        uv.x *= uv.y * 1.0;
        float gridVal = grid(uv, battery);
        col = mix(col, vec3(1.0, 1.0, 1.0), gridVal);
    }
    else
    {
        float fujiD = min(uv.y * 0.2 - 0.5, 0.0);
        uv.y -= battery * 1.0 - 0.51;
        vec2 sunUV = uv;
        vec2 fujiUV = uv;

    }

    col = mix(vec3(col.r, col.r, col.r) * 0.5, col, battery * 0.7);

    fragColor = vec4(col, 1.5);
}

void main(void)
{
    vec4 fragColor;
 
    fragColor = vec4(.0, 1.0, 1.0, 1.0); // Fond blanc
	
	mainImage(fragColor, gl_FragCoord.xy);

    gl_FragColor = fragColor;
}
