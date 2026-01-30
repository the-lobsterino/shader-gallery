precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0,2.0 / 3.0,1.0 / 3.0,3.0);
    vec3 p = abs(fract(c.xxx + K.xyz)* 6.0 - K.www);
    return c.z * mix(K.xxx,clamp(p - K.xxx,0.0,1.0),c.y);
}

void main() {
    vec2 p = (-resolution.xy + 2.0*gl_FragCoord.xy) / max(resolution.x, resolution.y);
    float time = time * 1.1;
    float scalar = abs(1.0 / (p.x * p.y)) * (cos(time)*1.5 + 1.0) * 0.5;
    float dist = length(mod(p, tan(p)));
    float spiralScalar = pow(dist, 2.25) * scalar * 60.0;
    vec3 color = hsv2rgb(vec3(spiralScalar, 1.0, 1.0));
    gl_FragColor = vec4(color, 1.0);
}