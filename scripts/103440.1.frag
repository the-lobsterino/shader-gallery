precision mediump float;
uniform float time;
uniform vec2 resolution;

void main()
{
    vec2 shiftedCoord = gl_FragCoord.xy - vec2(0.5, 0.5) * resolution;
    vec2 uniformCoord = shiftedCoord / min(resolution.x, resolution.y);
    float uniformCoordLength = length(uniformCoord);
    float sinTime = sin(time);
    float scaledSinTime = (sinTime + 1.0) * 0.1;
    float mixTime = mix(0.2, 0.3, scaledSinTime);

    float div = mixTime / uniformCoordLength;

    gl_FragColor = vec4(vec3(div), 1.0);


} 