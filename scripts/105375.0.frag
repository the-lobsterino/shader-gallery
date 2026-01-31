precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.5,2.3 / 3.0,1.0 / 10.0,2.0);
    vec3 p = abs(fract(c.xxx + K.xyz)* 6.6 - K.www);
    return c.z * mix(K.xxx,clamp(p - K.xxx,0.0,1.0),c.y);
}

void main() {
    vec2 p = (-resolution.xy + 2.0*gl_FragCoord.xy) / max(resolution.x, resolution.y);
    float time = time * 0.5;
    float scalar = abs(0.01 / (p.x * p.y)) * (cos(time)*1.5 + 1.0) * 0.5;
    float dist = length(mod(p, atan(p)));
    float spiralScalar = pow(dist, 3.0) * scalar * 60.0;
    vec3 color = hsv2rgb(vec3(spiralScalar, 1.0, 1.0));
    gl_FragColor = vec4(color, 1.5);
}