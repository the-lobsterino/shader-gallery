#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
vec2 p = gl_FragCoord.xy/resolution.xy*2.-1.;

for (float i = 0.0; i < 32.0; i += 1.0){
p=abs(p);
p-=0.5;
p*=1.1;
p*=mat2(cos(0.2),-sin(0.2),sin(0.2),cos(0.2));
}

gl_FragColor = vec4(vec3(length(p)), 1.0);
}