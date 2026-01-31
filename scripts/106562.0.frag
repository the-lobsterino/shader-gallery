
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;

vec3 hexagonColor(vec2 uv)
{
    vec2 point1 = vec2(0.5, 0.5); // Center of the screen
    vec2 point2 = vec2(0.5, 0.5) + vec2(0.5, 0.0); // Right
    vec2 point3 = vec2(0.5, 0.5) + vec2(0.25, 0.433); // Top right
    vec2 point4 = vec2(0.5, 0.5) + vec2(-0.25, 0.433); // Top left
    vec2 point5 = vec2(0.5, 0.5) + vec2(-0.5, 0.0); // Left
    vec2 point6 = vec2(0.5, 0.5) + vec2(-0.25, -0.433); // Bottom left

    float radius = 0.25; // Adjust this value to control the hexagon size

    // Calculate the distance from the pixel to each of the six points
    float minDistance = distance(uv, point1);
    minDistance = min(minDistance, distance(uv, point2));
    minDistance = min(minDistance, distance(uv, point3));
    minDistance = min(minDistance, distance(uv, point4));
    minDistance = min(minDistance, distance(uv, point5));
    minDistance = min(minDistance, distance(uv, point6));

    // Use a threshold to determine if the pixel is inside the hexagon
    if (minDistance < radius)
    {
        // Inside the hexagon, set the pixel color
        return vec3(1.0, 1.0, 1.0); // You can set your desired color here
    }
    else
    {
        // Outside the hexagon, make the pixel transparent
        return vec3(0.0, 0.0, 0.0);
    }
}

void main(void)
{
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec3 color = hexagonColor(uv);

    gl_FragColor = vec4(color, 1.0);
}
