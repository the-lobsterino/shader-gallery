
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform sampler2D transferFunction; // 2D transfer function texture
//uniform sampler3D volumeData;      // 3D volume texture
uniform vec3 volumeDimensions;     // Dimensions of the volume data (x, y, z)
uniform vec2 windowSize;
uniform int value2D;

void main() {
    // Calculate normalized texture coordinates from gl_FragCoord
    //vec2 texCoord = gl_FragCoord.xy / vec2(gl_FragCoord.w, gl_FragCoord.w);
    vec2 texCoord = gl_FragCoord.xy / windowSize;

    vec3 texCoord3D = vec3(texCoord, 0.5); // Assuming the transfer function is on the z = 0 plane
    vec3 normalizedTexCoords = texCoord3D / volumeDimensions;
    int volumeValue = 256;

   // if(volumeValue > 255){
   //    volumeValue = 255;
   // }

    // Calculate gradient (for example, using central differences)
    // vec3 delta = 1.0 / volumeDimensions;
    // vec3 gradient = vec3(
    //    texture3D(volumeData, normalizedTexCoords + vec3(delta.x, 0.0, 0.0)).r - texture3D(volumeData, normalizedTexCoords - vec3(delta.x, 0.0, 0.0)).r,
    //    texture3D(volumeData, normalizedTexCoords + vec3(0.0, delta.y, 0.0)).r - texture3D(volumeData, normalizedTexCoords - vec3(0.0, delta.y, 0.0)).r,
    //    texture3D(volumeData, normalizedTexCoords + vec3(0.0, 0.0, delta.z)).r - texture3D(volumeData, normalizedTexCoords - vec3(0.0, 0.0, delta.z)).r
    //);

    // Calculate gradient magnitude
   // float gradientMagnitude = length(gradient);

    // Use the gradient magnitude as an index to sample the transfer function
   //  vec4 transferFunctionColor = texture2D(transferFunction, vec2(gradientMagnitude, 0.5));

    // Final color calculation
    gl_FragColor = vec4(1.0,0.0,0.0 , 1.0);//volumeValue * transferFunctionColor;
}

