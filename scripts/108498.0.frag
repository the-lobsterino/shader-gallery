#version 410

#define MAX_STEPS 5

// L-System definition
#define AXIOM "F"
#define RULES_COUNT 6
#define ANGLE 20.0 * 3.1415926535 / 180.0
#define LENGTH 0.02

// Function to apply L-System rules
vec2 applyLSystem(vec2 p, int step)
{
    vec2 result = p;
    for (int i = 0; i < MAX_STEPS; i++)
    {
        vec2 newResult = vec2(0.0);
        for (int j = 0; j < RULES_COUNT; j++)
        {
            char c = AXIOM[j];
            if (c == 'F')
            {
                // Move forward and modify position (you can adjust these values)
                newResult += vec2(LENGTH, 0.0);
            }
            // Add more rules as needed
        }
        result = newResult;
    }
    return result;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Map fragCoord to the range [-1, 1]
    vec2 uv = fragCoord / iResolution.xy * 2.0 - 1.0;

    // Apply L-System rules
    vec2 position = applyLSystem(uv, int(iFrame));

    // Map position to the range [0, 1]
    vec2 colorUV = (position + 1.0) / 2.0;

    // Output color
    fragColor = vec4(colorUV, 0.0, 1.0);
}
