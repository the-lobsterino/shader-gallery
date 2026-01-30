#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define PI 3.14159265

float pointLight(vec2 pos, vec2 uv, float ra, float spa ,float r){
	float color = 0.;
	float d = radians(mod(-spa,90.));
	float a = radians(mod(ra,360.));
	
	mat2 rot = mat2(
		sin(a),cos(a),
		-cos(a),sin(a)
	);
	
	vec2 pj = uv*rot;
	
	vec2 ppj = pos*rot;
	
	color += clamp((-d+asin(((pj.x-ppj.x)/distance(pj,ppj)))) / (PI/2.),0.,1.) ;
	color *= clamp(1.-distance(pj/r,ppj/r),0.,1.);
	
	return color;
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv=uv*2.-1.;
	uv.x*=resolution.x/resolution.y;
	
	vec2 m = mouse;
	m=m*2.-1.;
	m.x*=resolution.x/resolution.y;
	
	vec2 light = vec2(-1,0);
	mat2 rot = mat2(
		sin(time*sin(length(uv*PI))),cos(time*sin(length(uv*PI))),
		-cos(time*sin(length(uv*PI))),sin(time*sin(length(uv*PI)))
	);

	vec3 color = vec3(.0);
	uv*=rot;
	float d = PI/6.;
		
	//color += clamp((-d+asin(((uv.x-light.x)/distance(uv,light)))) / (PI/2.),0.,1.) *vec3(1,2,3);
	
	//color += pointLight(m, uv, m.x*360., m.y*360. ,sin(time)*2.)*vec3(.5,.5,1)*2.;
	
	color.r += pointLight(vec2(sin(0.),cos(PI)), uv,0., 90.,1.9);
	color.g += pointLight(vec2(-sin(PI/3.),cos(PI/3.)), uv,120., 90.,1.9);
	color.b += pointLight(vec2(sin(PI/3.),cos(PI/3.)), uv,-120., 90.,1.9);
	
	color *= clamp(1.-distance(uv,vec2(0)),0.,1.)*2.;
	
	gl_FragColor = vec4( vec3(color), 1.0 );

}