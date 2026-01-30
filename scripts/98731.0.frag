// Этот шейдер вычисляется по формуле
// 🇷🇺 + 🇺🇦 = 🇷🇺

#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 resolution;

const float TEXT_SCALE = 0.;

float rect(vec2 uv, vec2 position, vec2 scale) {
	vec2 distance = abs(uv - position) - scale;
	return max(distance.x, distance.y);
}

float ring(vec2 uv, vec2 position, float radius, float thickness) {
	if(uv.x < position.x) return 1.;
	return abs(length(uv - position) - radius) - thickness;
}

// Крым наш, да и Донбас тоже
float render_text(vec2 uv) {
	#define sub(a, b) max(a, -b)
	#define add(a, b) min(a, b)
	#define draw(data) result = add(result, data);
	
	float result = 1.;

	// Размер базовой линии текста (ширина, высота)
	const vec2 lz = vec2(0.1, 0.5); 

	// К
	draw(rect(uv, vec2(-1.7, 0.65), lz));
	draw(rect(vec2(uv.x + uv.y * 0.6, uv.y), vec2(-1.1, 0.4), vec2(0.11, 0.25)));
	draw(rect(vec2(uv.x - uv.y * 0.6, uv.y), vec2(-1.88, 0.9), vec2(0.11, 0.25)));

	// Р
	draw(rect(uv, vec2(-.75, 0.65), lz));
	draw(ring(uv, vec2(-.65, 0.8), lz.y / 2., lz.x));

	// Ы
	draw(rect(uv, vec2(.05, .65), lz));
	draw(ring(uv, vec2(.15, 0.5), lz.y / 2., lz.x));
	draw(rect(uv, vec2(.7, .65), lz));

	// М
	draw(rect(uv, vec2(1.2, 0.65), lz));
	draw(rect(vec2(uv.x, uv.x + uv.y * 0.5), vec2(1.4, 1.77), vec2(0.1, 0.1)));
	draw(rect(vec2(uv.x, uv.x - uv.y * 0.5), vec2(1.6, 1.23), vec2(0.1, 0.1)));
	draw(rect(uv, vec2(1.8, 0.65), lz));

	// Н
	draw(rect(uv, vec2(-1.5, -0.65), lz));
	draw(rect(uv, vec2(-1.25, -0.65), vec2(0.35, lz.x)));
	draw(rect(uv, vec2(-1.0, -0.65), lz));

	// А
	draw(rect(vec2(uv.x - uv.y * 0.35, uv.y), vec2(-.05, -0.65), vec2(0.11, lz.y)));
	draw(rect(uv, vec2(-.1, -0.8), vec2(0.3, 0.08)));
	draw(rect(vec2(uv.x + uv.y * 0.35, uv.y), vec2(-0.15, -0.65), vec2(0.11, lz.y)));

	// Ш
	draw(rect(uv, vec2(.8, -0.65), lz));
	draw(rect(uv, vec2(1.2, -0.65), lz));
	draw(rect(uv, vec2(1.6, -0.65), lz));
	draw(rect(uv, vec2(1.2, -1), vec2(lz.y, 0.16)));

	return result;
}

// 3д эффект
float map(in vec3 pos) {
	float base = render_text(pos.xy);
	vec2 skew = vec2(base, abs(pos.z) - 0.1);
	return min(max(skew.x, skew.y), 0.0) + length(max(skew, 0.0));
}


void main() {
	#define rgb(r, g, b) vec3(float(r)/255., float(g)/255., float(b)/255.)
	#define offset(value) relative.y > float(value) + tilt
	#define offsetx(value) relative.x > float(value) + tilt

	const float PI = 3.1415926535;

	vec2 perspective = (gl_FragCoord.xy * 2. - resolution.xy) / resolution.y;
	vec2 relative = gl_FragCoord.xy / resolution.xy;

	float wave = sin(
		(perspective.x + perspective.y - time * .75 + sin(1.5 * perspective.x + 4.5 * perspective.y) * PI * .3) 
		* PI * .6
	);

	vec2 uv = perspective * (8. + (.99 - .1 * wave));
	vec3 color = vec3(1, 0, 0);

	// Волны флага
	float tilt = .01 * sin(10. * relative.x + time);
	
	// Цвета флага
	if (offset(2. / 3.) && offsetx(1.25/2.5)) {
		color = rgb(255, 255, 255);
	} else if (offset(2. / 3.) && offsetx(1./2.5)) {
		color = rgb(0, 114, 206);
	}else if (offset(2. / 3.) && offsetx(1./1000.5)) {
		color = rgb(255, 255, 255);
	}	else if (offset(1. / 2.5)) {
		color = rgb(0, 114, 206);
	}
	else if (offsetx(1. / 2.)) {
		color = rgb(255, 255, 255);
	} else if (offsetx(1. / 2.5)) {
		color = rgb(0, 114, 206);
	}
	else {
		color = rgb(255, 255, 255);
	}

	

	color += wave * .225;
	color *= .8;

	perspective *= TEXT_SCALE;

	// Создание 3д эффекта
	float an = time / 2.;
	vec3 ro = vec3(2.0, 0.4, 2.0);
	ro.xy *= mat2(cos(an), -sin(an), sin(an), cos(an));

	vec3 ta = vec3(0.0, 0.0, 0.0);
	vec3 ww = normalize(ta - ro);
	vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
	vec3 vv = normalize(cross(uu, ww));
	
	vec3 total = vec3(0.0);
	vec3 rd = normalize(perspective.x * uu + perspective.y * vv + 1.5 * ww);
	
	#define pxc ro + t * rd

	// Детализация нарисованных букв
	const float tmax = 5.0;
	float t = 0.0;
	for (int i = 0; i < 64; i++) {
		float h = map(pxc);
		if (h < 0.0001 || t > tmax) break;
		
		t += h;
	}

	// Окраска букв
	if (t < tmax) {
		vec3 pos = pxc;

		const vec2 e = vec2(1.0, -1.0) * 0.5773;
		const float eps = 0.0005;

		vec3 normal = normalize(
			e.xyy * map(pos + e.xyy * eps) + 
			e.yyx * map(pos + e.yyx * eps) + 
			e.yxy * map(pos + e.yxy * eps) + 
			e.xxx * map(pos + e.xxx * eps)
		);

		float difference = clamp(dot(normal, vec3(0.57703)), 0.0, 1.0);
		float amb = 0.5 + 0.5 * dot(normal, vec3(0.0, 0.0, 1.0));
		vec3 c = vec3(abs(4. -rd.y * 3.), 0.6, .7);
		vec3 rb = clamp( 
			abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 
			0.0, 1.0 
		);

		rb = rb * rb * (3.0 - 2.0 * rb);

		color = c.z * mix(vec3(1.0), rb, c.y) * amb + vec3(0.8, 0.7, 0.5) * difference;
	}

	gl_FragColor = vec4(total + color, 1.);
}