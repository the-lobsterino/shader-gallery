#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 uv, vec2 p, float radius){
return distance(uv,p)/radius;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	//position.x *= resolution.x/resolution.y;
	vec3 pattern = vec3(.5,circle(position,vec2(.2),.3),tan(time))*
		       vec3(0.,circle(position,vec2(.7),.3),1.);
  
	gl_FragColor = vec4(vec3(1.,sin(time),0.)+pattern,1.);

}