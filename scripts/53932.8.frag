#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// distance field of a sphere
float dist_sphere(vec3 pos, vec3 cent, float radius){
	return length(pos-cent)-radius;
}

// distance field of a plane
float dist_plane(vec3 pos, vec3 point, vec3 norm){
	return dot(point-pos,normalize(norm));
}

// distance field of the graound
float dist_ground(vec3 pos){
	return pos.y;
}

// function for the final distance field
float dist_func(vec3 pos){
	vec3 cent = vec3((mouse-vec2(.5,0.))*vec2(12.,3.),0.)+vec3(0.,1.2,7.);
	
	//float sphere = dist_sphere(pos,cent,.7);
	float plane1 = dist_plane(pos,vec3(0.,0.2,25.),vec3(1.,1.,1.));
	float plane2 = dist_plane(pos,vec3(0.,0.,25.),vec3(-1.,0.1,1.));
	float ground = dist_ground(pos);
	
	float dist=min(plane1,plane2);
	//dist = min(dist,sphere);
	dist = min(dist,ground);
	return dist;
}

// function for the final distance field for refrection
float refr_dist_func(vec3 pos){
	vec3 cent = vec3((mouse-vec2(.5,0.))*vec2(12.,3.),0.)+vec3(0.,1.2,7.);
	
	float sphere = dist_sphere(pos,cent,1.);
	//float plane1 = dist_plane(pos,vec3(0.,0.2,25.),vec3(1.,1.,1.));
	//float plane2 = dist_plane(pos,vec3(0.,0.,25.),vec3(-1.,.1,1.));
	//float ground = dist_ground(pos);
	
	//float dist=min(plane1,plane2);
	//dist = min(dist,sphere);
	//dist = min(dist,ground);
	return sphere;
}

// calculate the normal using the distance field
vec3 norm_func(vec3 pos){
	float es = 1e-3;
	float dx = dist_func(pos+vec3(es,0.,0.))-dist_func(pos-vec3(es,0.,0.));
	float dy = dist_func(pos+vec3(0.,es,0.))-dist_func(pos-vec3(0.,es,0.));
	float dz = dist_func(pos+vec3(0.,0.,es))-dist_func(pos-vec3(0.,0.,es));
	return normalize(-vec3(dx,dy,dz));
}

vec3 refr_norm_func(vec3 pos){
	float es = 1e-3;
	float dx = refr_dist_func(pos+vec3(es,0.,0.))-refr_dist_func(pos-vec3(es,0.,0.));
	float dy = refr_dist_func(pos+vec3(0.,es,0.))-refr_dist_func(pos-vec3(0.,es,0.));
	float dz = refr_dist_func(pos+vec3(0.,0.,es))-refr_dist_func(pos-vec3(0.,0.,es));
	return normalize(-vec3(dx,dy,dz));
}

// refrection coefficent
float refr_func(vec3 pos){
	vec3 cent = vec3((mouse-vec2(.5,0.))*vec2(12.,3.),0.)+vec3(0.,1.2,7.);
	
	float sphere = dist_sphere(pos,cent,2.);
	if(sphere<0.){
		return .6;
	}
	return 1.;
}

// checker pattern
float checker(vec2 uv){
	uv = mod(uv,1.)-.5;
	return step(uv.x*uv.y,0.);
}

// function for the base color
vec3 color_func(vec4 pos){
	if(pos.w>100.){
		return vec3(.0);
	}
	if(pos.y<1e-2){
		return vec3(checker(pos.xz));
	}
	return vec3(.1);
}

// calculate the ray using ray marching
vec4 trace_pos(vec3 src, vec3 dir){
	vec3 pos = src;
	float dist = 0.;
	
	float d = dist_func(pos);
	float rd = abs(refr_dist_func(pos));
	for(int t = 0;t < 100;t++){
		pos += dir*min(d,rd);
		dist += min(d,rd);
		d = dist_func(pos);
		rd = abs(refr_dist_func(pos));
		if(d < 1e-3){
			break;
		}
		if(abs(rd) < 1e-3){
			vec3 norm = refr_norm_func(pos);
			float k = refr_func(pos);
			dir = refract(normalize(dir),normalize(norm),1./k);
			pos += dir*min(d,rd);
			dist += min(d,rd);
		}
	}
	return vec4(pos,dist);
}

// check if a ray is obscured using ray martching
float is_clear(vec3 src, vec3 tgt){
	vec3 dir = normalize(tgt-src);
	vec3 pos = src;
	float dist = 0.;
	
	float d = min(dist_func(pos),length(pos-tgt));
	for(int t = 0;t < 100;t++){
		if(length(pos-tgt)<1e-1){
			return exp(-dist*0.05);
		}
		pos += dir*d;
		dist += d;
		d = dist_func(pos);
		if(d < 1e-6){
			return 0.;
		}
		d = min(dist_func(pos),length(pos-tgt));
	}
	return 0.;
}

// trace the ray and its reflection to determine the color
vec3 trace_clr(vec3 src, vec3 dir){
	vec3 light_pos[3];
	light_pos[0] = vec3(1.,6.,2.);
	light_pos[1] = vec3(0.,7.,3.);
	light_pos[2] = vec3(2.,8.,4.);
	
	vec3 light_clr[3];
	light_clr[0] = vec3(1.,0.,0.);
	light_clr[1] = vec3(0.,1.,0.);
	light_clr[2] = vec3(0.,0.,1.);
	
	vec3 clr = vec3(0.);
	
	vec4 pos = trace_pos(src,dir);
	vec3 norm = norm_func(pos.xyz);
	for(int l=0;l<3;l++){
		vec3 l_dir = normalize(light_pos[l]-pos.xyz);
		float str = dot(norm,-l_dir)*is_clear(pos.xyz, light_pos[l]);
		clr += clamp(light_clr[l]*color_func(pos)*str,0.,1.);
	}
	
	// reflections
	float s = .0;
	for(int t=0;t<3;t++){
		if(pos.y>1e-2){
			dir = reflect(dir,norm);
			pos.xyz += dir*1e-2;
			pos = trace_pos(pos.xyz,dir);
			norm = norm_func(pos.xyz);
			for(int l=0;l<3;l++){
				vec3 l_dir = normalize(light_pos[l]-pos.xyz);
				float str = dot(norm,-l_dir)*is_clear(pos.xyz, light_pos[l]);
				clr += clamp(light_clr[l]*color_func(pos)*str,0.,1.);
			}
			s *= 0.5;
		}
	}
	
	return clr;
}

void main( void ) {
	float mn = min(resolution.x, resolution.y);
	vec2 uvt = (gl_FragCoord.xy - resolution.xy * .5) / mn ;
	vec3 pos = vec3(0.,2.,0.);
	vec3 dir = normalize(vec3(uvt,1.));
	
	vec3 color = trace_clr(pos,dir);
	
	gl_FragColor = vec4(color, 1.0);
}