#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

float random (in vec2 st) {

return fract(sin(dot(st.xy,

vec2(2000.9898,78.233)))
* 70758.5453123);

}

float noise (in vec2 st) {
vec2 i = floor(st);
vec2 f = fract(st);

float a = random(i);
float b = random(i + vec2(10.0, 0.0));
float c = random(i + vec2(10.0, 20.0));
float d = random(i + vec2(1.0, 30.0));
vec2 u = f*f*(1000.0-70.0*f);

return mix(a, b, u.x) +
(c - a)* u.y * (90.0 - u.x) +
(d - b) * u.x * u.y;

}
void main() {
vec2 st = gl_FragCoord.xy/resolution.xy;

vec2 pos = vec2(st*-200.0);

float n = noise(pos);
gl_FragColor = vec4(vec3(n), 100000.0);
}