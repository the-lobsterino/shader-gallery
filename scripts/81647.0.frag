// Refraction
// 
// by @aa_debdeb (https://twitter.com/aa_debdeb)
// for TokyoDemoFest
// 2018/12/02

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

#define MULTI_SAMPLING
#define USE_FLOOR_SHADOW

#define PI 3.14159265359
#define DEGREE_TO_RADIAN 0.01745329251
#define RECIPROCAL_GAMMA 0.45454545454

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

float Time = mod(time, 60.0) / 60.0;
const vec3 LightPosition = vec3(0.0, 20.0, 0.0);
const vec3 LightDirection = vec3(0.0, -1.0, 0.0);
const vec3 LightColor = vec3(1.0);
const float CosinePenumbra = cos(30.0 * DEGREE_TO_RADIAN);
const float CosineUmbra = cos(50.0 * DEGREE_TO_RADIAN);

const float FloorHeight = -8.0;
const vec3 FloorNormal = vec3(0.0, 1.0, 0.0);

const vec3 RefractiveColor = vec3(0.8, 0.97, 0.98);
const float RefractiveIndex = 1.5;

const vec3 BoxSize = vec3(5.0, 5.0, 0.5);
const vec2 BoxInitialRotation = vec2(-0.52, 0.01);

const int ORBS_NUM = 128;

// == Time Sequence =======================

float seqCameraBaseHeight = mix(
	20.0,
	mix(
		7.0 * sin(Time * 32.45),
		-10.0,
		smoothstep(0.83, 1.0, Time)
	),
	smoothstep(0.15, 0.4, Time)
);

float sequenceCameraBaseRadius() {
	return mix(
		30.0,
		mix(
			15.0,
			7.0,
			smoothstep(0.85, 1.0, Time)
		),
		smoothstep(0.25, 0.5, Time)
	);
}

vec3 sequenceCameraTarget() {
	return mix(vec3(0.0), vec3(0.0, 10.0, 0.0), smoothstep(0.85, 0.95, Time));
}

float _cubeRotationStart = 0.1;
vec2 seqCubeRotation = mix(
	BoxInitialRotation,
	BoxInitialRotation + vec2((Time - _cubeRotationStart) * 23.2, (Time - _cubeRotationStart) * 28.2),
	step(_cubeRotationStart, Time)
);

float _cubeSizeStart = 0.5;
float _cubeSizeTime = max(0.0, Time - _cubeSizeStart) ;
vec3 seqCubeSize = mix(
	vec3(5.0, 5.0, 0.5), 
	vec3(5.0) + vec3(4.5) * sin(vec3(Time * 83.43, Time * 72.43, Time * 99.342)),
	smoothstep(0.2, 1.0, Time)
);

// 0: disappear, 1: appear
float sequenceOrbAppear(float i) {
	float offset = 0.3 * sin(i * 19.43);
	return smoothstep(0.3 + offset, 0.4 + offset, Time);
}

float _orbMoveStart = 0.6;
float seqOrbPosRadian(float i) {
	float moveStart = _orbMoveStart + 0.03 * sin(61.43 * i);
	return -pow(max(0.0, (Time - moveStart)), 3.0) * (312.32 + 24.43 * sin(39.43 * i)) * step(moveStart, Time);
}

float seqOrbPosHeight(float i) {
	float moveHeight = pow(max(0.0, (Time - _orbMoveStart)), 3.0) * (435.34 + sin(i * 342.432) * 143.5);
	float finalHeight = 20.0;
	return mix(
		5.0 * sin(43.43 * i + moveHeight * step(_orbMoveStart, Time)),
		finalHeight,
		smoothstep(0.8, 1.0, Time)
	);
}

float seqOrbPosRadius(float i, float invOrbsNum) {
	return mix(
		20.0 + 10.0 * i * invOrbsNum,
		5.0,
		smoothstep(0.8, 1.0, Time)
	);
}

float seqOrbRadiusScale = 1.0 + 3.0 * smoothstep(0.9, 0.98, Time);

// 0: no mix, 1: perfectly back buffer 
float seqMixBackBuffer = 0.5 + 0.45 * smoothstep(0.75, 1.0, Time);

// 0: perfect original, 1: perfect white
float seqWhiteOut = smoothstep(0.9, 0.98, Time);

// =============================================


