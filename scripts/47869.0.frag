precision mediump float;

uniform vec2 resolution;
uniform float time;

void main() {
    vec2 R = resolution;
    vec2 uv = (2. * gl_FragCoord.xy - R) / max(R.x, R.y);
    vec3 image = vec3(1.);
    gl_FragColor = vec4(image, 1.);

}