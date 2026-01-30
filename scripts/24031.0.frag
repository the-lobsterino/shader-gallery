#ifdef GL_ES
precision mediump float;
#endif
// changed something
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float iSphere(in vec3 ro, in vec3 rd, in vec4 sph) 
{
	// so, a sphere centered at the origin has equation |xyz| = r,
	// meaning |xyz|^2 = r^2, meaning <xyz,xyz> = r^2.
	// now, xyz = ro + t*rd, therefore |ro|^2 + t^2 + 2<ro,rd>*t - r^2 = 0
	// which is a quadratic equation. so
	//float r = 1.0;
	//float b = 2.0 * dot(ro, rd);
	//float c = dot(ro, ro) - r*r;
	vec3 oc = ro - sph.xyz;
	float b = 2.0 * dot(oc, rd);
	float c = dot(oc, oc) - sph.w*sph.w;
	float d = b*b - 4.0*c;
	if (d < 0.0) return -1.0;
	// plus or minus shows back and front side of the sphere respectively
	float t = (-b - sqrt(d)) / 2.0;
	return t;
}
vec3 nSphere(in vec3 pos, in vec4 sph)
{
	return normalize(pos - sph.xyz) / sph.w;	
}

float iPlane(in vec3 ro, in vec3 rd) 
{
	// equation of a plane: y = 0 = ro.y + t*rd.y
	return -ro.y/rd.y;
}
vec3 nPlane(in vec3 pos)
{
	return vec3(0.0, 1.0, 0.0);	
}

vec4 sph1 = vec4(0.0, 1.0, 0.0, 1.0);

float intersect(in vec3 ro, in vec3 rd, out float resT) 
{
	resT = 1000.0;
	float id = -1.0;
	float tsph = iSphere(ro, rd, sph1); // intersect with a sphere
	float tpla = iPlane(ro, rd); // intersect with a plane
	if (tsph > 0.0)
	{
		id = 1.0;
		resT = tsph;
	}
	if (tpla > 0.0 && tpla < resT)
	{
		id = 2.0;
		resT = tpla;	
	}
	
	return id;
}

void main( void ) 
{
	vec3 light = normalize(vec3(0.57703));
	// uv are the pixel coordinates, from 0 to 1
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	
	// let's move that sphere...
	sph1.x = 0.5 * cos(time);
	sph1.z = 0.5 * sin(time);
	
	
	// we generate a ray with origin ro and direction rd
	vec3 ro = vec3 (0.0, 0.5, 3.0);
	
	// apply 16:9 resolution ratio 1.78
	vec3 rd = normalize(vec3 ((-1.0 + 2.0*uv) * vec2(1.78, 1.0), -1.0));
	
	// we intersect the ray with the 3d scene
	float t;
	float id = intersect (ro, rd, t);
	
	// we draw black by default
	vec3 col = vec3(0.2);
	if (id > 0.5 && id < 1.5) 
	{
		// if we hit sphere
		vec3 pos = ro + t*rd*0.8;
		vec3 nor = nSphere(pos, sph1);
		vec3 color = vec3(0.8, 0.8, 0.6);
		vec3 dif = color * max(0.0, dot(nor, light));
		vec3 amb = color * 0.2;
		float ao = 0.5 + 0.5 * nor.y;
		col = dif + amb;
		col *= ao;
	}
	else if (id > 1.5) {
		// we hit the plane
		vec3 pos = ro + t*rd;
		vec3 nor = nPlane(pos);
		vec3 color = vec3(1.0, 0.8, 0.6);
		vec3 dif = color * max(0.0, dot(nor, light));
		float amb = smoothstep(0.0, 2.0 * sph1.w, length(pos.xz - sph1.xz));
		col = 0.7 * vec3(amb);
		
	}
	col = sqrt(col);
	gl_FragColor = vec4(col, 1.0 );
}

