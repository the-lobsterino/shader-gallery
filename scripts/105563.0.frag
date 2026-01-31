#version 100
precision mediump float;

varying lowp vec2 uv;
uniform sampler2D screenTexture;

uniform float factor; // %0.5% 0..1

void main() {
  gl_FragColor = mix(texture2D(screenTexture, uv), vec4(1.0, 0.0, 0.0, 1.0), factor);
}