vec3 hsv2rgb(float h, float s, float v) {
	h = mod(h, 360.0);
	if (s == 0.0) {
		return vec3(0.0, 0.0, 0.0);
	}
	float c = v * s;
	float i = h / 60.0;	
	float x = c * (1.0 - abs(mod(i, 2.0) - 1.0)); 
	return vec3(v - c) + (i < 1.0 ? vec3(c, x, 0.0) : 
			     		    i < 2.0 ? vec3(x, c, 0.0) : 
			     		    i < 3.0 ? vec3(0.0, c, x) : 
			     		    i < 4.0 ? vec3(0.0, x, c) : 
			     		    i < 5.0 ? vec3(x, 0.0, c) : 
			     		                   vec3(c, 0.0, x));		      
}

float spotLightFalloff(vec3 lightDir) {
	return smoothstep(CosineUmbra, CosinePenumbra, dot(LightDirection, lightDir));
}


float roundBox(vec3 p, vec3 size, float radius) {
	vec3 d = abs(p) - size;
	return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0)) - radius;
}


vec3 rotateX(vec3 p, float radian) {
	float s = sin(-radian);
	float c = cos(-radian);
	return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}

vec3 rotateY(vec3 p, float radian) {
	float s = sin(-radian);
	float c = cos(-radian);
	return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}

float scene(vec3 p) {
	p = rotateX(rotateY(p, seqCubeRotation.y), seqCubeRotation.x);
	return roundBox(p, seqCubeSize, 1.0);
}

vec3 normal(vec3 p) {
	float d = 0.001;
	return normalize(vec3(
		scene(p + vec3(d, 0.0, 0.0)) - scene(p + vec3(-d, 0.0, 0.0)),
		scene(p + vec3(0.0, d, 0.0)) - scene(p + vec3(0.0, -d, 0.0)),
		scene(p + vec3(0.0, 0.0, d)) - scene(p + vec3(0.0, 0.0, -d))
	));
}

float schlickFresnel(float refractiveIndex, float cosine) {
	float r0 = (1.0 - refractiveIndex) / (1.0 + refractiveIndex);
	r0 = r0 * r0;
	return r0 + (1.0 - r0) * pow(1.0 - cosine, 5.0);
}


float distanceRayPoint(vec3 origin, vec3 ray, vec3 p) {
	vec3 op = p - origin;
	float d = length(op);
	op = normalize(op);
	float c = dot(op, ray);
	return c > 0.0 ? d * sqrt(1.0 - c * c) : 10000.0; // ignore orbs at opposite side
}

vec4 orb(vec3 origin, vec3 ray, vec3 point, vec3 color, float radius, float intensity) {
	float d = distanceRayPoint(origin, ray, point);
	float a = 1.0 - smoothstep(0.0, radius, d);
	return  vec4(a * color * intensity, min(1.0, a * intensity));
}

vec3 orbs(vec3 origin, vec3 ray) {
	vec4 c = vec4(0.0);
	float invOrbsNum = 1.0 / float(ORBS_NUM);
	for (int i = 0; i < ORBS_NUM; i++) {
		float fi = float(i);
		vec3 color = (hsv2rgb(48.32 * fi * 10.0, 1.0, 1.0) + 0.1) * 3.0;
		float posRadius = seqOrbPosRadius(fi, invOrbsNum); // this must become bigger gradually
		float posRadian = 34.43 * fi + seqOrbPosRadian(fi);
		float posHeihgt = seqOrbPosHeight(fi);
		vec3 point = vec3(posRadius * cos(posRadian), posHeihgt, posRadius * sin(posRadian));
		float radius = (1.0 + 2.0 * pow(fract(fi * 92.34), 2.0)) * seqOrbRadiusScale;
		float intensity = (2.0 + sin(fi * 343.3)) * sequenceOrbAppear(fi);
		vec4 o = orb(origin, ray, point, color, radius, intensity);
		c.rgb +=o.rgb  * ((1.0 - c.a) * o.a);
		c.a = (1.0 - c.a) * o.a;
	}
	return c.rgb;
}

vec3 floorShadow(vec3 p) {
	vec3 toLight = LightPosition - p;
	float d = 0.0;
	float minD = 10000.0;
	for (int i = 0; i < 16; i++) {
		d = scene(p);
		minD = min(d, minD);
		p += toLight * d;
	}	
	return mix(RefractiveColor, vec3(1.0), smoothstep(0.0, 0.1, minD));
}

vec3 floor(vec3 origin, vec3 ray, float plane) {
	if (ray.y >= 0.0)  {
		return vec3(0.0);
	}
	float d = (plane  - origin.y) / ray.y;
	vec2 uv = origin.xz + ray.xz * d;
	vec3 c = sin(uv.x * 2.0) * sin(uv.y * 2.0) > 0.0 ? vec3(0.3) : vec3(0.7);
	vec3 p = vec3(uv.x, 0.0, uv.y);
	vec3 l = normalize(LightPosition - p);
	float NdotL = dot(FloorNormal, l);
	#ifdef USE_FLOOR_SHADOW
	return c * NdotL * LightColor * spotLightFalloff(-l) * floorShadow(p);
	#else
	return c * NdotL * LightColor * spotLightFalloff(-l);
	#endif

}

