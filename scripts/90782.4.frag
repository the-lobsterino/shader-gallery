#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 walk(vec2 ray, vec2 A, vec2 B, float grd) {
	return ray + grd*(B-A);
}

vec3 walk(vec3 ray, vec3 A, vec3 B, float grd) {
	return ray + grd*(B-A);
}

void main( void ) {

	vec2 st = ( gl_FragCoord.xy / resolution.xy )*2.-1.;
	st.x *= resolution.x/resolution.y;

	vec3 color = vec3(0.);
	
	float r = .63;

	// Calculated Z of Sphere
	float cz = sqrt(st.x*st.x+st.y*st.y+r);
	
	vec3 ls = vec3(-.2,.7,.9);
	vec3 pcenter = vec3(0.,0.,-1.4);
	vec3 p = vec3(pcenter);
	p.xy += st;
	p.z += cz;
	
	float l = length(p) - r;
	l = min(1.,l);
	l = 1.-ceil(l);
	
	if(l > 0.) {
		color = vec3(1.);
		const float grd = .01;
		const int limit = 1;
		vec3 ray = vec3(st, cz);
		vec3 walked = walk(ray,ray,ls,grd);
		for(int i=0;i<limit;i++)
		{
			
			walked = walk(walked,ray,ls,grd);
			float dray = distance(walked, pcenter);
			if(dray < r) {
				color *= 0.;
				break;
			}
		}
	}
	
	gl_FragColor = vec4(color,1.);

}