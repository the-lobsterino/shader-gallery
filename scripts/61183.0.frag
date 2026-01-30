/*
 * Original shader from: https://www.shadertoy.com/view/ltBSzG
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
//	Voronoi distance to borders from iq:
//	https://www.shadertoy.com/view/ldl3W8

const float duration = 2.0;
const float borderNoise = 0.4;
const float lineNoise = 0.1;
const float borderBlend = 0.03;
const float lineBlend = 0.15;

float hash11(float p) {
    vec2 p2 = fract(p * vec2(443.8975, 397.2973));
    p2 += dot(p2.xy, p2.yx + 19.19);
    return fract(p2.x * p2.y);
}

float hash13(vec3 p) {
	p  = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p.xyz, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
}

vec2 hash22(vec2 p) {
	p = fract(p * vec2(5.3983, 5.4427));
    p += dot(p.yx, p.xy +  vec2(21.5351, 14.3137));
	return fract(vec2(p.x * p.y * 95.4337, p.x * p.y * 97.597));
}

vec2 hash23(vec3 p) {
	p  = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p.xyz, p.yzx + 19.19);
    return fract(vec2(p.x * p.y * 95.4337, p.x * p.z * 97.597));
}

vec2 noise22(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
    return 1.0 - 2.0 * mix(mix(hash22(i + vec2(0.0, 0.0)), 
                               hash22(i + vec2(1.0, 0.0)), u.x),
                           mix(hash22(i + vec2(0.0, 1.0)), 
                               hash22(i + vec2(1.0, 1.0)), u.x), u.y);
}

const mat2 m = mat2(1.616, 1.212, -1.212, 1.616);

vec2 fbm22(vec2 p) {
    vec2 f = noise22(p); p = m * p;
    f += 0.5 * noise22(p); p = m * p;
    f += 0.25 * noise22(p); p = m * p;
    f += 0.125 * noise22(p); p = m * p;
    f += 0.0625 * noise22(p);
    return f / 1.9375;
}

vec3 voronoi(in vec2 x, in float id) {
    vec2 n = floor(x);
    vec2 f = fract(x);
	vec2 mg, mr;
    float md = 8.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ ) {
        vec2 g = vec2(float(i),float(j));
		vec2 o = hash23( vec3(n + g, id) );
        vec2 r = g + o - f;
        float d = dot(r,r);
        if( d<md ) {
            md = d;
            mr = r;
            mg = g;
        }
    }
    md = 8.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ ) {
        vec2 g = mg + vec2(float(i),float(j));
		vec2 o = hash23( vec3(n + g, id) );
        vec2 r = g + o - f;
        if( dot(mr-r,mr-r)>0.00001 )
        md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
    }
    return vec3( n + mg, md );
}

#define range(min, max) min + (max - min) * hash11(imageID + (hash += 0.1))

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 pos = fragCoord.xy / iResolution.y;
    
    float imageID = floor(iTime / duration);
    float t = mod(iTime / duration, 1.0);

    float hash = 0.0;
    float cellCount = range(6.0, 14.0);
    float lineCount = range(3.0, 6.0);
    float lineWidth = range(0.3, 0.6);
    float background = range(0.8, 1.0);
    float colorScale = range(0.5, 0.9);
    float colorSat = range(0.2, 0.5);
    float colorOffset = 1.0 - colorSat;
    float hueCount = floor(range(3.0, 6.5));
    float hueDistrib = range(0.4, 1.0);
    float hueAngle = range(0.0, 1.0);
    
    float totalCount = lineCount * cellCount;
    
    vec2 cellPos = pos * cellCount;
    cellPos += borderNoise * fbm22(cellPos);
    pos *= totalCount;
    pos += lineNoise * fbm22(2.0 * pos);

    vec3 cell = voronoi(cellPos, imageID);
    vec3 cellID = vec3(cell.xy, imageID);
    float angle = 6.2831853 * hash13(cellID);
    float phase = hash13(cellID + 0.1);

    float x = mod(pos.x * sin(angle) + pos.y * cos(angle) + phase, 1.0);
    x = smoothstep(0.0, lineBlend, x) * smoothstep(lineWidth + lineBlend, lineWidth, x);
    x *= smoothstep(0.05, 0.05 + lineBlend, cell.z * lineCount);

    float hue = floor(hash13(cellID + 0.2) * hueCount) * hueDistrib / hueCount + hueAngle;
    vec3 color = vec3(colorOffset) + vec3(colorSat) * cos(6.2831853 * (vec3(hue) + vec3(0.0, 0.33, 0.67)));

    color = mix(vec3(background), colorScale * color, x);
    
    color *= smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.9, t);
	fragColor = vec4(color, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}