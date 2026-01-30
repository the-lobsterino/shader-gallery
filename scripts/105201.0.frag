// IZ WAVE 4 U
precision highp float;

uniform float time;
uniform vec2 resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv-=0.5;
	
	uv.y *= dot(uv,uv);
	uv=abs(uv);
	
	uv.y += fract(sin(uv.x)*0.075+time*0.02);
	
	uv *= 16.0;
	
	uv.y = fract(uv.y)-.5;
    float freq = 1.0;
    float speed = 4.0;
    float amp = 0.25;
    float wave = sin(uv.x * freq + time * speed) * amp;
    float wave2 = sin(uv.x * freq*5.2 + time * speed) * amp*0.1;
    float dist = abs(uv.y - wave);
    float dist2 = abs(uv.y - wave2);
	dist = min(dist,dist2);
    float ii1 = 1.0 - smoothstep(0.05, 0.1, dist);
    float ii2 = 1.0 - smoothstep(0.05, 2.2, dist2);
    vec3 color = vec3(0.0,1.0*ii1,1.0*ii2);
    gl_FragColor = vec4(color, 1.0);
}
