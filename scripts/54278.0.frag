#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float joinDist(vec2 segment, vec2 texcoord) {
    float d = abs(texcoord.y);
    float dx = texcoord.x;
    if (dx < segment.x) {
        d = max(d, length(texcoord - vec2(segment.x, 0.0)));
    } else if (dx > segment.y) {
        d = max(d, length(texcoord - vec2(segment.y, 0.0)));
    }
    return d;
}

void main() {
	float alpha = 1.0;
	vec2 vSegment = vec2(0.1, 0.5);

	float dist = joinDist(vSegment, resolution) - 0.5;
	float width = fwidth(dist);
	alpha *= (1.0 - smoothstep(-width, width, dist));
	
	
	gl_FragColor = vec4( vec3(0.5,0.5,0.0), alpha );

}