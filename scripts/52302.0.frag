// Author: @patriciogv
// Title: 4 cells DF

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

const float SPEED = 2.0;
const float RADIUS = 0.25;
const float BRIGHTNESS = 2.0;

void main()
{
    vec2 st = gl_FragCoord.xy / resolution;
    vec3 color = vec3(0.0);

    // Cell positions
    vec2 point[5];
    point[0] = vec2(0.83,0.75);
    point[1] = vec2(0.60,0.07);
    point[2] = vec2(0.28,0.64);
    point[3] =  vec2(0.31,0.26);
    point[4] = vec2(0.5, 0.5);

    float t = SPEED * time;
    // float radius = RADIUS + RADIUS * 0.01 * sin(time);
    float radius = RADIUS + RADIUS * sin(time);
    point[4] += radius * vec2(cos(t), sin(t));

    float m_dist = 1.;  // minimun distance

    // Iterate through the points positions
    for (int i = 0; i < 5; i++)
    {
        float dist = distance(st, point[i]);

        // Keep the closer distance
        m_dist = min(m_dist, dist);
    }

    // Draw the min distance (distance field)
    color += m_dist;

    color *= BRIGHTNESS;

    gl_FragColor = vec4(color,1.0);
}
