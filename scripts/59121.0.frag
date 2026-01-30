precision mediump float;
uniform float time;
uniform vec2 resolution;
void main( void ) {
	vec3 color = vec3(0.);
	float tau = 2.*3.14159265358979323846264338327950288419716939937510;
	float kt = tau*(fract(0.3*time)-0.5);
	vec2 p = (2.*gl_FragCoord.xy-resolution)/min(resolution.x, resolution.y);
	float a = atan(p.y, p.x);
	if(length(p)<1.)color = vec3(.5*sin(a))+.5 ;
	if(abs(p.y - sin(2.*p.x))<0.01)color = vec3(1.,0.,0.);
	if(length(p-vec2(.5*kt,sin(kt)))<0.1)color = vec3(1.,0.,0.);
	if(dot(normalize(p),vec2(cos(kt),sin(kt)))>0.9999)color = vec3(1.,0.,0.);
	if(length(p-vec2(cos(kt),sin(kt)))<0.1)color = vec3(1.,0.,0.);
	gl_FragColor = vec4(color, 1.);
}