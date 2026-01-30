#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float mag = -2.42;

float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

// Value noise generator. Returns
// three values on [-1, +1]
vec3 noised(vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);

	// The constant for tileWidth doesn't matter much unless it is too small
    const float tileWidth = 2048.0;
    float n = p.x + p.y * tileWidth;

    // Grab noise values at four corners of a square
    float a = hash(n +  0.0);
    float b = hash(n +  1.0);
    float c = hash(n + tileWidth);
    float d = hash(n + tileWidth + 1.0);

    // use smoothstep-filtered lerp for one component and compute the derivatives for the others
	// See http://www.iquilezles.org/www/articles/morenoise/morenoise.htm

    // The (negative) smoothstep weight
    vec2 u = f * f * (3.0 - 2.0 * f);
	return vec3(a+(b-a)*u.x+(c-a)*u.y+(a-b-c+d)*u.x*u.y,
				60.0*f*f*(f*(f-2.0)+1.0)*(vec2(b-a,c-a)+(a-b-c+d)*u.yx));
}

// On the range [0, 1].  This is the sum
// of a convergent series http://en.wikipedia.org/wiki/Series_(mathematics)#Convergent_series, 
// where each term has a pseudorandom weight on [-1, 1].  The largest sum is therefore
// 2 (the smallest is -2), and the final line of code rescales this to the unit interval.
// 
float heightfieldFcn(vec2 P) {
    const mat2 M2 = mat2( 0.5, 1.0, -1.0, .5);
    float height = 0.0;
	vec2 d = vec2(0.0);

    // Magnitude at this octave
    float magnitude = 0.5;

    // Add multiple octaves of noise, chosen from points that spiral outward
    // to avoid hitting the tiling period of the noise function.
    for (int i = 0; i < 7; ++i) {
        vec3 n = noised(P+time);
        d += n.yz;

        // The 1 + |d|^2 denominator creates the mountainous lumpiness.
        // Without it, this is a standard value noise function.
        height += magnitude * n.x / (1.0 + dot(d, d));
        P = M2 * P;
		magnitude *= 0.5 * mag;
    }

	// iq's original had 0.5 here, but that doesn't fit the range
    return height * 0.5 + 0.2;
}

void main()
{
	vec2 uv = (gl_FragCoord.xy / resolution.xy );
	uv -= vec2(.5);
	uv *= 200.;
	uv += vec2(17655., 6250.);
	gl_FragColor = vec4(vec3(heightfieldFcn(uv)),1.0);
}