#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float world_window(vec2 p,vec2 b){
	vec2 u = abs(p)-b;
	return length(max(u,0.))+min(max(u.x,u.y),0.);
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy -.5* resolution.xy )/resolution.y;
	vec3 col = vec3(0.);
	//uv *= 2.;
	
	float window;
	for(float i =0.;i<1.;i+=1./100.){
		uv += vec2((sin(time*.1)*.5+.5)*.01,(cos(time*.1))*.01);
		float z = fract(i+time*.05);
		float size = mix(5.,0.,z);
		window = world_window(uv*size*5.,vec2(.6,.29));
		window = smoothstep(.15,.2,window);
		col += window*(1.-window);
	}
	//col *= vec3(.1,.1,.5);
	gl_FragColor = vec4(col, 1.0 );

}