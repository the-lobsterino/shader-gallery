#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
    // Define the point light position
    vec2 lightPos = mouse.xy;
    
    // Calculate the vector from the current fragment to the light source
    vec2 toLight = lightPos - gl_FragCoord.xy / resolution.xy;
    
    // Calculate the distance to the light source
    float distanceToLight = length(toLight);
    
    // Define light properties
    float lightIntensity = 0.2;
    vec3 lightColor = vec3(0, 0, 1.0); // White light
    
    // Calculate the light attenuation (inverse-square law)
    float attenuation = 0.5 / (distanceToLight * distanceToLight);
    
    // Calculate the final color based on the light
    vec3 finalColor = lightIntensity * lightColor * attenuation;
    
    // Set the final color as the output
    gl_FragColor = vec4(finalColor, 1.0);

}