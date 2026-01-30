precision highp float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c,s,-s,c);
}

float box(vec3 p, float s) {
    p = abs(p) - s;
    return max(max(p.x, p.y), p.z);
}

float ifsBox(vec3 p) {
    /*for(int i=0; i<3; i++) {
        p = abs(p) - 1.; // Fold
        p.xz *= rot(1.); // 回転
        p.xy *= rot(1.); // 回転
    }*/
    return box(p, 2.6);
}

float map(vec3 p) {
    p.xy *= rot(time);
    p.xz *= rot(time);
    return ifsBox(p);
}

void main(void) {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y)*1.;

    vec3 cPos = vec3(mouse.x - 0.5, mouse.y - 0.5, 10.0);
	cPos = vec3(0.0, 0.0, 30.0 - 30.*mouse.y);
    vec3 cDir = vec3(0.0, 0.0, -1.0);
    vec3 cUp  = vec3(0.0, 1.00, 0.0);
    vec3 cSide = cross(cDir, cUp);

    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir);

    float dist = 0.0;
    float t = 0.01;
    float acc = 0.0;
    for (int i = 0; i < 80; i++){
        vec3 pos = cPos + ray * t;
        dist = map(pos);

    	dist = max(abs(dist), 0.02);
    	acc += exp(-dist*3.0);

    	t += dist*0.5;
    }

    vec3 col = vec3(acc * 0.013);
    gl_FragColor = vec4(col, 1.0);
}
