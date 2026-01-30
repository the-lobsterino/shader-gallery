#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos =  -1.0 * 3.0 * gl_FragCoord.xy / resolution;	
	pos.x *= resolution.x/resolution.y;
	pos += vec2(3.5,1.25);
	float f = 0.0;
	float r = sqrt(dot(pos,pos));
	float nb_petal = 4.5;
	float angle = atan(pos.x,pos.y);
	float rotation = angle + time * 0.09;
	float size = 2.1;
	float shape = pow(sin(rotation * nb_petal) * size , 0.259);
	float shadow = r/shape;
	if(shadow < 0.5){
		f = 1.0;
	}
	
 	vec3 col = mix(vec3(1.0), (0.28+ shadow) * vec3(0.0, 0.0, 1.0), f);
	gl_FragColor = vec4(col, 1.0);
}