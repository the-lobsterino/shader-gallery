//05-201020 筒井政成

//球体と、円柱のレイトレを実装



#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 originSphere = vec3(0.5, 0.0, -0.5);
float sphere_r = 0.5;
float h = 0.2;
float r = 0.6;


// calculate distance from the center of the sphere
float dist_sphere(vec3 pos, float size) {
	return length(pos-originSphere) - sphere_r;
}

//calculate distance from the middle axis of the cylinder
float dist_cylinder(vec3 p, float h, float r )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(h,r);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}


// calculate normal vector at the point of "pos" which is on the surface of the sphere
vec3 getNormal_sphere(vec3 pos, float sphere_r) {
	float ep = 1e-4;
	
	return normalize(vec3(
		dist_sphere(pos, sphere_r) - dist_sphere(vec3(pos.x - ep, pos.y, pos.z), sphere_r),
		dist_sphere(pos, sphere_r) - dist_sphere(vec3(pos.x, pos.y - ep, pos.z), sphere_r),
		dist_sphere(pos, sphere_r) - dist_sphere(vec3(pos.x - ep, pos.y, pos.z - ep), sphere_r)
		));
}


// calculate normal vector at the point of "pos" which is on the surface of the cylinder
vec3 getNormal_cylinder(vec3 pos, float h, float r) {
	float ep = 1e-4;
	
	return normalize(vec3(
		dist_cylinder(pos, h,r) - dist_cylinder(vec3(pos.x - ep, pos.y, pos.z), h,r),
		dist_cylinder(pos, h,r) - dist_cylinder(vec3(pos.x, pos.y - ep, pos.z), h,r),
		dist_cylinder(pos, h,r) - dist_cylinder(vec3(pos.x - ep, pos.y, pos.z - ep), h,r)
		));
}

void main( void ) {

	vec3 lightDir = normalize(vec3(1.0,1.0, 1.0)); //light direction vector
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y); //normalize the screen
	vec3 col = vec3(0.0); //initialize in black
	
	vec3 cameraPos = vec3(0.0, 0.0, 5.0);
	vec3 ray = normalize(vec3(pos, 0.0) - cameraPos);
	vec3 currentPos = cameraPos;
	vec2 mouseNorm = mouse * 2.0 - 1.0;
	//float sphere_r = 0.5 - length(mouseNorm);
	float sphere_r = 0.5;	
	
	for (int i = 0; i < 20; ++i) {
		float dsphe = dist_sphere(currentPos, sphere_r);
		float dcyl = dist_cylinder(currentPos, h, r);
		float d = min(dsphe, dcyl); // the closest object is choosed
		if (d < 1e-4) {
			vec3 normal;
			if (dsphe < dcyl) {
				normal = getNormal_sphere(currentPos, sphere_r);
			}
			else {
				normal = getNormal_cylinder(currentPos, h, r);
			}
			float diff = dot(normal, lightDir);
			col = vec3(diff) + vec3(0.3); //brighter
			break;
		}
		currentPos += ray * d; //go ahead
	}

	gl_FragColor = vec4( col, 1.0); 
}