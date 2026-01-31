#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
vec2 p= 4.*( gl_FragCoord.xy / resolution.xy );
vec4 col=vec4(sin(time*.50),0.15,.350,1.0);
gl_FragColor = mix(col.xyzw,cos(1.25*col.yyxz),p.g);
}