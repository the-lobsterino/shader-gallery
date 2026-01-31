//SPATIOSA by SPEEDHEAD
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

void main() {
vec2 uv = gl_FragCoord.xy / resolution.xy;
uv.x+=time*.5;
float aaa = fract(sin(dot(uv, vec2(.1, 2.))) * 2.);
float bbb = step(aaa, 0.1);
vec3 ccc = vec3(bbb);
if (uv.y<0.5)gl_FragColor = vec4(ccc*vec3(0.0,2.25,0.), 1.0);
if (uv.y>0.5)gl_FragColor += vec4(vec3(0.0,0.,.55), 1.0);
}