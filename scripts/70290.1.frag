// dicks
#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
#define PLANET_RADIUS 1.5
#define MAP_SCALE 2.0
#define MAP_ROUGHNESS 5.0
#define MAP_HEIGHT 0.6
#define MARKER_SPACING 0.75

vec3 Hash33(in vec3 p) {
    return vec3(fract(sin(dot(p, vec3(7643.54, 6854.95, 356.6765))) * 234.752),
                fract(sin(dot(p, vec3(7853.67, 5214.327, 435.6437))) * 6734.8275),
                fract(sin(dot(p, vec3(7546.754, 683.2647, 358.2431))) * 257.8643));
}

float noise(in vec3 p) {
    return fract(sin(dot(p, vec3(3743.54, 2754.23, 578.537))) * 5664.865);
}

float snoise(in vec3 p) {
    vec3 cell = floor(p);
    vec3 local = fract(p);
    local *= local * (3.0 - 2.0 * local);

    float ldb = noise(cell);
    float rdb = noise(cell + vec3(1.0, 0.0, 0.0));
    float ldf = noise(cell + vec3(0.0, 0.0, 1.0));
    float rdf = noise(cell + vec3(1.0, 0.0, 1.0));
    float lub = noise(cell + vec3(0.0, 1.0, 0.0));
    float rub = noise(cell + vec3(1.0, 1.0, 0.0));
    float luf = noise(cell + vec3(0.0, 1.0, 1.0));
    float ruf = noise(cell + 1.0);

    return mix(mix(mix(ldb, rdb, local.x),
                   mix(lub, rub, local.x),
                   local.y),

               mix(mix(ldf, rdf, local.x),
                   mix(luf, ruf, local.x),
                   local.y),

               local.z);
}

float fnoise(in vec3 p) {
    p *= MAP_SCALE;

    float value = 0.0;
    float nscale = 1.0;
    float tscale = 0.0;

    for (float octave=0.0; octave < MAP_ROUGHNESS; octave++) {
        value += snoise(p) * nscale;
        tscale += nscale;
        nscale *= 0.5;
        p *= 2.0;
    }

	float nn = value / tscale;
	nn = clamp(nn,0.5,1.0);
	
	
	return nn;
	//return value / tscale;
}

vec3 map(in vec3 p) {
    float n = fnoise(p);
	
	
    vec3 color = mix(vec3(0.0, 0.0, 1.25 - n), mix(vec3(0.0, 1.0, 0.0), vec3(0.8, 0.4, 0.0), n * n), float(n > 0.5));

    vec3 pinPos = floor(p / MARKER_SPACING + 0.5) * MARKER_SPACING;
    pinPos += 0.45 * Hash33(pinPos) - 0.225;
    pinPos = normalize(pinPos) * (PLANET_RADIUS + fnoise(p) * MAP_HEIGHT);
    float pin = length(p - pinPos) - 0.05;
    n = fnoise(pinPos);
    if (n > 0.5 && pin < 0.0) {
        color = vec3(1.0, 0.0, 0.0);
    }

    return color;
}

float mapScene(in vec3 p) {
    float earth = length(p) - PLANET_RADIUS;
    earth -= fnoise(p) * MAP_HEIGHT;
    return earth * 0.5;
}

vec3 getNormal(in vec3 p) {
    return normalize(vec3(mapScene(p + vec3(0.001, 0.0, 0.0)) - mapScene(p - vec3(0.001, 0.0, 0.0)),
                          mapScene(p + vec3(0.0, 0.001, 0.0)) - mapScene(p - vec3(0.0, 0.001, 0.0)),
                          mapScene(p + vec3(0.0, 0.0, 0.001)) - mapScene(p - vec3(0.0, 0.0, 0.001))));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);

    vec3 ro = vec3(0.0, 0.0, 5.0);
    vec3 rd = normalize(vec3(uv, -1.0));

    float t = 0.0;
    for (float iters=0.0; iters < 100.0; iters++) {
        vec3 p = ro + rd * t;

        vec2 cs = sin(iTime + vec2(1.57, 0.0));
        p.xz *= mat2(cs, -cs.y, cs.x);
        p.yz *= mat2(cs, -cs.y, cs.x);

        float d = mapScene(p);
        if (d < 0.001) {
            vec3 n = getNormal(p);
            vec3 l = vec3(-0.58, 0.58, 0.58);

            n.yz *= mat2(cs.x, -cs.y, cs.yx);
            n.xz *= mat2(cs.x, -cs.y, cs.yx);

            fragColor.rgb += map(p);
		float ddd = max(0.3, dot(n, l));
            fragColor.rgb =n;
		
  	vec3 ref = reflect(rd, n);
	float spe = max(dot(ref, l), 0.0);
		
		fragColor.rgb += pow(spe,8.0);
		
            break;
        }

        if (t > 10.0) {
            break;
        }

        t += d;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;	
}