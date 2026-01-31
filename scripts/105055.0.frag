#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (gl_FragCoord.xy / resolution.xy);

	float f1 = time;
        vec2 uv = gl_FragCoord.xy;
        float r = sin(f1 + cos(uv.x * uv.y)) * cos(length(position) - sin(exp(position.y)));
        float g = cos(f1 - sin(uv.x * uv.y)) * sin(length(position) + cos(exp(position.x)));
        float b = sin(f1 * sin(cos(r * g))) / cos(position.x + uv.x * uv.y) / sin(exp(r) * tan(g));

	gl_FragColor = vec4(vec3(r, g, b), 1.0 );

}