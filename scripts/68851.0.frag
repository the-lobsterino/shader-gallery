#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D iChannel0;


#define INTENSITY 4.5
#define GLOW 4.0

vec3 blob(vec2 uv, vec3 color, vec2 speed, vec2 size, float time) {
vec2 point = vec2(
tan(sin(speed.x) * time) * size.x,
cos(speed.y * time) * size.y
);

float d = 1.0 / distance(uv, point);
d = pow(d / INTENSITY, GLOW);

return vec3(color.r * d, color.g * d, color.b * d);
}

void main() 

  {
vec2 uv = -1.0 + 2.0 * (gl_FragCoord.xy / resolution.xy);

float freqBlue = texture2D(iChannel0, vec2(0.1,0.25)).x * 4.0;
float freqGreen = texture2D(iChannel0, vec2(0.1,0.25)).x * 2.0;

vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
color.rgb += blob(uv, vec3(1.0, 0.3 * freqGreen, 0.5 * freqBlue), vec2(1.7, 2.2), vec2(0.4, 0.1), time);
color.rgb += blob(uv, vec3(1.0, 0.3 * freqGreen, 0.5 * freqBlue), vec2(1.2, 2.3), vec2(0.3, 0.2), time);
color.rgb += blob(uv, vec3(1.0, 0.3 * freqGreen, 0.5 * freqBlue), vec2(2.3, 2.1), vec2(0.2, 0.3), time);
color.rgb += blob(uv, vec3(1.0, 0.3 * freqGreen, 0.5 * freqBlue), vec2(2.1, 1.0), vec2(0.1, 0.4), time);

gl_FragColor = color;
}