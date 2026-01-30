#version 330 core

#define MAX_NUMBER_OF_LIGHTS 32
#define MAX_NUMBER_OF_SHAPES 32

struct Material {
	sampler2D diffuse;
	sampler2D specular;

	float shininess;
};

struct PointLight {
	vec3 position;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;

	float constant;
	float linear;
	float quadratic;
};

struct DirectionalLight {
	vec3 direction;

	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
};

out vec4 Color;

uniform int numberOfPointLights = 0;
uniform PointLight pointLights[MAX_NUMBER_OF_LIGHTS];
uniform DirectionalLight directionalLight = { vec3(0), vec3(0), vec3(0), vec3(0) };

uniform samplerCube skybox;
uniform vec3 cameraPosition;
uniform Material materials[MAX_NUMBER_OF_SHAPES];

in vec3 vPosition;
in vec2 vTextureCoord;
in vec3 vNormal;
in float vShapeIndex;

vec3 CalculatePointLight(PointLight light, vec3 normal, vec3 position, vec3 viewDirection);
vec3 CalculateDirectionalLight(DirectionalLight light, vec3 normal, vec3 viewDirection);

void main() {
	vec3 norm = normalize(vNormal);
	vec3 viewDirection = normalize(cameraPosition - vPosition);
	vec3 RL = reflect(viewDirection, norm);
	vec3 RR = refract(viewDirection, norm, 1 / 1.33);
	
	vec3 color = CalculateDirectionalLight(directionalLight, norm, viewDirection);
	for(int i = 0; i < numberOfPointLights; i++) {
		color += CalculatePointLight(pointLights[i], norm, vPosition, viewDirection);
	}
	
	vec4 reflected = texture(skybox, RL);
	vec4 refracted = texture(skybox, RR);
	
	vec4 mixed = mix(reflected, refracted, 1);

	Color = mixed; //vec4(color, 1);
}

vec3 CalculatePointLight(PointLight light, vec3 normal, vec3 position, vec3 viewDirection) {
	vec3 lightDirection = normalize(light.position - position);
	
	float diff = max(dot(normal, lightDirection), 0.0);
	
	vec3 reflectionDirection = reflect(-lightDirection, normal);
	float spec = pow(max(dot(viewDirection, reflectionDirection), 0.0), materials[int(vShapeIndex)].shininess);
	
	float dist = length(light.position - position);
	float attenuation = 1.0 / (light.constant + light.linear * dist + light.quadratic * pow(dist, 2));
	
	vec3 ambient = light.ambient * vec3(texture(materials[int(vShapeIndex)].diffuse, vTextureCoord));
	vec3 diffuse = light.diffuse * diff * vec3(texture(materials[int(vShapeIndex)].diffuse, vTextureCoord));
	vec3 specular = light.specular * spec * vec3(texture(materials[int(vShapeIndex)].specular, vTextureCoord));
	
	ambient *= attenuation;
	diffuse *= attenuation;
	specular *= attenuation;

	return (ambient + diffuse + specular);
}

vec3 CalculateDirectionalLight(DirectionalLight light, vec3 normal, vec3 viewDirection) {
	vec3 lightDirection = normalize(-light.direction);
	
	float diff = max(dot(normal, lightDirection), 0.0);
	
	vec3 reflectionDirection = reflect(-lightDirection, normal);
	float spec = pow(max(dot(viewDirection, reflectionDirection), 0.0), materials[int(vShapeIndex)].shininess);
	
	vec3 ambient = light.ambient * vec3(texture(materials[int(vShapeIndex)].diffuse, vTextureCoord));
	vec3 diffuse = light.diffuse * diff * vec3(texture(materials[int(vShapeIndex)].diffuse, vTextureCoord));
	vec3 specular = light.specular * spec * vec3(texture(materials[int(vShapeIndex)].specular, vTextureCoord));

	return (ambient + diffuse + specular);
}}