/*
code this disgraceful should not produce such elegance
*/

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float what(vec2 position) {
float dist  = distance(position, vec2(0.5-(sin(0.09)/100.0)+tan(2.0*position.y),0.5-(cos(0.06)/135.0)));
float wtf = (sin(3.14159*(dist+0.008/50.0)*10.0));
wtf = 1.0-abs(wtf);
wtf = pow(wtf, 5000.0);
return wtf;
}

void main( void ) {
vec2 p =(gl_FragCoord.xy/resolution.xy);
p.x+=time*.00003;
p.y+=0.5;
float wtf = what(p);
vec3 col = vec3(wtf-0.5*wtf,wtf-0.06*wtf,wtf-0.09*wtf);	
gl_FragColor = vec4( col, 1.0 );
}