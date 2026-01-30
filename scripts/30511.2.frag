#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float triplane(vec3 p, vec3 v0, vec3 v1, vec3 v2)
{
	vec3 abc = normalize(cross(v1 - v2, v1 - v0));
	float zm = min(v0.z, min(v1.z, v2.z));
	return v0.z - ((abc.x * (p.x - v0.x)) + (abc.y * (p.y - v0.y))) / abc.z;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	float t = 0.0;//time * 0.3;
	vec3 pos = vec3(0, 0, 40.0);
	vec3 dir = normalize(vec3(uv, 1.0));
	float z = 10000.0;
	vec3 col = vec3(1,2,3) * 0.5;
	for(int i = 0; i < 100; i++)
	{
		float ph = (float(i) * 0.357) + time * 0.3;
		vec3 v0 = vec3(-cos(ph * 0.7),  sin(ph * 0.5), -sin(ph * 0.5));
		vec3 v1 = vec3( cos(ph * 0.6),  cos(ph * 0.7),  cos(ph * 0.8));
		vec3 v2 = vec3( sin(ph * 0.7), -sin(ph * 0.5), -cos(ph * 0.7));
		float temp = triplane(pos + dir, v0, v1, v2);
		if(temp < 0.5) continue;
		if(temp < z) {
			
			//col
			z = temp;
			col = col.yzx * z;
		}
	}
	if(z > 5000.0) col = vec3(0.0);
	gl_FragColor = vec4(col, 1.0 );

}