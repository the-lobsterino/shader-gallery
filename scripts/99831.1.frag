#ifdef GL_ES
precision mediump float;
#endif
uniform float time; //speedhead of (B) was here
uniform vec2 resolution;
void main( void ) {
vec2 p = ( gl_FragCoord.xy / resolution.xy ) * .50 - sin(gl_FragCoord.x*time*0.0001);
float color  = 2.*(.1+abs(sin(sin(.5)+(p.x*p.x+(.50)*1.))))+((3.1415*0.5))*(p.x+=(time*.1));
gl_FragColor = 8.*vec4(1.5,0.5,1.0,1.0)*vec4(sin(44.*color*.1)*abs(1.*(cos(fract(p.x*.5))))*sin(vec3(1.0 * sin(33.*p.x*p.y*2.)))*vec3(sin(p.x*33.*.25),sin(p.y*33.*.5),sin(.09)),1.);}