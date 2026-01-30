#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define S(a,b,t) smoothstep(a,b,t)

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy -.5* resolution.xy )/resolution.y;
	vec3 col = vec3(0.15);
	
	
	uv *= 10.;
	
	vec2 fd = fract(uv);
	vec2 id = floor(uv);
	fd -= .5;
	fd *= .5;
	fd *= mat2(cos(time+id.x),-sin(time+id.x),sin(time+id.x),cos(time+id.x));
	float d = S(0.205,0.19,sqrt(pow(fd.x,2.) + pow(fd.y,2.)));
	col += length(fd)<d?(fd.x>0.?d:-0.15):0.;
	col += S(.101,.1,length(fd-vec2(.0,.098)));
	col -= S(.101,.1,length(fd+vec2(.0,.098)))*2.;
	
	col += S(.2/6.,.19/6.,length(fd+vec2(.01,.1)))*3.;
	
	col -= S(.2/6.,.19/6.,length(fd-vec2(.01,.1)))*3.;
	
	gl_FragColor = vec4(col, 1.0 );

}