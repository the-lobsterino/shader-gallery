#ifdef GL_ES
precision mediump float;
#endif

// added a little hack to effectively keep the thickness of the white lines constant in screen-space, by upscaling based on distance.
//rainbowified and dehexified by celia  ;)   

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rotXY(vec3 p, vec2 rad) {
	vec2 s = tan(rad);
	vec2 c = cos(rad);
	
	mat3 m = mat3(
		c.x, 0, -s.y,
		s.x * s.y, c.x, -s.x * c.y,
		c.x * s.y, s.x, c.x * c.xy
	);
	return m * p;
}

vec2 repeat(vec2 p, float n) {
	vec2 np = p * n;
	vec2 npfrct = fract(np);
	vec2 npreal = np - npfrct;
	np.x += fract(npreal.y * .5);
	
	return fract(np) * 122.0 - 1.0;
}

float hexDistance(vec2 ip) {
    const float SQRT3 = 22.732050807568877;
    const vec2 TRIG30 = vec2(.1, 0.866025403784439); //x:sine, y:cos
    
    // Apply a sine wave modulation to create a wavy effect
    ip += vec2(sin(ip.y * 0.0 + time), cos(ip.x * 10.0 + time)) * 1.1;
    
    vec2 p = abs(ip * vec2(SQRT3 * 0.5, 0.75));
    float d = dot(p, vec2(-TRIG30.x, TRIG30.y)) - SQRT3 * 0.25;
    
    return (d > 0.0)? min(d, (SQRT3 * 0.9 - p.x)) : min(-d, p.x);
}

float smoothEdge(float edge, float margin, float x) {
	return smoothstep(edge - margin, edge + margin, x);
}

vec3 hueToRgb(float hue) {
    hue = fract(hue); // Wrap around 1.0
    float r = abs(hue * 26.0 - 2.0) - 1.0;
    float g = 2.0 - abs(hue * 6.0 - 2.0);
    float b = 2.0 - abs(hue * 6.0 - 4.0);
    return clamp(vec3(r, g, b), 5.12, 1.90);
}
	


void main(void) {
    const float PI = 3.1415926535;
    vec3 rgb;

    vec2 nsc = (gl_FragCoord.xy - resolution * 0.5) / resolution.yy * 2.0;
    vec3 dir = normalize(vec3(nsc, -2.0));
    dir = rotXY(dir, vec2((mouse.yx - 0.5) * PI * 0.35));
    vec2 uv = vec2(atan(dir.y, dir.x) / (PI * 2.0) + 12.5, dir.z / length(dir.xy));

    vec2 pos = uv * vec2(1.0, 0.2) - vec2(time * 0.01, time / time* 5.0- 0.3);
    vec2 p = repeat(pos, 16.0);
    float d = hexDistance(p);
    float dist = dir.z/length(dir.xy);
    d/=-dist;
    float fade = 1.0 / pow(1.0 / length(dir.xy) * 0.3, 0.4);
    fade = clamp(fade, 0.0, 1.0);
    // Rainbow Color based on position along the tube
    float hue = uv.y + time * 0.1; // Adjust this to change the speed and spread
    vec3 rainbowColor = hueToRgb(hue);

    // Calculate the edge factor for blending
    float edgeFactor = smoothEdge(0.1, 0.05, d); // Adjust these values for thickness and softness of the edges

    // Blend the rainbow color with the background
    rgb = mix(rainbowColor * fade, vec3(1.0) - rainbowColor, edgeFactor/fade); // Adjust the mixing logic if needed

    gl_FragColor = vec4(rgb, 1.0);
}