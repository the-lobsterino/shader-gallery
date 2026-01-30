precision highp float;
uniform vec2 resolution;
uniform float time;
#define _ vec2((gl_FragCoord.xy*2.001-resolution.xy )/resolution.y)
void main(){
	highp float c = abs(0.01/sin(_.x *12.)- cos( _.y) )* abs(0.001 / sin( _.y * 12.) - .1 / cos(_.x ) );
	gl_FragColor.rgb = vec3(1., 0., 0.) * 0.1 + sqrt( vec3(.2, .2, .9) * max(0.001, dot( c , .15/length(_ - vec2(.21-sin(time), cos(time*.5) ) ) ) ) ) ;
	gl_FragColor.a = 1.;
}