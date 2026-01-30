precision highp float;
uniform vec2      resolution;
uniform float     time;
uniform vec2      speed;
uniform float     shift;
varying vec2      vTextureCoord;

float rand(vec2 n) {
    return fract(cos(dot(n, vec2(2.9898, 20.1414))) * 5.5453);
}

float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.000002), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n){
    float total=0.,amplitude=2.5;
    for(int i=0;i<18;i++){
        total+=noise(n)*amplitude;
        n+=n;
        amplitude*=.45;
    }
    return total;
}

void main(void){
    vec2 p = gl_FragCoord.xy * 10. / resolution.xx;
    float q = fbm(p - time * 0.07);
    vec2 r = vec2(fbm(p + q + time * speed.x - p.x - p.y), fbm(p + q - time * speed.y));
    vec3 originalColor = mix(vec3(0.169,0.169,0.169), vec3(0.337,0.337,0.337), fbm(p + r));

    // Make colors darker
    vec3 darkenedColor = originalColor * 0.2; // You can adjust the factor (0.5) to control darkness

    float grad = gl_FragCoord.y / resolution.y;
    gl_FragColor = vec4(darkenedColor * cos(shift * gl_FragCoord.y / resolution.y), 1.5);
    gl_FragColor.xyz *= 2.15 - grad;
}
