#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Material { // Struct which defines some properties of a material
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float brightness;
};

struct Sphere { // Struc which defines some properties of a sphere
	vec3 position;
	float radius;
	Material material;
};

struct SpotLight { // Struct which defines some properties of a spotlight
	// Location
	vec3 position;
	vec3 direction;
	
	// Apperture
	float minAngle;
	float maxAngle;
	
	// Light components
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	
	// Attenuation properties
	float constant;
	float linear;
	float quadratic;
};

void main() {
	float ratio = resolution.x / resolution.y;
	vec3 FragPos = vec3(gl_FragCoord.x / resolution.y, gl_FragCoord.y / resolution.y, 0.0);
	Sphere sphere;
	SpotLight spotLight;
	vec3 cameraPos = vec3(0.5 * ratio, 0.5, 1.0);
	vec3 color = vec3(0.0, 0.1, 0.2);
	
	// You can play with all these parameters!!
	
	// Sphere parameters
	sphere.position            = vec3(0.5 * ratio, 0.5, 0.0);
	sphere.radius              = 0.15;
	sphere.material.diffuse    = vec3(0.0, 1.0, 1.0);
	sphere.material.ambient    = sphere.material.diffuse;
	sphere.material.specular   = vec3(1.0);
	sphere.material.brightness = 64.0;
	
	// Spotlight parameters
	spotLight.position    = vec3(0.0, 0.0, 1.0);
	spotLight.direction   = normalize(vec3(mouse.x * ratio, mouse.y, -1.0));
	spotLight.minAngle    = cos(radians(10.0));
	spotLight.maxAngle    = cos(radians(13.0));
	spotLight.ambient     = vec3(0.2);
	spotLight.diffuse     = vec3(1.0);
	spotLight.specular    = vec3(0.25);
	spotLight.constant    = 1.0;
	spotLight.linear      = 0.3;
	spotLight.quadratic   = 0.03;
	
	if(distance(sphere.position.xy, FragPos.xy) <= sphere.radius) {
		vec3 normal = vec3(FragPos.xy - sphere.position.xy, 0.0);
		vec3 lightDir;
		
		normal.z = sqrt(pow(sphere.radius, 2.0) - pow(distance(sphere.position.xy, FragPos.xy), 2.0));
		FragPos.z = normal.z + sphere.position.z;
		normal = normalize(normal);
		
		lightDir = normalize(spotLight.position - FragPos);
		
		// Light calcs
		// Ambient
		vec3 ambient = spotLight.ambient * sphere.material.ambient;
		// Diffuse
		float diff = max(dot(normal, lightDir), 0.0);
		vec3 diffuse = spotLight.diffuse * diff * sphere.material.diffuse;
		// Specular
		vec3 viewDir = normalize(cameraPos - FragPos);
		vec3 reflection = reflect(-lightDir, normal);
		float spec = pow(max(dot(viewDir, reflection), 0.0), sphere.material.brightness);
		vec3 specular = spotLight.specular * spec * sphere.material.specular;
		
		// Spotlight
		float intensity = dot(-lightDir, spotLight.direction);
		//intensity = clamp((intensity - spotLight.maxAngle)/(spotLight.minAngle - spotLight.maxAngle), 0.0, 1.0);
		intensity = smoothstep(0.0, 1.0, (intensity - spotLight.maxAngle)/(spotLight.minAngle - spotLight.maxAngle));
		
		// Attenuation
		float dist = distance(spotLight.position, FragPos);
		float attenuation = 1.0 / (
			                   spotLight.constant + 
			                   spotLight.linear * dist + 
			                   spotLight.quadratic * dist * dist);
		
		intensity *= attenuation;
		
		diffuse *= intensity;
		specular *= intensity;
		
		color = ambient + diffuse + specular;
	}
	
	gl_FragColor = vec4(color, 1.0);
}

































