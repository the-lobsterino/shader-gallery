precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 p) {
    vec2 k1 = vec2(
        23.14069263277926,
        2.665144142690225
    );

    return fract(cos(dot(p, k1)) * 12345.6789);
}

void main( void ) {
vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 _mousePosition = mouse.xy / resolution.xy;
    
    vec2 positionColors[3];
    positionColors[0] = vec2(0.5, 1.0);
    positionColors[1] = vec2(1.0, 1.0);
    positionColors[2] = vec2(0.5, 0.0);

    vec3 colorPalette[3];
    colorPalette[0] = vec3(0.329,0.173,0.886);
    colorPalette[1] = vec3(0.396,0.082,0.082);
    colorPalette[2] = vec3(0.000,0.000,0.000);
    
    vec2 colorPositions[4];
    colorPositions[0] = _mousePosition;
    colorPositions[1] = positionColors[1];
    colorPositions[2] = positionColors[2];
    colorPositions[3] = _mousePosition;
    
    float blendModifier = 5.5;
    float blend = sin(time) * blendModifier;
    
    // Initializing variables for the upcoming loop
    // The sum will hold the weighted sum of colors, and valence will hold the total weight
    float colorWeight[3];
    vec3 weightedColorSum = vec3(0.0);
    float totalWeight = 0.0;

    // Looping over color positions to calculate the final color
    // Each color is weighted by the inverse of its distance to the current fragment, raised to the power of blend
    // The sum of colors is then divided by the total weight to get the average color
    for (int i = 0; i < 3; i++) {
         float distance = length(uv - colorPositions[i]);
        
         if (distance == 0.0) {
             distance = 1.5;
         }

         float colorWeight = 0.4 / pow(distance, blend);
         weightedColorSum += colorWeight * colorPalette[i];
         totalWeight += colorWeight;
    }
    
    weightedColorSum = pow(weightedColorSum, vec3(1.0 / 1.0));
    weightedColorSum = weightedColorSum / totalWeight;
    
    // Adding noise to the sum
    // The noise is based on a random value, which is different for each fragment and changes over time
    
    gl_FragColor = vec4(weightedColorSum.xyz, 1);
}