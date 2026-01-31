#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;


void main(void)
{
  vec2 p = gl_FragCoord.xy/resolution.xy;
	p+=800.+(time*99990.);
vec4 final=vec4(vec3(
step(fract((mod(floor((p=(p.xy+gl_FragCoord.xy-resolution)/resolution.y).y/.91+.6)+floor(p.x/.5+.8), 4.)>1.?p.x:p.y)/.3),.5)),1);
final+=vec4(.2,.2,.5*p.y,1.);
gl_FragColor=vec4(final);
}  