#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

vec3 lerp(vec3 first, vec3 second, float amount){
return first + amount*(second-first);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	float aspect = resolution.x/resolution.y;
	p.x *= aspect;
	p.x += aspect/2.25;

        float circle = mod(distance(p,vec2(.5)),.13)*3.;
	p.x+=2.;
	float lines = p.x/p.y*.08;
	vec3 first = vec3(.6,.0,.0);
	vec3 second = vec3(0.,1.,1.);
	
	
	gl_FragColor = vec4(lerp(first,second,sin(circle+time)*.4+lines*.9),1.);

}