#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

float box(vec3 p)
{
	return length(max(abs(p) - vec3(1.0), 0.0));
}

float castRayToBox(vec3 ro, vec3 rd)
{
	float tmin = 1.0;
   	float tmax = 50.0;
    	float t = tmin;
    	for(int i = 0; i < 64; i++)
    	{
	    	float d = box(ro + rd * t);
        	if(d < t / (resolution.y * 2.8) || t > tmax) break;
        	t += d;
    	}
    	if(t > tmax) t = -1.0;
    	return t;
}

vec3 render(vec3 ro, vec3 rd)
{
	vec3 col = vec3(1.0);
	float r = castRayToBox(ro, rd);
	if(r > 0.0) col = vec3(0.0);
	return col;
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
	vec3 rd = ca * normalize(vec3(pos.xy, 15.0));
	vec3 col = render(ro, rd);
	gl_FragColor = vec4(col, 1.0);
}