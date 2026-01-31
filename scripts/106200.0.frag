#version 330 core
vec4 FragColor;
in vec2 TexCoords;
in vec3 WorldPos;
in vec3 Normal;

// material parameters
uniform vec3  albedo;
uniform float metallic;
uniform float roughness;
uniform float ao;

// lights
//uniform vec3 lightPositions[1];
//uniform vec3 lightColors[1];

vec3 lightPosition = vec3(0.0, -1.0, 0.0);
vec3 lightColor = vec3(0.6, 0.6, 0.6);

uniform vec3 camPos;

const float PI = 3.14159265359;
  
float DistributionGGX(vec3 N, vec3 H, float roughness);
float GeometrySchlickGGX(float NdotV, float roughness);
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness);
vec3 fresnelSchlick(float cosTheta, vec3 F0);

#define MEDIUMP_FLT_MAX    65504.0
#define saturateMediump(x) min(x, MEDIUMP_FLT_MAX)

float D_GGX(float roughness, float NoH, const vec3 n, const vec3 h) {
    vec3 NxH = cross(n, h);
    float a = NoH * roughness;
    float k = roughness / (dot(NxH, NxH) + a * a);
    float d = k * k * (1.0 / PI);
    return saturateMediump(d);
}

vec3 F_Schlick(float u, vec3 f0) {
    float f = pow(1.0 - u, 5.0);
    return f + f0 * (1.0 - f);
}

float V_SmithGGXCorrelated(float NoV, float NoL, float roughness) {
    float a2 = roughness * roughness;
    float GGXV = NoL * sqrt(NoV * NoV * (1.0 - a2) + a2);
    float GGXL = NoV * sqrt(NoL * NoL * (1.0 - a2) + a2);
    return 0.5 / (GGXV + GGXL);
}

float Fd_Lambert() {
    return 1.0 / PI;
}

float F_Schlick(float u, float f0, float f90) {
    return f0 + (f90 - f0) * pow(1.0 - u, 5.0);
}

float Fd_Burley(float NoV, float NoL, float LoH, float roughness) {
    float f90 = 0.5 + 2.0 * roughness * LoH * LoH;
    float lightScatter = F_Schlick(NoL, 1.0, f90);
    float viewScatter = F_Schlick(NoV, 1.0, f90);
    return lightScatter * viewScatter * (1.0 / PI);
}

void main()
{		
    vec3 N = normalize(Normal);
    vec3 V = normalize(camPos - WorldPos);

    float NoV = abs(dot(N, V)) + 1e-5;

    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, albedo, metallic);
	           
    // reflectance equation
    vec3 Lo = vec3(0.0);
 //   for(int i = 0; i < 4; ++i) 
 //   {
        // calculate per-light radiance
        vec3 L = normalize(lightPosition);
        vec3 H = normalize(V + L);

        float NoL = clamp(dot(N, L), 0.0, 1.0);
        float NoH = clamp(dot(N, H), 0.0, 1.0);
        float LoH = clamp(dot(L, H), 0.0, 1.0);
        float HoV = clamp(dot(H, V), 0.0, 1.0);

        //light color = radiance
        float distance    = length(lightPosition - WorldPos);
        float attenuation = 1.0 / (distance * distance);
        vec3 radiance     = lightColor * attenuation;        
        
        // cook-torrance brdf
        float NDF = D_GGX(NoH, roughness, N, H);        
        float G   = V_SmithGGXCorrelated(NoV, NoL, roughness);      
        vec3 F    = F_Schlick(HoV, F0);       
        
        // specular BRDF
        vec3 Fr = (NDF * G) * F;

        // diffuse BRDF
        vec3 Fd = albedo * Fd_Burley(NoV, NoL, LoH, roughness);

        vec3 kS = F;
        vec3 kD = vec3(1.0) - kS;
        kD *= 1.0 - metallic;	  
        
        vec3 numerator    = Fr;
        float denominator = 4.0 * NoV * NoL + 0.0001;
        vec3 specular     = numerator / denominator;  
            
        // add to outgoing radiance Lo
        // Lo += (kD * albedo / PI + specular) * radiance * NoL;
        Lo += (kD * Fd + specular) * radiance * NoL;
 //   }   
  
    vec3 ambient = vec3(0.03) * albedo * ao;
    vec3 color = ambient + Lo;
	
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0/2.2));  
   
    FragColor = vec4(H, 1.0);
} 