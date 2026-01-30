#if !defined PATH_TRACED_LIGHTING_LIB
#define PATH_TRACED_LIGHTING_LIB
    void calculateRefractionPath(inout vec3 contribution, inout vec3 rayDirection, in vec3 oldRayDirection, in vec3 hitNormal, in Bounce pathMaterial) {
        rayDirection = refract(oldRayDirection, hitNormal, 1.00029/1.3333);

        float nDotV = dot(hitNormal, -oldRayDirection);
        float nDotL = saturate(dot(hitNormal, rayDirection));

        contribution *= pathMaterial.albedo;
        if(dot(hitNormal, rayDirection) > 0.0) contribution *= smithGGXMaskingShadowing(nDotV, nDotL, 0.0) / smithGGXMasking(nDotV, 0.0);
    }

    void calculateReflectionPath(inout vec3 contribution, inout vec3 rayDirection, in vec3 oldRayDirection, in vec3 hitNormal, in vec3 facetNormal, in Bounce pathMaterial) {
        rayDirection = reflect(oldRayDirection, facetNormal);

        float nDotV = abs(dot(hitNormal, -oldRayDirection));

        float reflectionContribution = smithGGXMaskingShadowing(nDotV, dot(hitNormal, rayDirection), pathMaterial.roughnessSquared) / smithGGXMasking(nDotV, pathMaterial.roughnessSquared);

        if(dot(hitNormal, rayDirection) > 0.0) {
            contribution *= pathMaterial.f0 > 0.0 ? reflectionContribution : 0.0;
        }
    }

    void calculateDiffusePath(inout vec3 contribution, inout vec3 rayDirection, in vec3 oldRayDirection, in vec3 hitNormal, in Bounce pathMaterial) {
        rayDirection = generateCosineVector(hitNormal, randNext2F());

        vec3 halfway = normalize(rayDirection - oldRayDirection);

        float nDotV = abs(dot(hitNormal, -oldRayDirection));
        float nDotL = saturate(dot(hitNormal, rayDirection));
        float nDotH = saturate(dot(hitNormal, halfway));
        float lDotV = dot(rayDirection, -oldRayDirection);

        contribution *= hammonDiffuse(pathMaterial.albedo, pathMaterial.n, nDotV, nDotL, nDotH, lDotV, pathMaterial.roughnessSquared) / (nDotL / pi);
        contribution *= pathMaterial.ao;
    }

    void calculateCelestialPath(inout vec3 contribution, inout vec3 rayDirection, in vec3 oldRayDirection, in vec3 hitNormal, in Bounce pathMaterial) {
        rayDirection = generateConeVector(sunVector, randNext2F(), 0.5 * radians(0.545));

        vec3 halfway = normalize(rayDirection - oldRayDirection);

        float nDotV = abs(dot(hitNormal, -oldRayDirection));
        float nDotL = saturate(dot(hitNormal, rayDirection));
        float nDotH = saturate(dot(hitNormal, halfway));
        float lDotV = dot(rayDirection, -oldRayDirection);
        float vDotH = dot(-oldRayDirection, halfway);

        float G1 = smithGGXMasking(nDotV, pathMaterial.roughnessSquared);
        float G2 = smithGGXMaskingShadowing(nDotV, nDotL, pathMaterial.roughnessSquared);
        float D = D_GGX(nDotH, pathMaterial.roughnessSquared);
        vec3 F  = fresnelFunction(vDotH, pathMaterial.n, pathMaterial.k, pathMaterial.albedoMetal);

        vec3 numerator = G2 * D * F;
        float denominator = 4.0 * nDotL * nDotV;

        vec3 specular = max(numerator / denominator, 0.0);
             specular = pathMaterial.f0 <= 0.0 ? vec3(0.0) : specular;

        vec3 diffuse = hammonDiffuse(pathMaterial.albedo, pathMaterial.n, nDotV, nDotL, nDotH, lDotV, pathMaterial.roughnessSquared);

        contribution *= diffuse + specular;
    }

    #ifndef DEBUG
        vec3 calculateLightPath(in vec3 hitNormal, in vec3 hitPosition, in vec3 rayDirection, in ivec3 hitIndex, in vec2 uv, in mat3 tbn, in Bounce initialMaterial) {

            Bounce pathMaterial = initialMaterial;

            vec4[2] voxelData;

            vec3 contribution = vec3(1.0);
            vec3 pathColor = vec3(0.0);

            pathColor += initialMaterial.emissive;

            bool skyPath = false;

            float celestialProbability = 0.6;

            bool celestialPath;

            bool diffusePath = true; //This is here for when I do get refractions to work exactly how they should.

            int b = 0;
            while(b < MAX_BOUNCES) {
                ++b;

                vec3 oldRayDirection = rayDirection;

                celestialPath = randNextF() < celestialProbability;

                if(!celestialPath) {
                    contribution /= 1.0 - celestialProbability;

                    vec3 facetNormal = generateFacetNormal(pathMaterial.normal, oldRayDirection, pathMaterial.roughness);

                    vec3 fresnel = fresnelFunction(dot(facetNormal, -oldRayDirection), pathMaterial.n, pathMaterial.k, pathMaterial.albedoMetal);

                    float fresnelLum = dot(fresnel, lumacoeff_rec709);
                    float albedoLum = dot(pathMaterial.albedo, lumacoeff_rec709);
                    float totalLum = albedoLum * (1.0 - fresnelLum) + fresnelLum; //I think this is named correctly? Not entirely sure.
                    float specBounceProbability = fresnelLum / totalLum;

                    //This helps performance a bit. Not sure what I'd call this though.
                    if(randNextF() < 1.0 - totalLum) { break; }
                    contribution /= totalLum;

                    bool specularBounce = specBounceProbability > randNextF();

                    if(specularBounce) {
                        contribution *= fresnel / specBounceProbability;

                        calculateReflectionPath(contribution, rayDirection, oldRayDirection, pathMaterial.normal, facetNormal, pathMaterial);
                    } else {
                        contribution *= (1.0 - fresnel) / (1.0 - specBounceProbability);

                        calculateDiffusePath(contribution, rayDirection, oldRayDirection, pathMaterial.normal, pathMaterial);
                    }
                    if(dot(pathMaterial.flatNormal, rayDirection) <= 0.0) continue;
                } else {
                    contribution /= celestialProbability;

                    calculateCelestialPath(contribution, rayDirection, oldRayDirection, pathMaterial.normal, pathMaterial);
                    if(dot(pathMaterial.flatNormal, rayDirection) <= 0.0) { celestialPath = false; break; }
                }

                bool hit = RaytraceVoxelsAlphatest(
                    hitPosition, hitIndex, rayDirection,
                    hitPosition, hitIndex, hitNormal,
                    voxelData, uv, tbn
                );

                if(celestialPath) {
                    if(hit) {
                        celestialPath = false;
                        skyPath = false;
                    }

                    break;
                } else {
                    if(hit) {
                        pathMaterial = getBounceMaterial(uv, hitNormal, tbn, voxelData, b);

                        pathColor += contribution * pathMaterial.emissive;

                        skyPath = false;
                    } else {
                        skyPath = true;

                        break;
                    }
                }
            }

            if(celestialPath) {
                pathColor += atmosphereTransmittance(vec3(0.0, planetRadius, 0.0), rayDirection) * contribution;
            }

            if(skyPath) {
                pathColor += contribution * atmosphericScattering(vec3(0.0, planetRadius, 0.0), rayDirection);
            }

            return max(pathColor, 0.0);
        }
    #else
        vec3 calculateLightPath(in vec3 hitNormal, in vec3 hitPosition, in vec3 rayDirection, in ivec3 hitIndex, in vec2 uv, in mat3 tbn, in Bounce initialMaterial) {

            Bounce pathMaterial = initialMaterial;

            vec4[2] voxelData;

            vec3 contribution = vec3(1.0);
            vec3 pathColor = vec3(0.0);

            pathColor += initialMaterial.emissive;

            bool celestialPath;
            bool ambientPath;

            int b = 0;
            while(b < MAX_BOUNCES) {
                ++b;
                vec3 oldRayDirection = rayDirection;

                #if DEBUG_PATH == 0
                    vec3 facetNormal = generateFacetNormal(pathMaterial.normal, oldRayDirection, pathMaterial.roughness);

                    vec3 fresnel = fresnelFunction(dot(facetNormal, -oldRayDirection), pathMaterial.n, pathMaterial.k, pathMaterial.albedoMetal);
                    contribution *= 1.0 - fresnel;

                    calculateDiffusePath(contribution, rayDirection, oldRayDirection, pathMaterial.normal, pathMaterial);
                #elif DEBUG_PATH == 1
                    vec3 facetNormal = generateFacetNormal(pathMaterial.normal, oldRayDirection, pathMaterial.roughness);

                    vec3 fresnel = fresnelFunction(dot(facetNormal, -oldRayDirection), pathMaterial.n, pathMaterial.k, pathMaterial.albedoMetal);
                    contribution *= fresnel;

                    calculateReflectionPath(contribution, rayDirection, oldRayDirection, pathMaterial.normal, facetNormal, pathMaterial);
                #endif
                if(dot(pathMaterial.flatNormal, rayDirection) <= 0.0) continue;

                bool hit = RaytraceVoxelsAlphatest(
                    hitPosition, hitIndex, rayDirection,
                    hitPosition, hitIndex, hitNormal,
                    voxelData, uv, tbn
                );


                if(hit) {
                    pathMaterial = getBounceMaterial(uv, hitNormal, tbn, voxelData, b);

                    #if !defined DEBUG_AO_PATH || defined DISABLE_AO
                        pathColor += contribution * pathMaterial.emissive;
                    #elif defined DEBUG_AO_PATH || !defined DISABLE_AO
                        pathColor += contribution * 0.0;
                    #endif

                    ambientPath = false;
                } else {
                    ambientPath = true;
                    #ifdef DISABLE_AO
                        ambientPath = false;
                    #endif

                    break;
                }
            }

            #if DEBUG_BOUNCE == 0
                if(b < 1) {
                    if(ambientPath) pathColor += contribution * atmosphericScattering(vec3(0.0, planetRadius, 0.0), rayDirection);
                    #ifdef DISABLE_AO
                        pathColor += contribution * atmosphericScattering(vec3(0.0, planetRadius, 0.0), rayDirection);
                    #endif
                }
            #elif DEBUG_BOUNCE == 1
                if(b > 1 && b < 3) {
                    if(ambientPath) pathColor += contribution * atmosphericScattering(vec3(0.0, planetRadius, 0.0), rayDirection);
                    #ifdef DISABLE_AO
                        pathColor += contribution * atmosphericScattering(vec3(0.0, planetRadius, 0.0), rayDirection);
                    #endif
                }
            #elif DEBUG_BOUNCE == 2
                if(ambientPath) pathColor += contribution * atmosphericScattering(vec3(0.0, planetRadius, 0.0), rayDirection);
                #ifdef DISABLE_AO
                    pathColor += contribution * atmosphericScattering(vec3(0.0, planetRadius, 0.0), rayDirection);
                #endif
            #endif

            return max(pathColor, 0.0);
        }
    #endif
#endif