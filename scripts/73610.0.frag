#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 v_positionEC = vec3(mouse, time);
vec3 v_normalEC = vec3(0.0, 1.0, 1.0);
vec4 v_color = vec4(1.0, 0.0, 0.0, 1.0);
struct czm_material {
    vec3 diffuse;
    float specular;
    float shininess;
    vec3 normal;
    vec3 emission;
    float alpha;
};
struct czm_materialInput {
    float s;
    vec2 st;
    vec3 str;
    vec3 normalEC;
    mat3 tangentToEyeMatrix;
    vec3 positionToEyeEC;
    float height;
    float slope;
    float aspect;
};
vec3 czm_gammaCorrect(vec3 color) {
#ifdef HDR
    color = pow(color, vec3(czm_gamma));
#endif
    return color;
}

vec4 czm_gammaCorrect(vec4 color) {
#ifdef HDR
    color.rgb = pow(color.rgb, vec3(czm_gamma));
#endif
    return color;
}
const float czm_epsilon2 = 0.01;
const float czm_sceneMode3D = 3.0;
const vec3 czm_lightColor = vec3(1.0, 1.0, 1.0);
const vec3 czm_lightDirectionEC = vec3(1.0, 1.0, 1.0);


float czm_getSpecular(vec3 lightDirectionEC, vec3 toEyeEC, vec3 normalEC, float shininess) {
    vec3 toReflectedLight = reflect(-lightDirectionEC, normalEC);
    float specular = max(dot(toReflectedLight, toEyeEC), 0.0);

    // pow has undefined behavior if both parameters <= 0.
    // Prevent this by making sure shininess is at least czm_epsilon2.
    return pow(specular, max(shininess, czm_epsilon2));
}
float czm_getLambertDiffuse(vec3 lightDirectionEC, vec3 normalEC) {
    return max(dot(lightDirectionEC, normalEC), 0.0);
}

float czm_private_getLambertDiffuseOfMaterial(vec3 lightDirectionEC, czm_material material) {
    return czm_getLambertDiffuse(lightDirectionEC, material.normal);
}

float czm_private_getSpecularOfMaterial(vec3 lightDirectionEC, vec3 toEyeEC, czm_material material) {
    return czm_getSpecular(lightDirectionEC, toEyeEC, material.normal, material.shininess);
}

/**
 * Computes a color using the Phong lighting model.
 *
 * @name czm_phong
 * @glslFunction
 *
 * @param {vec3} toEye A normalized vector from the fragment to the eye in eye coordinates.
 * @param {czm_material} material The fragment's material.
 *
 * @returns {vec4} The computed color.
 *
 * @example
 * vec3 positionToEyeEC = // ...
 * czm_material material = // ...
 * vec3 lightDirectionEC = // ...
 * gl_FragColor = czm_phong(normalize(positionToEyeEC), material, lightDirectionEC);
 *
 * @see czm_getMaterial
 */
vec4 czm_phong(vec3 toEye, czm_material material, vec3 lightDirectionEC) {
    // Diffuse from directional light sources at eye (for top-down)
    float diffuse = czm_private_getLambertDiffuseOfMaterial(vec3(0.0, 0.0, 1.0), material);
 //   if(2 == czm_sceneMode3D) {
        // (and horizon views in 3D)
    diffuse += czm_private_getLambertDiffuseOfMaterial(vec3(0.0, 1.0, 0.0), material);
  //  }

    float specular = czm_private_getSpecularOfMaterial(lightDirectionEC, toEye, material);

    // Temporary workaround for adding ambient.
    vec3 materialDiffuse = material.diffuse * 0.5;

    vec3 ambient = materialDiffuse;
    vec3 color = ambient + material.emission;
    color += materialDiffuse * diffuse * czm_lightColor;
    color += material.specular * specular * czm_lightColor;

    return vec4(color, material.alpha);
}

vec4 czm_private_phong(vec3 toEye, czm_material material, vec3 lightDirectionEC) {
    float diffuse = czm_private_getLambertDiffuseOfMaterial(lightDirectionEC, material);
    float specular = czm_private_getSpecularOfMaterial(lightDirectionEC, toEye, material);

    vec3 ambient = vec3(0.0);
    vec3 color = ambient + material.emission;
    color += material.diffuse * diffuse * czm_lightColor;
    color += material.specular * specular * czm_lightColor;

    return vec4(color, material.alpha);
}

czm_material czm_getDefaultMaterial(czm_materialInput materialInput) {
    czm_material material;
    material.diffuse = vec3(0.0);
    material.specular = 0.0;
    material.shininess = 1.0;
    material.normal = materialInput.normalEC;
    material.emission = vec3(0.0);
    material.alpha = 1.0;
    return material;
}

void main( void ) {
    vec3 positionToEyeEC = -v_positionEC;
    vec3 normalEC = normalize(v_normalEC);
    #ifdef FACE_FORWARD
    normalEC = faceforward(normalEC, vec3(0., 0., 1.), -normalEC);
    #endif
    vec4 color=czm_gammaCorrect(v_color);
    czm_materialInput materialInput;
    materialInput.normalEC = normalEC;
    materialInput.positionToEyeEC = positionToEyeEC;
    czm_material material = czm_getDefaultMaterial(materialInput);
    material.diffuse = color.rgb;
    material.alpha = color.a;
    gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);

}