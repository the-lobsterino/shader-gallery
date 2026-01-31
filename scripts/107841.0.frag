#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 iResolution = vec3(resolution.x,resolution.y,100.);
vec4 iMouse = vec4(mouse.x,mouse.y,5.,5.);
float iGlobalTime = time;
uniform sampler2D iChannel0;

// by @301z + quasi 3d by El Sphinx

float rand(vec2 n) { 
	return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 3231.5453);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

// Fractional Brownian Amplitude. Suma varias "capas" de ruido.
float fbm(vec2 n) {
	float total = 0.0, amplitude = 1.;
	for (int i = 0; i < 6; i++) {
		total += noise(n) * amplitude;
		n += n * 1. - n * float(i)/6.;
		amplitude *= 0.4;
	}
	return total;
}

float map(vec3 n) {
	vec3 p = n;
	n.y -= time + fbm(vec2(length(p) + time)) * .2;
	n.x = fbm(vec2(n.xy));
	n.z = fbm(vec2(n.zy));
	return length(n.xz)+.1;
}

vec3 derivate(vec3 p)
{
	float d = 0.02;

	vec3 d0  = vec3( d, -d, -d);
	vec3 d1  = vec3(-d, -d,  d);
	vec3 d2  = vec3(-d,  d, -d);
	vec3 d3  = vec3( d,  d,  d);

	float f0 = map(p + d0);
	float f1 = map(p + d1);
	float f2 = map(p + d2);
	float f3 = map(p + d3);

	return normalize(d0*f0+d1*f1+d2*f2+d3*f3);
}
float trace(vec3 p, vec3 d){
	float l;
	float t;
	for(int i = 0; i < 16; i++)
	{
		l = map(p);
		p += d*l * .1 * t/l;
		t += l;
	}
	
	return t*.18;
}

void main() {
	// Colores
	const vec3 c1 = vec3(0.1, 0.0, 0.3); // Rojo oscuro.
	const vec3 c2 = vec3(0.4, 0.0, 0.0); // Rojo claro.
	const vec3 c3 = vec3(0.6, 0.3, 0.0); // Rojo oscuro.
	const vec3 c4 = vec3(0.9, 0.8, 0.0); // Amarillo.
	const vec3 c5 = vec3(0.9); // Gris oscuro.
	const vec3 c6 = vec3(-0.4); // Gris claro.
	
	vec2 uv = gl_FragCoord.xy / iResolution.xx; // Desfasa las coordenadas para que haya más cambio de un resultado a los colindantes.
	vec3 d = normalize(vec3(uv * 8. - 4., -3.));
	
	vec3 p = vec3(512., 0., 256.);

	d += vec3(cos(3.15*(mouse.x)), sin(1.5*(mouse.y)), 1.);
	float q = fbm(uv + iGlobalTime * 0.1); // Ruido con offset para el movimiento.
	vec2 r = vec2(fbm(d.xy + q + iGlobalTime * 0.3 - p.x - p.y), fbm(uv + q - iGlobalTime * 0.4));
	
	
	float t = trace(p, d)*.3;
	vec3 n = derivate(p+d*t);
	float ndl = max(0., dot(d, n));
	vec3 c = (mix(c1, c2, fbm(uv + t)) + mix(c3, c4, ndl) - mix(c5, c6, t));
	c *= .3 + c;
	gl_FragColor = vec4(.05 * t * c + c * ndl, 1.0); // Gradiente más ocuro arriba.
}
