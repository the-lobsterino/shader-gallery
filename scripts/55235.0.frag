#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define iTime time *0.5
#define iResolution resolution

float random (in vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
float noise (in vec2 st)
{
	vec2 i = floor(st);
	vec2 f = fract(st);
	float a = random(i);
	float b = random(i + vec2(1.0, 0.0));
	float c = random(i + vec2(0.0, 1.0));
	float d = random(i + vec2(1.0, 1.0));
	vec2 u = f*f*(3.0-2.0*f);
	return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

mat2 rot(float a)
{
    vec2 r = vec2(cos(a), 1.0);
    return mat2(r.x, r.y, -r.y, r.x);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 pos = (2.*fragCoord - iResolution.xy ) / iResolution.y;
    pos.y+=1.25;
    pos*=2.0;
    pos *= rot(length(pos) - 2.0 / length(pos) - 2.0 * iTime);
    vec3 col = 0.2 * vec3(0.2 * (1.0 + 0.5 * sin(4.0 * pos.x)), 0.4, 0.8 * (1.0 + 0.25 * sin(iTime)));
    float light = 0.;
    for(int i = 0; i < 5; i++)
        light += pow(0.5, float(i)) * noise(pow(2.0, float(i)) * pos + 0.1 * iTime);
    col += 0.4 * vec3(.7, 0.5, 0.0) * light;	
    fragColor = vec4(col,1.0);
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}