#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 cLight = normalize(vec3(0.5, 0.5, 1.0));

void main( void ) {
    vec2 center = vec2(resolution.x/2.0, resolution.y/2.0);
    float radius = resolution.x/8.0;
    vec2 position = gl_FragCoord.xy - center;
    float z = sqrt(radius*radius - position.x*position.x - position.y*position.y);
    vec3 normal = normalize(vec3(position.x, position.y, z));
    vec3 c = (normal+1.0)/2.0;
    if (length(position) > radius) {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    } else {
        float diffuse = max(0.0, dot(normal, cLight));
        
        gl_FragColor = vec4(vec3(diffuse), 0.3);
    }
}