precision mediump float;
uniform vec2  mouse;       // mouse
uniform float time;       // time
uniform vec2  resolution;       // resolution
uniform sampler2D smp; // prev scene
const float PI = 3.1415926;

uniform sampler2D uSampler;
uniform float ratio;

varying vec2 vTextureCoord;

void main() {

    vec3 color = texture2D(uSampler, vTextureCoord ).rgb;
    vec4 alpha = texture2D(uSampler, vTextureCoord).aaaa;

    gl_FragColor = vec4(color, alpha);
}



