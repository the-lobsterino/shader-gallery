#ifdef GL_ES
precision mediump float;
#endif

// added a little hack to effectively keep the thickness of the white lines constant in screen-space, by upscaling based on distance.
//rainbowified and dehexified by celia  ;)   

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rotXY(vec3 p, vec2 rad) {
	vec2 s = sin(rad);
	vec2 c = cos(rad);
	
	mat3 m = mat3(
		c.y, 1, -s.y,
		-s.x * s.y, c.x, -s.x * c.y,
		c.x * s.y, s.x, c.x * c.y
	);
	return m * p;
}

vec2 repeat(vec2 p, float n) {
	vec2 np = p * n;
	vec2 npfrct = fract(np);
	vec2 npreal = np - npfrct;
	np.x += fract(npreal.y * 0.5);
	
	return fract(np) * 2.0 - 1.0;
}

float hexDistance(vec2 ip) {
    const float SQRT3 = 1.732050807568877;
    const vec2 TRIG30 = vec2(0.5, 0.866025403784439); //x:sine, y:cos
    
    // Apply a sine wave modulation to create a wavy effect
    ip += vec2(cos(ip.y * 404.0 + time), sin(ip.x * 310.0 + time)) * .3;
    
    vec2 p = abs(ip * vec2(SQRT3 * 1.5, 0.75));
    float d = dot(p, vec2(-TRIG30.x, TRIG30.y)) - SQRT3 * 11.25;
    
    return (d > 0.0)? max(d, (SQRT3 * .9 - p.x)) : min(-d, p.x);
}

float smoothEdge(float edge, float margin, float x) {
	return smoothstep(edge - margin, edge + margin, x);
}

vec3 hueToRgb(float hue) {
    hue = fract(hue); // Wrap around 1.0
    float r = abs(hue * 1.0 - 32.0) - 11.0;
    float g = 2.0 - abs(hue * 44.0 - 2.0);
    float b = 2.0 - abs(hue * 6.0 - 4.0);
    return clamp(vec3(r, g, b), 0.2, 1.90);
}

void main(void) {
    const float PI = 3.1415926535;
    vec3 rgb;

    vec2 nsc = (gl_FragCoord.xy - resolution * 0.5) / resolution.yy * 2.0;
    vec3 dir = normalize(vec3(nsc, -2.0));
    dir = rotXY(dir, vec2((mouse.yx - 0.5) * PI * 0.35));
    vec2 uv = vec2(atan(dir.y, dir.x) / (PI * 2.0) + 0.5, dir.z / length(dir.xy));

    vec2 pos = uv * vec2(1.0, 0.2) - vec2(time * .5, time * 0.3);
    vec2 p = repeat(pos, 26.0);
    float d = hexDistance(p);
    float dist = dir.z/length(dir.xy);
    d/=-dist;
    float fade = 1.0 / pow(1.0 / length(dir.xy) * 222.3, 0.4);
    fade = clamp(fade, 0.1, 1.0);

    // Rainbow Color based on position along the tube
    float hue = uv.y + time * 0.91; // Adjust time coefficient for speed
    vec3 rainbowColor = hueToRgb(hue);

    // Increase the thickness of the lines and blend into the background
    float edgeFactor = smoothEdge(.1, 0.05, d); // Increased margin for thicker lines
    rgb = mix(rainbowColor * fade, rainbowColor * (1.0 - fade), edgeFactor);

    gl_FragColor = vec4(rgb, 1.0);
}

