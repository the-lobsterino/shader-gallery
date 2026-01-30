#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float smoothen(float d1, float d2) {
    float k = 1.5;
    return -log(exp(-k * d1) + exp(-k * d2)) / k;
}

void main( void ) {

    vec2 st = gl_FragCoord.xy/resolution.xy;
    vec2 p0 = vec2(cos(time) * 0.3 + 0.5, 0.5);
    vec2 p1 = vec2(-cos(time) * 0.3 + 0.5, 0.5);
    float d = smoothen(distance(st, p0) * 5.0, distance(st, p1) * 5.0);
    float ae = 5.0 / resolution.y;
//    vec3 color = vec3(smoothstep(0.8, 0.8+ae, d));
    vec3 color = vec3(d);
    gl_FragColor = vec4(color, 1.0);

}


//https://thebookofshaders.com/edit.php?log=160414040804
