#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

float aspect(vec2 res){
return res.x/res.y;
}

mat2 rot(float angle){
return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}

float circle(vec2 pos, vec2 origin, float radius){
return step(distance(pos,origin),radius);
}

float hyperboloid(vec2 pos, float sharp, float smooth){
return smoothstep(exp(pos.x*pos.y),sharp,smooth);
}

float crux(vec2 pos){
return exp(pos.x*pos.y);
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2. - 1.;
        uv.x *= aspect(resolution);
	float c = circle(uv,vec2(.0),.5);
	vec3 circleCol = vec3(c*.3,c*.2,0.);
	uv *= rot(time*.5);
	float h = hyperboloid(uv,.0,.6)*.25/sqrt(uv.x)/sqrt(uv.y*10.);
	vec3 hCol = mix(vec3(.3,.2,.1),vec3(1.,1.,0.),h);
	hCol.b += sin(time)+1./2.;
	hCol.r += sin(time*.1)+1./2.;
	gl_FragColor = vec4(vec3(hCol)+vec3(circleCol),1.);
}