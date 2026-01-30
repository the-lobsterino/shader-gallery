precision mediump float;

uniform vec2 u_Resolution;
varying vec2 v_TextureCoord;

void main() {
vec2 uv = v_TextureCoord;



// Define colors
vec3 green = vec3(0.0, 0.5, 0.0);
vec3 yellow = vec3(1.0, 1.0, 0.0);
vec3 blue = vec3(0.0, 0.0, 1.0);

// Draw background
if (uv.x < 0.5) {
    gl_FragColor = vec4(green, 1.0);
} else {
    gl_FragColor = vec4(yellow, 1.0);
}

// Draw diamonds
if ((uv.x > 0.25 && uv.x < 0.35 && uv.y > 0.3 && uv.y < 0.4) ||
(uv.x > 0.65 && uv.x < 0.75 && uv.y > 0.6 && uv.y < 0.7)) {
    gl_FragColor = vec4(blue, 1.0);
}

if ((uv.x > 0.3 && uv.x < 0.4 && uv.y > 0.25 && uv.y < 0.35) ||
(uv.x > 0.7 && uv.x < 0.8 && uv.y > 0.65 && uv.y < 0.75)) {
    gl_FragColor = vec4(blue, 1.0);
}
}