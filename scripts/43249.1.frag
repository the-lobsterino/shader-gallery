#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

void main()
{
    vec2 texCoord = vec2(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y);
    vec4 skyColor = vec4(0.9, 0.9, 1.9, 1.0);
    
    vec2 pos = gl_FragCoord.xy;
    vec2 center = vec2(0.5, 0.5) * resolution.xy;

    float size = 0.4;
    float dist = distance(pos, center) / (0.02 * sqrt(resolution.x+resolution.y));
    vec4 imageColor = smoothstep(120.0, 80.0, dist) * skyColor;
    vec4 tubeColor = pow(smoothstep(600.0, 50.0, dist), 4.0) * mix(vec4(0.5, 0.5, 0.5, 1), skyColor, 1.4);
    
    gl_FragColor = mix(imageColor, tubeColor, smoothstep(110.0, 120.0, dist));
}