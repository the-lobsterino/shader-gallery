#extension GL_OES_standard_derivatives : enable

// This is just a regular 3D grid but traced with curved rays, creating an illusion of curved geometry. By Kabuto

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 getcolor(float x, float y, float a) {
	x = .5-abs(fract(x)-.5);
	y = .5-abs(fract(y)-.5);
	if (x < .1 || y < .1) {
		float f = 1.-min(x,y)*10.;
		return vec4(vec3(f),f*(1.-f)*4.)*min(1.,abs(a)*1.5);
	} else {
		return vec4(0);
	}
}


void main( void ) {

	vec3 pos = vec3(.5+time,.5,.5);
	
	vec3 ipos = floor(pos);
	
	vec3 dir = normalize(vec3(( gl_FragCoord.xy - resolution.xy *.5) / resolution.y, .5));
	
	const float maxstep = 0.3;
	
	const int maxiter = 40;
	
	vec4 color = vec4(0);
	
	for (int i = 0; i < maxiter; i++) {
		// trace until the next cube starts but no further than "maxstep"
		vec3 targetpos = ipos + step(0., dir);
		vec3 dists = (targetpos - pos) / dir;
		float mindist = min(min(dists.x, dists.y), min(dists.z, maxstep));
		pos += dir*mindist;
		
		// apply color if we hit a cube
		vec4 color0 = vec4(0);
		if (dists.x == mindist) {
			ipos.x += sign(dir.x);
			color0 = getcolor(pos.y,pos.z,dir.x);
		} else if (dists.y == mindist) {
			ipos.y += sign(dir.y);
			color0 = getcolor(pos.z,pos.x,dir.y);
		} else if (dists.z == mindist) {
			ipos.z += sign(dir.z);
			color0 = getcolor(pos.x,pos.y,dir.z);
		}
		color0.xyz *= float(maxiter-i)/float(maxiter);
		color += color0*(1.-color.a);
		
		// bend the ray
		dir.z -= mindist*.4;
		dir = normalize(dir);
	}
	
	color += vec4((0,cos(time), 5.5)*(1.-color.a));
	
	gl_FragColor = color;

}