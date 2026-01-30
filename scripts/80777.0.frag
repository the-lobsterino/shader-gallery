#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 circle(vec2 p) {
   return vec2(length(p), 0.7);
}


vec2 square(vec2 p) {
   return vec2(abs(p.x) + abs(p.y), 1);
}


void main() {
   int pair = int(floor(mod(time, 1.0)));
   
   vec2 p = (gl_FragCoord.xy * 2.0 - resolution) /
       min(resolution.x, resolution.y);
   float a;
   if(time < 1.0) a = smoothstep(0.2, 0.8, mod(time, 1.0));
   else a = 0.999;
   vec2 d = mix(circle(p), square(p), a);
   vec3 color = mix(vec3(0), vec3(1), step(d.y, d.x));
   
   gl_FragColor = vec4(color, 1.0);
}


