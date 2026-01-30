#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265359;

const float Smoothness = 20.0;

void pointLight(inout vec3 color, in vec3 normal, in vec3 lightPos, in vec3 lightColor, in vec2 uv)
{
	vec3 cspec = vec3(0.9);    // specular coefficient  
	vec3 p = vec3(uv, 0.0);
	vec3 Ks = vec3(1.0, 0.0, 0.0) / PI;
	vec3 Kd = (Smoothness + 8.0) / (8.0 * PI) * cspec;

	vec3 l = normalize(lightPos - p);
	vec3 v = normalize(vec3(0.5) - p);
	vec3 h = normalize(l + v);
	normal = normalize(normal);

	float cosThetai = max(dot(normal, l), 0.0);
	float cosThetah = max(dot(normal, h), 0.0);

	color += (Ks + Kd * pow(cosThetah, Smoothness)) * (lightColor * cosThetai);
}

const vec3 backgroundColor =  vec3(0.1);
const vec3 lightColor =  vec3(1.0);
const vec3 sphereColor =  vec3(0.1, 0.0, 0.2);

void main( void )
{
	vec2 uv = gl_FragCoord.xy / resolution.yy * 1.5 - vec2(0.25);
	vec2 uv2 = uv - vec2(1.1, 0.0);
	vec2 mpos = mouse * resolution.xy / resolution.yy * 1.5 - vec2(1.35, 0.25);
	
	vec2 coord = (uv - vec2(0.5)) * 2.0;
	vec2 coord2 = (uv2 - vec2(0.5)) * 2.0;
	float len = length(coord);
	float len2 = length(coord2);
	vec3 color = backgroundColor;
	
	if (len < 1.0) 
	{                        // normal sphere
		float z = sqrt(1.0 - len * len);
		vec3 normal = vec3(coord, z);
		vec3 n = normal;
		n.r *= -1.0;
		color = n / 2.0 + vec3(0.5);
	}
	if (len2 < 1.0) 
	{                        // pointlighted sphere
		float z = sqrt(1.0 - len2 * len2);
		vec3 normal = vec3(coord2, z);
		color = sphereColor;
		pointLight(color, normal, vec3(mpos, 0.5), lightColor, uv2);
	}
	gl_FragColor = vec4(vec3(color), 1.0);
}