vec3 background(vec3 origin, vec3 ray) {
	return floor(origin, ray, FloorHeight) + orbs(origin, ray);
}

bool raymarch(vec3 origin, vec3 ray, out vec3 point) {
	point = origin;
	for (int i = 0; i < 64; i++) {
		float d = scene(point);
		point += ray * d;
		if (d < 0.01) {
			return true;
		}
	}
	return false;
}

vec3 specularLighting(vec3 reflectDir, vec3 lightDir) {
	float RdotL = dot(reflectDir, lightDir);
	return LightColor * max(0.0, RdotL);
}

vec3 calcOutRay(vec3 point, vec3 ray) {
	vec3 normalDir = normal(point);
	vec3 refractDir = refract(ray, -normalDir, RefractiveIndex);
	return length(refractDir) > 0.001 ? refractDir : reflect(ray, -normalDir);
}

vec3 raymarchFromCamera(vec3 origin, vec3 ray) {
	vec3 p;
	if(raymarch(origin, ray, p)) {
		vec3 normalDir = normal(p);
		vec3 reflectDir = reflect(ray, normalDir);
		float NdotV = dot(normalDir, -ray);
		float fresnel = schlickFresnel(RefractiveIndex, NdotV);
		vec3 lightDir = normalize(LightPosition - p);
		vec3 specular = fresnel * specularLighting(reflectDir, lightDir);
		
		vec3 refractDir = refract(ray, normalDir,  1.0 / RefractiveIndex);
			
		vec3 op;
		raymarch(p + refractDir * 30.0, -refractDir, op); // no need to check hitting
		vec3 outDir = calcOutRay(op, refractDir);
		return specular + (1.0 - fresnel) * background(op, outDir) * RefractiveColor;	
	}
	return background(origin, ray);
}

// with camera shake
void perspective(in vec2 st, in vec3 position, in vec3 target, in vec3 vup, in float vfov, in float aspect, out vec3 origin, out vec3 ray) {
    vec2 uv = st * 2.0 - 1.0;
    float radian = vfov * PI / 180.0;
    float h = tan(radian * 0.5);
    float w = h * aspect;
    vec3 front = normalize(target - position);
    vec3 right = cross(front, normalize(vup));
    vec3 up = cross(right, front);
    target += (right * sin(Time  * 254.3) + up * sin(Time * 234.32)) * 0.15; // add camera shake

    // recalculate basis vector
    front = normalize(target - position);
    right = normalize(cross(front, normalize(vup)));
    up = normalize(cross(right, front));
    origin = position + (right * sin(Time * 224.3) + up * sin(Time * 186.32)) * 0.15; // add camera shake
    ray =  normalize(right * w * uv.x + up * h * uv.y + front);  
}

vec3 sample(vec2 st) {
	float camRadian = Time * 10.0;
	float h = seqCameraBaseHeight;
	float camRadius = sequenceCameraBaseRadius();
	vec3 origin = vec3(camRadius * cos(camRadian), h, camRadius * sin(camRadian));
	vec3 target = sequenceCameraTarget();
	vec3 ray;
	perspective(st, origin, target, vec3(0.0, 1.0, 0.0), 60.0, resolution.x / resolution.y, origin, ray);

	return  raymarchFromCamera(origin, ray);
}

void main(void) {
	vec2 st = gl_FragCoord.xy / resolution.xy;
	#ifdef MULTI_SAMPLING
	vec3 current 
		= (sample((gl_FragCoord.xy + vec2( 0.25,  0.25)) / resolution.xy) 
		+   sample((gl_FragCoord.xy + vec2(-0.25, 0.25)) / resolution.xy) 
		+   sample((gl_FragCoord.xy + vec2( 0.25, -0.25)) / resolution.xy) 
		+   sample((gl_FragCoord.xy + vec2(-0.25, -0.25)) / resolution.xy)) / 4.0;
	#else
	vec3 current = sample(st);
	#endif
	current = pow(current, vec3(RECIPROCAL_GAMMA));
	vec3 prev = texture2D(backBuffer, st).xyz;
	vec3 color = mix(current, prev, seqMixBackBuffer);
	gl_FragColor = vec4(mix(color, vec3(1.0), seqWhiteOut), 1.0);
}