#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

#define min_radius_sq		0.45
#define fixed_radius_sq	3.00
#define folding_limit		1.00
#define scale			2.00

void sphereFold(inout vec3 z, inout float dz)
{
	float r_sq = dot(z, z);
	if(r_sq < min_radius_sq) {
        	float temp = (fixed_radius_sq / min_radius_sq);
        	z *= temp;
        	dz *= temp;
    	}else if(r_sq < fixed_radius_sq) {
        	float temp = (fixed_radius_sq / r_sq);
        	z *= temp;
        	dz *= temp;
   	}
}

void boxFold(inout vec3 z)
{
    	z = clamp(z, -folding_limit, folding_limit) * 2.0 - z;
}

float mandelbox(vec3 z)
{
	vec3 c = z;
    	float dr = 1.0;
    	for(int n = 0; n < 15; n++) {
        	boxFold(z);
        	sphereFold(z, dr);
        	z = scale * z + c;
        	dr = dr * abs(scale) + 1.0;
    	}
    	return length(z) / abs(dr);
}

float castRayToMandelbox(vec3 ro, vec3 rd)
{
	float tmin = 1.0;
    	float tmax = 50.0;
    	float t = tmin;
    	float m = -1.0;
    	for(int i = 0; i < 128; i++)
    	{
		float res = mandelbox(ro + rd * t);
        	if(res< t / (resolution.y * 2.8) || t > tmax) break;
		t += res;
    	}
    	if(t > tmax) t = -1.0;
    	return t;
}

vec3 calcMandelboxNormal(vec3 p)
{
	vec3 e = vec3(0.0005, 0.0, 0.0);
	vec3 n = vec3(mandelbox(p + e.xyy) - mandelbox(p - e.xyy),
		      mandelbox(p + e.yxy) - mandelbox(p - e.yxy),
		      mandelbox(p + e.yyx) - mandelbox(p - e.yyx));
	return normalize(n);
}

vec3 render(vec3 ro, vec3 rd)
{
	vec3 col = vec3(1.0);
	vec3 lig = normalize(vec3(-0.8, 0.7, 0.6));
	float r = castRayToMandelbox(ro, rd);
	if(r > 0.0) {
		vec3 p = ro + r * rd;
		vec3 n = calcMandelboxNormal(p);
		float i = clamp(dot(n, lig), 0.0, 1.0);
		col = vec3(i + 0.0);
	}
	return clamp(col, 0.0, 1.0);
}

mat3 setCamera(vec3 ro, vec3 ta)
{
	vec3 cw = normalize(ta - ro);
	vec3 cp = vec3(0.0, 1.0, 0.0);
	vec3 cu = normalize(cross(cw, cp));
	vec3 cv = normalize(cross(cu, cw));
    	return mat3(cu, cv, cw);
}

void main()
{
	vec2 pos = (-resolution.xy + 2.0 * gl_FragCoord.xy) / resolution.y;
	vec3 ro = vec3(20.0);
	vec3 ta = vec3(0.0);
	mat3 ca = setCamera(ro, ta);
	vec3 rd = ca * normalize(vec3(pos.xy, 3.0));
	vec3 col = render(ro, rd);
	gl_FragColor = vec4(col, 1.0);
}