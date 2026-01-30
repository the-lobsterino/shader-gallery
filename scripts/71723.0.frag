#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define iTime time
#define iMouse mouse
#define iResolution resolution

float rand(vec2 co) {
	return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 uv) {
	const vec2 c = vec2(0, 1);
	vec2 f = fract(uv);
	f = f * f * (3. - 2. * f);
	float xy0 = mix(rand(floor(uv + c.ss)), rand(floor(uv + c.ts)), f.x);
	float xy1 = mix(rand(floor(uv + c.st)), rand(floor(uv + c.tt)), f.x);
	return mix(xy0, xy1, f.y);
}

// https://www.shadertoy.com/view/MltBRN

#define EPS 0.01

vec3 cameraPos = vec3(0.0, 2.0, 1.5);
vec4 plane = vec4(0.0, 1.0, 0.0, 2.0);
vec3 lightDir = vec3(1.0, 1.0, 1.0);
vec3 skyCol = vec3(0, 0.745, 0.9);

const float heightFactor = 3.0; // height factor. will multiply to texture texel.

float distPlane(in vec3 p, vec4 n)
{
    return dot(p, n.xyz) * n.w;
}

float distFunc(in vec3 p)
{
	float d = distPlane(p, plane);
//	vec4 tex = texture(iChannel0, mod(p.xz * 0.2, 1.0));
//	float tex = (cos(length(p.xz) * 6.) + 1.) / 2.;
	float tex = noise(p.xz);
	tex *= heightFactor;
	return d - tex;
}

vec3 getNormal(in vec3 p)
{
    const float e = EPS;
    const vec3 dx = vec3(e, 0, 0);
    const vec3 dy = vec3(0, e, 0);
    const vec3 dz = vec3(0, 0, e);
    
    float d = distFunc(p);
    
    return normalize(vec3(
    	d - distFunc(p - dx),
    	d - distFunc(p - dy),
    	d - distFunc(p - dz)
    ));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 R = iResolution.xy;
    vec2 p = (fragCoord.xy * 2.0 - R.xy) / min(R.x, R.y);
    
    vec2 m = iMouse / iResolution.xx;
    
    vec3 origin = cameraPos;
    float t = iTime * 0.01;
    const float cd = 3.0;
    const float sp = 2.0;
    float x = cos(t * sp) * cd;
    float z = sin(t * sp) * cd;
    
    vec3 target = vec3(0, 2.5, 0);
    
    vec3 cPos = origin + vec3(x, 0, z);
    //vec3 cDir = normalize(vec3(m.x, -m.y, -1.0));
    vec3 cDir = normalize(cPos - target);
    vec3 cSide = normalize(cross(cDir, vec3(0, 1, 0)));
    vec3 cUp = normalize(cross(cSide, cDir));
    
    float targetDepth = 1.3;
    
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
    
    const int maxSteps = 128;
    
    float d = 0.0;
    float depth = 0.0;
    vec3 pos;
    
    vec3 col = vec3(0.0);
    
    for (int i = 0; i < maxSteps; i++)
    {
        pos = cPos + ray * depth;
        d = distFunc(pos) * 0.1;
        
        if (d <= EPS)
        {
            break;
        }
        
        depth += d;
    }
    
    if (d <= EPS)
    {
        vec3 n = getNormal(pos);
        float diff = dot(n, normalize(lightDir));
        float fog = 1.0 - exp(-depth * 0.12);
        col = mix(vec3(diff), skyCol, fog);
    }
    else
    {
        col = skyCol;
    }
    

    // Output to screen
    fragColor = vec4(col,1.0);
}

void main() {
	mainImage(gl_FragColor, gl_FragCoord.xy);
}
