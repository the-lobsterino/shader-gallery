// Shader by Nicolas Robert [Nrx]
// Forked from https://www.shadertoy.com/view/ltX3Wr


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float line (vec2 p, vec2 a, vec2 b) {
	p -= a;
	b -= a;
	a = p - b * dot (p, b) / dot (b , b);
	b *= 0.5;
	p = abs (p - b) - abs (b);
	return max (length (a), max (p.x, p.y));
}

float circle (vec2 p, vec2 o, float r) {
	return abs (length (p - o) - r);
}

void main (void) {
	vec2 frag = (2.0 * gl_FragCoord.xy - resolution) / resolution.x;
	frag = 3.0 * frag + vec2 (2.6, 1.1);

	float d1 = max (circle (frag, vec2 (0.4, 0.5), 0.5), frag.x - 0.4);

	d1 = min (d1, line (frag, vec2 (0.8, 0.0), vec2 (0.8, 1.0)));
	d1 = min (d1, line (frag, vec2 (1.3, 0.0), vec2 (1.3, 1.0)));
	d1 = min (d1, line (frag, vec2 (0.8, 0.5), vec2 (1.3, 0.5)));

	d1 = min (d1, line (frag, vec2 (1.7, 0.0), vec2 (1.9, 1.0)));
	d1 = min (d1, line (frag, vec2 (2.3, 0.0), vec2 (2.1, 1.0)));
	d1 = min (d1, line (frag, vec2 (1.8, 0.2), vec2 (2.2, 0.2)));

	d1 = min (d1, max (circle (frag, vec2 (2.9, 0.7), 0.3), 2.8 - frag.x));
	d1 = min (d1, line (frag, vec2 (2.7, 0.0), vec2 (2.7, 1.0)));
	d1 = min (d1, line (frag, vec2 (2.9, 0.4), vec2 (3.2, 0.0)));

	d1 = min (d1, line (frag, vec2 (3.6, 0.0), vec2 (3.6, 1.0)));
	d1 = min (d1, line (frag, vec2 (3.6, 0.0), vec2 (4.0, 0.0)));

	d1 = min (d1, line (frag, vec2 (4.4, 0.0), vec2 (4.4, 1.0)));

	d1 = min (d1, line (frag, vec2 (4.8, 0.0), vec2 (4.8, 1.0)));
	d1 = min (d1, line (frag, vec2 (4.8, 0.0), vec2 (5.3, 0.0)));
	d1 = min (d1, line (frag, vec2 (4.8, 0.5), vec2 (5.3, 0.5)));
	d1 = min (d1, line (frag, vec2 (4.8, 1.0), vec2 (5.3, 1.0)));

	d1 -= 0.16;

	float d2 = max (circle (frag, vec2 (0.2, 1.7), 0.3), frag.y - 1.6);
	d2 = min (d2, line (frag, vec2 (0.5, 1.8), vec2 (0.5, 2.2)));

	d2 = min (d2, line (frag, vec2 (0.9, 1.4), vec2 (0.9, 2.2)));
	d2 = min (d2, line (frag, vec2 (0.9, 1.4), vec2 (1.4, 1.4)));
	d2 = min (d2, line (frag, vec2 (0.9, 1.8), vec2 (1.3, 1.8)));
	d2 = min (d2, line (frag, vec2 (0.9, 2.2), vec2 (1.4, 2.2)));

	d2 = min (d2, max (circle (frag, vec2 (4.9, 2.0), 0.2), frag.x - 4.8));
	d2 = min (d2, max (circle (frag, vec2 (5.1, 1.6), 0.2), 5.2 - frag.x));
	d2 = min (d2, line (frag, vec2 (5.0, 2.2), vec2 (5.15, 2.2)));
	d2 = min (d2, line (frag, vec2 (4.99, 1.8), vec2 (5.01, 1.8)));
	d2 = min (d2, line (frag, vec2 (4.75, 1.4), vec2 (5.0, 1.4)));

	d2 = min (d2, line (frag, vec2 (4.3, 1.4), vec2 (4.3, 2.2)));

	d2 = min (d2, line (frag, vec2 (3.9, 1.8), vec2 (3.9, 2.2)));
	d2 = min (d2, line (frag, vec2 (3.3, 1.8), vec2 (3.3, 2.2)));
	d2 = min (d2, max (circle (frag, vec2 (3.6, 1.7), 0.3), frag.y - 1.6));

	d2 = min (d2, max (circle (frag, vec2 (2.5, 2.0), 0.2), frag.x - 2.4));
	d2 = min (d2, max (circle (frag, vec2 (2.7, 1.6), 0.2), 2.8 - frag.x));
	d2 = min (d2, line (frag, vec2 (2.6, 2.2), vec2 (2.75, 2.2)));
	d2 = min (d2, line (frag, vec2 (2.59, 1.8), vec2 (2.61, 1.8)));
	d2 = min (d2, line (frag, vec2 (2.35, 1.4), vec2 (2.6, 1.4)));

	d2 -= 0.1;

	float tint = smoothstep (0.02, 0.0, min (d1, d2));
	if (d1 < d2) {
		tint *= 0.8;
	}
	gl_FragColor = vec4 (tint, tint, tint, 1.0);
}