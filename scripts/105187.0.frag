// 🇺🇦 

#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 resolution;

const float TEXT_SCALE = 2.;

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
	#define add(a, b) min(a, b)
	#define draw(data) result = add(result, data);
	
	float result = 5.;

	// Размер базовой линии текста (ширина, высота)
	const vec2 lz = vec2(.1, .5); 

	// К
	draw(rect(uv, vec2(-1.7, .65), lz));
	draw(rect(vec2(uv.x + uv.y * .6, uv.y), vec2(-1.1, .4), vec2(.11, .25)));
	draw(rect(vec2(uv.x - uv.y * .6, uv.y), vec2(-1.88, .9), vec2(.11, .25)));

	// Р
	draw(rect(uv, vec2(-.75, .65), lz));
	draw(ring(uv, vec2(-.65, .8), lz.y / 2., lz.x));

	// Ы
	draw(rect(uv, vec2(.05, .65), lz));
	draw(ring(uv, vec2(.15, .5), lz.y / 2., lz.x));
	draw(rect(uv, vec2(.7, .65), lz));

	// М
	draw(rect(uv, vec2(1.2, .65), lz));
	draw(rect(vec2(uv.x, uv.x + uv.y * .5), vec2(1.4, 1.77), vec2(.1, .1)));
	draw(rect(vec2(uv.x, uv.x - uv.y * .5), vec2(1.6, 1.23), vec2(.1, .1)));
	draw(rect(uv, vec2(1.8, .65), lz));

	// Н
	draw(rect(uv, vec2(-1.5, -.65), lz));
	draw(rect(uv, vec2(-1.25, -.65), vec2(.35, lz.x)));
	draw(rect(uv, vec2(-1., -.65), lz));

	// А
	draw(rect(vec2(uv.x - uv.y * .35, uv.y), vec2(-.05, -.65), vec2(.11, lz.y)));
	draw(rect(uv, vec2(-.1, -.8), vec2(.3, .08)));
	draw(rect(vec2(uv.x + uv.y * .35, uv.y), vec2(-.15, -.65), vec2(.11, lz.y)));

	// Ш
	draw(rect(uv, vec2(.8, -.65), lz));
	draw(rect(uv, vec2(1.2, -.65), lz));
	draw(rect(uv, vec2(1.6, -.65), lz));
	draw(rect(uv, vec2(1.2, -1), vec2(lz.y, .16)));

	return result;
}

// 3д эффект
float map(in vec3 pos) {
	vec2 skew = vec2(render_text(pos.xy), abs(pos.z) - .1);
	return min(max(skew.x, skew.y), 0.) + length(max(skew, 0.));
}


void main() {
	#define rgb(r, g, b) vec3(float(r)/255., float(g)/255., float(b)/255.)
	#define offset(value) relative.y > float(value) + tilt

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
	if (offset(2. / 3.)) {
		color = rgb(0, 114, 206);
	} else if (offset(1.5 / 3.)) {
		color = rgb(0, 114, 206);
	}	else {
		color = rgb(239, 255, 64);
	}

	color += wave * .225;
	color *= .8;

	perspective *= TEXT_SCALE;

	// Создание 3д эффекта
	float an = time / 2.;
	vec3 ro = vec3(2., .4, 2.);
	ro.xy *= mat2(cos(an), -sin(an), sin(an), cos(an));

	vec3 ta = vec3(0., 0., 0.);
	vec3 ww = normalize(ta - ro);
	vec3 uu = normalize(cross(ww, vec3(0., 1., 0.)));
	vec3 vv = normalize(cross(uu, ww));
	
	vec3 total = vec3(0.);
	vec3 rd = normalize(perspective.x * uu + perspective.y * vv + 1.5 * ww);
	
	#define pxc ro + t * rd

	// Детализация нарисованных букв
	const float tmax = 5.;
	float t = 0.;
	for (int i = 0; i < 64; i++) {
		float h = map(pxc);
		if (h < .0001 || t > tmax) break;
		
		t += h;
	}

	// Окраска букв
	if (t < tmax) {
		vec3 pos = pxc;

		const vec2 e = vec2(1., -1.) * .5773;
		const float eps = .0005;

		#define _map(x) x * map(pos + x * eps)
		vec3 normal = normalize(_map(e.xyy) + _map(e.yyx) + _map(e.yxy) + _map(e.xxx));

		float difference = clamp(dot(normal, vec3(.57703)), 0., 1.);
		float amb = .5 + .5 * dot(normal, vec3(0., 0., 1.));
		vec3 c = vec3(abs(4. -rd.y * 3.), .6, .7);
		vec3 rb = clamp( 
			abs(mod(c.x * 6. + vec3(0.,4.,2.), 6.) - 3.) - 1., 
			0., 1. 
		);

		rb = rb * rb * (3. - 2. * rb);

		color = c.z * mix(vec3(1.), rb, c.y) * amb + vec3(.8, .7, .5) * difference;
	}

	gl_FragColor = vec4(total + color, 1.);
}