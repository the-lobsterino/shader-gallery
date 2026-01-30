#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float DE(vec3 p){
	return length(p) - 0.5;
}
float marche(vec3 ro, vec3 rd){
	float t=0.;
	for (int i=0; i<32; i++){
		vec3 p = ro + rd*t;
		float dist = DE(p);
		t += dist*0.5;
	};
	return t;

}
void main( void ) {

	vec2 uv = ( gl_FragCoord.x*0.5*resolution.xy / resolution.y ) + mouse / 4.0;
	
	vec3 ro = vec3(0.,0.,-3.);
	vec3 rd = normalize(vec3(uv,1.));
	float t = marche(ro, rd);
	float fog = 1./(1.+t*t*0.5);	
	vec3 color = vec3(fog);
	gl_FragColor = vec4(color,1.);

}