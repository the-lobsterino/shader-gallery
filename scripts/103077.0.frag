#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

























































































































































uniform vec2 mouse;
uniform vec2 resolution;

bool drawRect(vec2 uv, vec2 position, vec2 size) {
    vec2 delta = abs(uv - position);
    return delta.x < size.x && delta.y < size.y;
}

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 color = vec3(0.0);

    vec2 charSize = vec2(0.05, 0.1);
    vec2 gap = vec2(0.01, 0.01);

    // 's' character
    if (drawRect(uv, vec2(0.1, 0.5), charSize) ||
        drawRect(uv, vec2(0.1, 0.4), vec2(charSize.x, gap.y)) ||
        drawRect(uv, vec2(0.1, 0.6), vec2(charSize.x, gap.y))) {
        color = vec3(1.0, 0.0, 0.0);
    }

    // 'u' character
    if (drawRect(uv, vec2(0.2, 0.5), charSize) ||
        drawRect(uv, vec2(0.25, 0.6), vec2(gap.x, charSize.y))) {
        color = vec3(0.0, 1.0, 0.0);
    }

    // 'b' character
    if (drawRect(uv, vec2(0.3, 0.5), charSize) ||
        drawRect(uv, vec2(0.3, 0.4), vec2(charSize.x, gap.y)) ||
        drawRect(uv, vec2(0.3, 0.6), vec2(charSize.x, gap.y)) ||
        drawRect(uv, vec2(0.35, 0.5), vec2(gap.x, charSize.y))) {
        color = vec3(0.0, 0.0, 1.0);
    }

    // 't' character
    if (drawRect(uv, vec2(0.4, 0.5), vec2(charSize.x, gap.y)) ||
        drawRect(uv, vec2(0.42, 0.5), vec2(gap.x, charSize.y))) {
        color = vec3(1.0, 1.0, 0.0);
    }

    // 'o' character
    if (drawRect(uv, vec2(0.5, 0.5), charSize) ||
        drawRect(uv, vec2(0.5, 0.4), vec2(charSize.x, gap.y)) ||
        drawRect(uv, vec2(0.5, 0.6), vec2(charSize.x, gap.y))) {
        color = vec3(1.0, 0.0, 1.0);
    }

    // 'p' character
    if (drawRect(uv, vec2(0.6, 0.5), charSize) ||
drawRect(uv, vec2(0.6, 0.4), vec2(charSize.x, gap.y)) ||
drawRect(uv, vec2(0.6, 0.6), vec2(charSize.x, gap.y)) ||
drawRect(uv, vec2(0.65, 0.5), vec2(gap.x, charSize.y))) {
color = vec3(0.0, 1.0, 1.0);
}
	// 'v' character
if (drawRect(uv, vec2(0.7, 0.5), vec2(gap.x, charSize.y)) ||
    drawRect(uv, vec2(0.75, 0.6), vec2(charSize.x, gap.y)) ||
    drawRect(uv, vec2(0.8, 0.5), vec2(gap.x, charSize.y))) {
    color = vec3(0.5, 0.5, 0.0);
}

// 'p' character
if (drawRect(uv, vec2(0.9, 0.5), charSize) ||
    drawRect(uv, vec2(0.9, 0.4), vec2(charSize.x, gap.y)) ||
    drawRect(uv, vec2(0.9, 0.6), vec2(charSize.x, gap.y)) ||
    drawRect(uv, vec2(0.95, 0.5), vec2(gap.x, charSize.y))) {
    color = vec3(0.5, 0.0, 0.5);
}

// 'b' character
if (drawRect(uv, vec2(1.0, 0.5), charSize) ||
    drawRect(uv, vec2(1.0, 0.4), vec2(charSize.x, gap.y)) ||
    drawRect(uv, vec2(1.0, 0.6), vec2(charSize.x, gap.y)) ||
    drawRect(uv, vec2(1.05, 0.5), vec2(gap.x, charSize.y))) {
    color = vec3(0.0, 0.5, 0.5);
}

// '0' character
if (drawRect(uv, vec2(1.1, 0.5), charSize) ||
    drawRect(uv, vec2(1.1, 0.4), vec2(charSize.x, gap.y)) ||
    drawRect(uv, vec2(1.1, 0.6), vec2(charSize.x, gap.y)) ||
    drawRect(uv, vec2(1.15, 0.4), vec2(gap.x, charSize.y)) ||
    drawRect(uv, vec2(1.15, 0.6), vec2(gap.x, charSize.y))) {
    color = vec3(0.5, 0.5, 0.5);
}

// 't' character
if (drawRect(uv, vec2(1.2, 0.5), vec2(charSize.x, gap.y)) ||
    drawRect(uv, vec2(1.22, 0.5), vec2(gap.x, charSize.y))) {
    color = vec3(0.25, 0.25,0.25);
}
	gl_FragColor = vec4(color, 1.0);
}

