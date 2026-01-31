precision lowp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution; // Количество пикселей по горизонтали и вертикали

#define sqr(x) ((x)*(x))
const float PI = 2.0 * acos(0.0);

// Однополостной гиперболоид, заданный в канонической системе координат:
// x^2 / a^2 + y^2 / b^2 - z^2 / c^2 = 1
struct Hyperboloid {
	float a, b, c;
};

// Прямая, заданная параметрически:
// r = r0 + t a
struct Line {
	vec3 r0, a;
};
	

// Возвращяет true, если уравнение
// a t^2 + 2k t + c = 0
// имеет корни t1, t2
bool rootsQuadratic(float a, float k, float c, out float t1, out float t2) {
	float D_4 = k*k - a*c;
	if (D_4 < 0.0)
		return false;
	float s = sqrt(D_4);
	t1 = (-k + s) / a;
	t2 = (-k - s) / a;
	return true;
}

// Возвращает true, если прямая l пересекает гиперболоид h в точках p1, p2
bool intersection(Hyperboloid h, Line l, out vec3 p1, out vec3 p2) {
	float a = sqr(l.a.x) / sqr(h.a)
		+ sqr(l.a.y) / sqr(h.b)
		- sqr(l.a.z) / sqr(h.c);
	float k = l.r0.x * l.a.x / sqr(h.a)
		+ l.r0.y * l.a.y / sqr(h.b)
		- l.r0.z * l.a.z / sqr(h.c);
	float c = sqr(l.r0.x) / sqr(h.a)
		+ sqr(l.r0.y) / sqr(h.b)
		- sqr(l.r0.z) / sqr(h.c)
		- 1.0;
	float t1, t2;
	bool intersect = rootsQuadratic(a, k, c, t1, t2);
	p1 = l.r0 + l.a * t1;
	p2 = l.r0 + l.a * t2;
	return intersect;
}
				    
				    
// Параметры затухания
const float angleDecayDist = PI; // Угол поворота, при котором след полностью затухает
const bool symmetricDecay = false;
// Величина затухания для точки окружности, отстоящей на угол angleDist от источника света
float decayFunction(float angleDist, float angleDecayDist) {
	return max(1.0 - angleDist / angleDecayDist, 0.0); // линейно
	//return angleDist <= angleDecayDist ? 1.0 - sqrt(1.0 - sqr(angleDist / angleDecayDist - 1.0)) : 0.0; // "левая нижняя" часть окружности с центром в (1, 1)
	//return max(1.0 - pow(angleDist / angleDecayDist, 0.5), 0.0); // степенная
	//return angleDist <= angleDecayDist ? 1.0 : 0.0; // ступенька
	//return exp(-2.0 * angleDist / angleDecayDist); // экспоненциально
	//return angleDist <= angleDecayDist ? exp(-1.0 / (1.0 - sqr(angleDist / angleDecayDist))) / exp(-1.0) : 0.0; // функция-шапочка
}

// Прямолинейная образующая (x, y, z) = (a, tb, tc) при вращении вокруг оси Z заметает множество точек вида
// (a cos(phi) - tb sin(phi), a sin(phi) + tb cos(phi), tc)

// Яркость точки p на гиперболоиде h в момент, когда образующая повёрнута на угол angle
float brightness(Hyperboloid h, vec3 p, float angle) {
	float s = h.a * sqr(h.c) * p.y - h.b * h.c * p.x * p.z;
	float c = h.a * sqr(h.c) * p.x + h.b * h.c * p.y * p.z;
	// Угол, на который была повёрнута образующая в момент, когда проходила через точку p
	float anglePos = atan(s, c);
	float angleDist = mod(angle - anglePos, 2.0 * PI);
	// Отражать ли график функции затухания относительно прямой x = pi
	return !symmetricDecay
		? decayFunction(angleDist, angleDecayDist)
		: angleDist <= PI ? decayFunction(angleDist, angleDecayDist) : decayFunction(2.0 * PI - angleDist, angleDecayDist);
}

// Возвращает true, если точка p находится на внешней стороне поверхности, когда на неё смотрят в направлении eyeDir
bool isOuterSurface(Hyperboloid h, vec3 p, vec3 eyeDir) {
	// Внешняя нормаль к гиперболоиду h в точке p
	vec3 n = vec3(p.x / sqr(h.a), p.y / sqr(h.b), -p.z / sqr(h.c));
	return dot(eyeDir, n) <= 0.0;
}


// Параметры гиперболоида
const Hyperboloid hyperboloid = Hyperboloid(0.5, 0.5, 0.7);
const vec4 colorOuter = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 colorInner = vec4(1.0, 0.0, 0.0, 1.0);
const float hyperboloidHeight = 0.5;

// Цвет точки p на гиперболоиде h, когда на неё смотрят в направлении eyeDir, и образующая повёрнута на угол angle
vec4 getColor(Hyperboloid h, vec3 p, vec3 eyeDir, float angle) {
	if (!(-hyperboloidHeight <= p.z && p.z <= hyperboloidHeight))
		return vec4(0.0);
	vec4 c = isOuterSurface(h, p, eyeDir) ? colorOuter : colorInner;
	c *= brightness(h, p, angle);
	return c;
}


void main() {
	vec2 aspect = resolution.xy / resolution.y;
	// gl_FracCoord.xy -- это координаты центра данного пикселя (в пикселях) в системе координат с началом в левом нижнем угле
	// Т.е., например, для левого нижнего пикселя gl_FracCoord.x == 0.5, gl_FracCoord.y == 0.5
	// Нормируем координаты так, чтобы -1 <= pos.y <= 1
	vec2 pos = ((gl_FragCoord.xy / resolution.y) - 0.5 * aspect) * 2.0;
	
	float a = PI / 6.0;
	mat3 R = mat3(
		cos(a), 0, sin(a),
		0, 1, 0,
		-sin(a), 0, cos(a)
	);
	// Смотрим из точки eye.r0 в направлении eye.a
	Line eye = Line(R * vec3(0.0, pos), R * vec3(-1.0, 0.0, 0.0));
	
	vec4 c = vec4(0.0);
	vec3 p1, p2;
	// Пересекает ли линия взгляда гиперболоид
	if (intersection(hyperboloid, eye, p1, p2)) {
		float angle = time;
		c += getColor(hyperboloid, p1, eye.a, angle);
		c += getColor(hyperboloid, p2, eye.a, angle);
	}

	// Цвет данного пикселя
	gl_FragColor = min(c, vec4(1.0));
}